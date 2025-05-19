from fastapi import Depends

from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.deps.repositories import get_folder_repository
from src.app.infrastructure.services.folder.folder_create_service import (
    FolderCreateService,
)
from src.app.infrastructure.services.folder.folder_update_service import (
    FolderUpdateService,
)


def get_folder_create_service(
    folder_repo: FolderRepository = Depends(get_folder_repository),
) -> FolderCreateService:
    return FolderCreateService(folder_repo=folder_repo)


def get_folder_update_service(
    folder_repo: FolderRepository = Depends(get_folder_repository),
) -> FolderUpdateService:
    return FolderUpdateService(folder_repo=folder_repo)
