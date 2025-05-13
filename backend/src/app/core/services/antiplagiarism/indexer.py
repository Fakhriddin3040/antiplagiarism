import hashlib
from typing import Optional, List

from src.app.core.constants import NGRAM_DEFAULT_SIZE
from src.app.core.services.antiplagiarism.tokenizer import TextTokenizer


class TextIndexer:
    def __init__(self, tokenizer: TextTokenizer):
        self.tokenizer = tokenizer

    def index(
        self, text: str, ngram_size: Optional[int] = NGRAM_DEFAULT_SIZE
    ) -> List[str]:
        ngrams = self.tokenizer.text_into_ngrams(
            text=text,
            ngram_size=ngram_size,
            clear=True,
        )
        return self.hash_ngrams(ngrams)

    def hash(self, value: str) -> str:
        return hashlib.md5(value.encode("utf-8")).hexdigest()

    def hash_ngrams(self, ngrams: List[str]) -> List[str]:
        result = [self.hash(value) for value in ngrams]
        return result
