from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.app.infrastructure.functions.file import validate_file_extension
from src.app.infrastructure.helpers.file_upload_helper import FileHelper
from src.app.infrastructure.schemas.document.file_schemas import FileCreateSchema
from src.utils.constants.models_fields import FileFields


class FileCreateService:
    def __init__(
        self,
        helper: FileHelper,
        file_repo: FileRepository,
    ):
        self._helper = helper
        self._file_repo = file_repo

    async def create(self, user: User, params: FileCreateSchema) -> None:
        extension = await validate_file_extension(file=params.file)

        path = self._helper.upload(io=params.file.file)
        data = params.model_dump()
        del data["file"]
        data.update(
            {
                FileFields.PATH: str(path),
                FileFields.OWNER_ID: user.id,
                FileFields.EXTENSION: extension,
            },
        )
        await self._file_repo.create(data)
