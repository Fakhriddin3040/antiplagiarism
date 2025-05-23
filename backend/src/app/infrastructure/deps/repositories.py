from fastapi import Depends
from src.app.infrastructure.db.orm.models import DocumentChunk, PlagiarismMatch
from src.app.infrastructure.db.orm.models.documents import Folder

from src.app.infrastructure.db.orm import User, Document, PlagiarismCheck
from src.app.infrastructure.db.orm.models import DocumentAuthor
from src.app.infrastructure.db.orm.models.documents.file import File
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.documents.document_author import (
    DocumentAuthorRepository,
)
from src.app.infrastructure.db.repositories.documents.document_chunk import (
    DocumentChunkRepository,
)
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.db.repositories.plagiarism_results.plagiarism_check import (
    PlagiarismCheckRepository,
)
from src.app.infrastructure.db.repositories.plagiarism_results.plagiarism_match import (
    PlagiarismMatchRepository,
)
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.app.infrastructure.deps import get_db


def get_user_repository(db=Depends(get_db)) -> UserRepository:
    return UserRepository(db=db, model=User)


def get_file_repository(db=Depends(get_db)) -> FileRepository:
    return FileRepository(db=db, model=File)


def get_author_repository(db=Depends(get_db)) -> DocumentAuthorRepository:
    return DocumentAuthorRepository(db=db, model=DocumentAuthor)


def get_folder_repository(db=Depends(get_db)) -> FolderRepository:
    return FolderRepository(db=db, model=Folder)


def get_document_repository(db=Depends(get_db)) -> DocumentRepository:
    return DocumentRepository(db=db, model=Document)


def get_document_chunk_repository(db=Depends(get_db)) -> DocumentChunkRepository:
    return DocumentChunkRepository(db=db, model=DocumentChunk)


def get_plagiarism_check_repository(db=Depends(get_db)) -> PlagiarismCheckRepository:
    return PlagiarismCheckRepository(db=db, model=PlagiarismCheck)


def get_plagiarism_match_repository(db=Depends(get_db)) -> PlagiarismMatchRepository:
    return PlagiarismMatchRepository(db=db, model=PlagiarismMatch)
