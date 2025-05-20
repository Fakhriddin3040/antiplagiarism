import asyncio
import logging
from starlette import status

from src.app.infrastructure.db.orm import User, Document
from src.app.infrastructure.db.orm.models import File
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.documents.document_author import (
    DocumentAuthorRepository,
)
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.schemas.document.document_schemas import (
    DocumentCreateSchema,
)
from src.app.infrastructure.schemas.document.file_schemas import FileCreateSchema
from src.app.infrastructure.services.document.document_index_service import (
    DocumentIndexService,
)
from src.app.infrastructure.services.file.file_create_service import FileCreateService
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.constants.models_fields import DocumentField
from src.utils.exceptions.api_exception import ApiExceptionDetail, ApiException
from src.utils.functions.datetime import get_datetime_utc

logger = logging.getLogger(__name__)


class DocumentCreateService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        folder_repo: FolderRepository,
        author_repo: DocumentAuthorRepository,
        file_repo: FileRepository,
        file_create_service: FileCreateService,
        document_index_service: DocumentIndexService,
    ):
        self.document_repo = document_repo
        self.folder_repo = folder_repo
        self.author_repo = author_repo
        self.file_repo = file_repo
        self.file_create_service = file_create_service
        self.document_index_service = document_index_service

    async def create(self, user: User, schema: DocumentCreateSchema) -> Document:
        logger.info(f"Creating document {schema.title}")
        logger.debug("Schema: %s, user: %s", schema.model_dump(), user.id)

        await self.validate(user=user, schema=schema)

        logger.info("Validation passed")

        file = await self._create_file(user=user, schema=schema)
        document_data = schema.model_dump()
        document_data.update(created_by_id=user.id, file_id=file.id)
        document_data[DocumentField.FILE.as_foreign_key] = file.id
        del document_data[DocumentField.FILE]

        index_it = document_data.pop("index_it")

        document = await self.document_repo.create(document_data)
        document.file = file

        if index_it:
            await self._index_document(document=document)
            await self._set_indexed(document=document)

        document.file = file

        return document

    async def _index_document(self, document: Document):
        await self.document_index_service.index(document=document)

    async def _create_file(self, user: User, schema: DocumentCreateSchema) -> File:
        logger.info("Creating file")
        file_create_schema = FileCreateSchema(
            title=schema.title,
            description=schema.description,
            file=schema.file,
        )
        file = await self.file_create_service.create(
            user=user, schema=file_create_schema
        )
        return file

    async def _set_indexed(self, document: Document):
        logger.info("Setting indexed to document %s", document.id)
        obj_in = {
            DocumentField.INDEXED_AT: get_datetime_utc(),
            DocumentField.IS_INDEXED: True,
        }
        await self.document_repo.update(obj_in=obj_in, db_obj=document)
        logger.info("Indexed document %s", document.id)

    async def validate(self, user: User, schema: DocumentCreateSchema) -> None:
        logger.info(f"Validating new document {schema.title}")

        errors = await asyncio.gather(
            self._validate_author(user_id=user.id, author_id=schema.author_id),
            self._validate_folder(user_id=user.id, folder_id=schema.folder_id),
            self._validate_author_title_uniqueness(user=user, schema=schema),
        )
        errors = [exc for exc in errors if exc is not None]

        logger.info(
            "Validation for document %s completed. The api exception details: %s",
            schema.title,
            errors,
        )
        if errors:
            logger.info("The exception details exists. Throwing error...")

            raise ApiException(
                details=errors,
                status_code=status.HTTP_400_BAD_REQUEST,
                exception_status=status.HTTP_400_BAD_REQUEST,
                message=ApiExceptionMessage.DETAILED_ERROR,
            )

    async def _validate_author_title_uniqueness(
        self, user: User, schema: DocumentCreateSchema
    ):
        if await self.document_repo.filter_exists(
            author_id=schema.author_id, title=schema.title
        ):
            logger.info(
                "User %s already has a document with given title (%s) and author (%s)",
                user.id,
                schema.title,
                schema.author_id,
            )
            return ApiExceptionDetail(
                status=ApiExceptionStatusCodes.UNIQUE_CONSTRAINT,
                fields=[DocumentField.AUTHOR, DocumentField.TITLE],
            )
        logger.info("Author and the doc title are unique together")

    async def _validate_author(
        self, user_id: ID_T, author_id: ID_T
    ) -> None | ApiExceptionDetail:
        if not await self.author_repo.filter_exists(
            id=author_id, created_by_id=user_id
        ):
            logger.info("Author %s not found for user %s", author_id, user_id)

            return ApiExceptionDetail(
                status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
                field=DocumentField.AUTHOR.as_foreign_key,
            )
        logger.info(f"Author {author_id} found for user {author_id}")

    async def _validate_folder(
        self, user_id: ID_T, folder_id: ID_T
    ) -> None | ApiExceptionDetail:
        if not await self.folder_repo.filter_exists(
            id=folder_id, created_by_id=user_id
        ):
            logger.info("Folder %s not found for user %s", folder_id, user_id)

            return ApiExceptionDetail(
                status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
                field=DocumentField.FOLDER.as_foreign_key,
            )
        logger.info("Folder %s found for user %s", folder_id, user_id)
