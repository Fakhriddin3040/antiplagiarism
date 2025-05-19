from fastapi import Depends

from src.app.infrastructure.deps.repositories import get_file_repository
from src.app.infrastructure.helpers.file_upload_helper import FileHelper
from src.app.infrastructure.services.file.file_create_service import FileCreateService
from src.app.infrastructure.services.file.file_stream_service import FileStreamService
from src.config.settings.base import FILES_ROOT


def get_file_create_service(
    file_repo=Depends(get_file_repository),
):
    return FileCreateService(file_repo=file_repo, helper=FileHelper(root=FILES_ROOT))


def get_file_upload_service(
    file_repo=Depends(get_file_repository),
) -> FileStreamService:
    return FileStreamService(file_repo=file_repo)
