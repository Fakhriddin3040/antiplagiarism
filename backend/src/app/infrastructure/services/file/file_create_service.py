import logging
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.orm.models import File
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.app.infrastructure.functions.file import validate_file_extension
from src.app.infrastructure.helpers.file_upload_helper import FileHelper
from src.app.infrastructure.schemas.document.file_schemas import FileCreateSchema
from src.utils.constants.models_fields import FileField


logger = logging.getLogger(__name__)


class FileCreateService:
    def __init__(
        self,
        helper: FileHelper,
        file_repo: FileRepository,
    ):
        self._helper = helper
        self._file_repo = file_repo

    async def create(self, user: User, schema: FileCreateSchema) -> File:
        logger.info(f"Creating file {schema.title}")
        extension, mimetype = await validate_file_extension(file=schema.file)

        path = self._helper.upload(io=schema.file.file)
        data = schema.model_dump()
        del data["file"]
        data.update(
            {
                FileField.PATH: str(path),
                FileField.CREATED_BY.as_foreign_key: user.id,
                FileField.EXTENSION: extension,
                FileField.MIMETYPE: mimetype,
            },
        )
        logger.info(f"Creating file record on db. Data: {data}")
        logger.info(f"Db instance for file `{schema.title}` created successfully")
        return await self._file_repo.create(data)
