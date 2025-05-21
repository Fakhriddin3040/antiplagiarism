from pydantic import BaseModel, Field
from typing import List

from src.base.types.pytypes import ID_T


class ChunkCandidate(BaseModel):
    id: ID_T
    document_id: ID_T
    idx: int
    content: str
    similarity: float

    class Config:
        from_attributes = True

    def __hash__(self) -> int:
        return hash(self.id)


class ChunkRead(BaseModel):
    id: ID_T
    document_id: ID_T
    idx: int
    content: str
    candidates: List[ChunkCandidate] = Field(default_factory=list)

    class Config:
        from_attributes = True

    def __hash__(self) -> int:
        return hash(self.id)
