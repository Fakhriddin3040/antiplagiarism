from fastapi import Depends

from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.documents.document_chunk import (
    DocumentChunkRepository,
)
from src.app.infrastructure.db.repositories.plagiarism_results.plagiarism_check import (
    PlagiarismCheckRepository,
)
from src.app.infrastructure.db.repositories.plagiarism_results.plagiarism_match import (
    PlagiarismMatchRepository,
)
from src.app.infrastructure.deps.repositories import (
    get_document_chunk_repository,
    get_plagiarism_check_repository,
    get_plagiarism_match_repository,
    get_document_repository,
)
from src.app.infrastructure.services.check.plagiarism_check_service import (
    PlagiarismCheckService,
)


def get_plagiarism_check_create_service(
    doc_chunk_repo: DocumentChunkRepository = Depends(get_document_chunk_repository),
    check_repo: PlagiarismCheckRepository = Depends(get_plagiarism_check_repository),
    match_repo: PlagiarismMatchRepository = Depends(get_plagiarism_match_repository),
    document_repo: DocumentRepository = Depends(get_document_repository),
) -> PlagiarismCheckService:
    return PlagiarismCheckService(
        chunk_repo=doc_chunk_repo,
        check_repo=check_repo,
        match_repo=match_repo,
        document_repo=document_repo,
    )
