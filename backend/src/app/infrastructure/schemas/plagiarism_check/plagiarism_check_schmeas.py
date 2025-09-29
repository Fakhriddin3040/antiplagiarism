from typing import List, Optional

from pydantic import Field

from src.app.core.enums import PlagiarismCheckStatusEnum, PlagiarismCheckVerdictEnum
from src.base.schema import AbstractPydanticSchema
from src.base.types.pytypes import ID_T


class PlagiarismMatch(AbstractPydanticSchema):
    source_chunk_id: ID_T
    matched_chunk_id: ID_T
    similarity: float


class PlagiarismCheckDetailedSchema(AbstractPydanticSchema):
    max_similarity_score: float
    status: PlagiarismCheckStatusEnum
    chunks_count: int
    matches_count: int
    average_chunks_similarity: float
    verdict: PlagiarismCheckVerdictEnum
    matched_chunks: Optional[List[PlagiarismMatch]] = Field(default_factory=list)
