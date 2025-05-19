from fastapi import Depends

from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.orm.models import DocumentAuthor
from src.app.infrastructure.db.orm.models.documents.file import File
from src.app.infrastructure.db.repositories.documents.document_author import (
    DocumentAuthorRepository,
)
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.app.infrastructure.deps import get_db


def get_user_repository(db=Depends(get_db)) -> UserRepository:
    return UserRepository(db=db, model=User)


def get_file_repository(db=Depends(get_db)) -> FileRepository:
    return FileRepository(db=db, model=File)


def get_author_repository(db=Depends(get_db)) -> DocumentAuthorRepository:
    return DocumentAuthorRepository(db=db, model=DocumentAuthor)
