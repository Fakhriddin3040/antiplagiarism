import hashlib
from typing import Optional, Tuple, List

from datasketch import MinHash

from src.app.core.constants import NGRAM_DEFAULT_SIZE
from src.app.core.services.antiplagiarism.tokenizer import TextTokenizer


class TextIndexer:
    def __init__(self, tokenizer: TextTokenizer):
        self.tokenizer = tokenizer

    def index(self, text: str) -> Tuple[Tuple[str, str], ...]:
        ngrams = self.to_ngrams(text=text)
        hashed_ngrams = self.hash_ngrams(ngrams=ngrams)
        return tuple(
            (ngram, hashed_ngram) for hashed_ngram, ngram in zip(ngrams, hashed_ngrams)
        )

    def to_ngrams(
        self, text: str, ngram_size: Optional[int] = NGRAM_DEFAULT_SIZE
    ) -> Tuple[str, ...]:
        ngrams = self.tokenizer.text_into_ngrams(
            text=text,
            ngram_size=ngram_size,
            clear=True,
        )
        return ngrams

    def hash(self, value: str) -> str:
        return hashlib.md5(value.encode("utf-8")).hexdigest()

    def hash_ngrams(self, ngrams: Tuple[str, ...]) -> Tuple[str, ...]:
        result = tuple(self.hash(value) for value in ngrams)
        return result

    def index_vector(
        self, text: str, ngram_size: int = 3, num_perm: int = 128
    ) -> List[int]:
        ngrams = self.to_ngrams(text, ngram_size)
        mh = MinHash(num_perm=num_perm)
        for n in ngrams:
            mh.update(n.encode("utf8"))
        return list(mh.hashvalues)
