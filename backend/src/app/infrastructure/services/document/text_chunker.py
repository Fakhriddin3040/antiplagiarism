from typing import List

from src.app.core.services import TextIndexer
from src.app.core.services.text.noice_cleaner import TextNoiseCleaner
from src.app.infrastructure.db.orm.models import DocumentChunk


class TextChunker:
    def __init__(self, cleaner: TextNoiseCleaner, indexer: TextIndexer):
        self.cleaner = cleaner
        self.indexer = indexer

    def chunk_text(
        self,
        text: str,
        min_size: int = 80,  # минимум слов в чанке
        max_size: int = 130,  # максимум
        step: int = 50,  # перекрытие
    ) -> List[str]:
        """
        Делит текст на чанки словами:
        • скользящее окно (step)
        • гарантирует, что хвост < min_size прилипает к предыдущему чанку
        • короткие тексты (< min_size) возвращаются одним куском
        """
        words = text.split()
        n = len(words)
        if n == 0:
            return []

        # коротыш — одним блоком
        if n <= min_size:
            return [" ".join(words)]

        chunks: List[List[str]] = []
        i = 0
        while i < n:
            end = min(i + max_size, n)
            chunk_words = words[i:end]

            # если последний хвост меньше минимума → лепим к предыдущему
            if end == n and len(chunk_words) < min_size and chunks:
                chunks[-1].extend(chunk_words)
                break

            chunks.append(chunk_words)

            # дошли до конца
            if end == n:
                break

            i += step

        # в текст
        res = [" ".join(c) for c in chunks]
        return res

    def process(self, raw_text: str, **kwargs) -> List[DocumentChunk]:
        cleaned_text = self.cleaner.clean(raw_text)
        chunk_texts = self.chunk_text(cleaned_text)

        result: List[DocumentChunk] = []
        for i, chunk in enumerate(chunk_texts):
            vector = self.indexer.index_vector(chunk)
            result.append(
                DocumentChunk(
                    idx=i,
                    content=chunk,
                    vector=vector,
                    size=len(chunk.split()),
                    **kwargs
                )
            )

        return result
