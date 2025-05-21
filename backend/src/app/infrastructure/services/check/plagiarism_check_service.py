import logging

from src.app.core.enums import PlagiarismCheckStatusEnum, PlagiarismCheckVerdictEnum
from src.app.infrastructure.constants import SIMILARITY_THRESHOLD, MIN_COVERAGE
from src.app.infrastructure.db.orm import PlagiarismCheck, User
from src.app.infrastructure.db.orm.models import PlagiarismMatch
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
from src.app.infrastructure.schemas.document.chunk_schemas import ChunkRead
from src.base.types.pytypes import ID_T
from src.utils.constants.models_fields import DocumentField

logger = logging.getLogger(__name__)


class PlagiarismCheckService:
    def __init__(
        self,
        chunk_repo: DocumentChunkRepository,
        check_repo: PlagiarismCheckRepository,
        match_repo: PlagiarismMatchRepository,
        document_repo: DocumentRepository,
    ):
        self.chunk_repo = chunk_repo
        self.check_repo = check_repo
        self.match_repo = match_repo
        self.document_repo = document_repo

    async def check(self, user: User, document_id: ID_T) -> PlagiarismCheck:
        logger.info(f"Checking document {document_id} for plagiarism")
        check = PlagiarismCheck(
            document_id=document_id,
            status=PlagiarismCheckStatusEnum.PENDING,
            max_similarity_score=0.0,
            created_by_id=user.id,
        )
        await self.check_repo.save(check)

        source_chunks = await self.chunk_repo.get_candidate_chunks(document_id)

        logger.debug(
            "Source chunks data: %s",
            "\n".join(str(chunk.model_dump()) for chunk in source_chunks),
        )

        matches = []
        max_similarity = 0.0
        chunk_most_matched_map = {}
        total_similarity = 0.0

        logger.info("Iterating over chunks")
        for src_chunk in source_chunks:
            max_sim_candidate = None
            for candidate in src_chunk.candidates:
                if candidate.similarity >= SIMILARITY_THRESHOLD:
                    match = PlagiarismMatch(
                        check_id=check.id,
                        source_chunk_id=src_chunk.id,
                        matched_chunk_id=candidate.id,
                        similarity=candidate.similarity,
                    )
                    matches.append(match)
                    max_similarity = max(max_similarity, candidate.similarity)
                    max_sim_candidate = (
                        max([max_sim_candidate, candidate], key=lambda x: x.similarity)
                        if max_sim_candidate
                        else candidate
                    )
                    total_similarity += candidate.similarity

            chunk_most_matched_map[src_chunk] = max_sim_candidate

        logger.debug("Chunk with max similarity: %s", max_similarity)

        await self.match_repo.batch_save(matches)

        logger.info("Check in final stage. Making verdict...")
        check.max_similarity_score = max_similarity
        check.status = PlagiarismCheckStatusEnum.COMPLETE
        check.matches_found = len(matches)
        check.chunks_found = len(source_chunks)

        chunks_found_coverage = self._get_coverage(
            chunks=source_chunks, thr=SIMILARITY_THRESHOLD
        )
        logger.info("Calculated chunks coverage: %s", chunks_found_coverage)

        if (
            max_similarity >= SIMILARITY_THRESHOLD
            and chunks_found_coverage > MIN_COVERAGE
        ):
            verdict = PlagiarismCheckVerdictEnum.PLAGIARISM
        elif (
            max_similarity >= SIMILARITY_THRESHOLD
            or chunks_found_coverage > MIN_COVERAGE
        ):
            verdict = PlagiarismCheckVerdictEnum.PARTIAL_PLAGIARISM
        else:
            verdict = PlagiarismCheckVerdictEnum.UNIQUE

        logger.info(f"Verdict: {verdict}")

        check.verdict = verdict

        logger.info("Saving result into db")
        await self.check_repo.save(check)
        await self._set_document_checked(document_id, check)

        return check

    async def _set_document_checked(self, doc_id: ID_T, check: PlagiarismCheck) -> None:
        doc = await self.document_repo.get_by_id(id_=doc_id)

        update_data = {
            DocumentField.CHECKED: True,
            DocumentField.VERDICT: check.verdict,
            DocumentField.CHECKED_AT: check.created_at,
        }

        await self.document_repo.update(db_obj=doc, obj_in=update_data)

    def _get_coverage(self, chunks: list[ChunkRead], thr: float) -> float:
        if not chunks:
            return 0.0
        covered = sum(
            1 for ch in chunks if any(c.similarity >= thr for c in ch.candidates)
        )
        return covered / len(chunks)
