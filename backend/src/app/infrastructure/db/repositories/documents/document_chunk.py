from sqlalchemy import text, bindparam, Float, Integer, column
from sqlalchemy.dialects.postgresql import JSONB

from src.app.infrastructure.db.orm.models import DocumentChunk
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.app.infrastructure.schemas.document.chunk_schemas import (
    ChunkRead,
    ChunkCandidate,
)
from src.base.types.pytypes import ID_T


class DocumentChunkRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_candidate_chunks(
        self,
        doc_id: ID_T,
        *,
        top_k: int = 5,
        threshold: float = 0.75,
    ) -> list[ChunkRead]:
        sql = """
            SELECT src.*,
                   json_agg(
                       json_build_object(
                           'chunk',     to_jsonb(dc.*),
                           'similarity', 1 - (src.vector <=> dc.vector)
                       )
                   ) AS candidates
            FROM   document_chunks AS src
            JOIN   LATERAL (
                SELECT c.*
                FROM   document_chunks AS c
                WHERE  c.document_id <> :doc_id
                ORDER  BY src.vector <=> c.vector
                LIMIT  :top_k
            ) AS dc ON TRUE
            WHERE  src.document_id = :doc_id
              AND  1 - (src.vector <=> dc.vector) >= :thr
            GROUP  BY src.id;
        """

        # Declare all columns including 'candidates'
        chunk_columns = [
            column(col.name, col.type) for col in DocumentChunk.__table__.columns
        ]
        chunk_columns.append(column("candidates", JSONB))

        stmt = (
            text(sql)
            .columns(*chunk_columns)
            .bindparams(
                bindparam("doc_id"),
                bindparam("top_k", type_=Integer),
                bindparam("thr", type_=Float),
            )
        )

        result = await self.db.execute(
            stmt, {"doc_id": doc_id, "top_k": top_k, "thr": threshold}
        )
        rows = result.mappings().all()  # Get rows as dictionaries

        out: list[ChunkRead] = []
        for row in rows:
            # Separate DocumentChunk data and candidates
            chunk_data = {key: row[key] for key in row.keys() if key != "candidates"}
            candidates_json = row.get("candidates", [])

            # Validate main chunk data
            src_obj = ChunkRead.model_validate(chunk_data)

            # Process candidates into ChunkCandidate objects
            cand_list = [
                ChunkCandidate(
                    **cand_json["chunk"],  # Unpacks chunk fields
                    similarity=cand_json["similarity"],
                )
                for cand_json in candidates_json
            ]
            src_obj.candidates = cand_list
            out.append(src_obj)

        return out
