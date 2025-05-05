import hashlib
import re
from typing import Optional, List

from src.app.core.constants import ALL_STOP_WORDS, NGRAMM_DEFAULT_SIZE


class TextTokenizer:
    STOP_WORDS = ALL_STOP_WORDS

    @staticmethod
    def split_into_ngrams(
        text: str, ngram_size: int, clear: Optional[bool] = True
    ) -> List[str]:
        """
        :param text: Text to be split
        :param ngram_size: Chunk size by words
        :param clear: Clear text before splitting
        :return: List of words(str)
        """
        tokens = TextTokenizer.simple_tokenize(text=text)
        if clear:
            tokens = TextTokenizer.clean_tokens(tokens)

        ngrams = [
            " ".join(tokens[i : i + ngram_size])
            for i in range(0, len(tokens) - ngram_size + 1)
        ]
        return ngrams

    @staticmethod
    def simple_tokenize(text):
        """
        Split text into tokens
        :param text:
        :return:
        """
        return re.findall(r"\b\w+\b", text.lower())

    @staticmethod
    def clean_tokens(tokens: List[str]) -> List[str]:
        result = [w for w in tokens if w not in TextTokenizer.STOP_WORDS]
        return result


class TextIndexer:
    tokenizer: TextTokenizer = TextTokenizer

    def index(
        self, text: str, ngram_size: Optional[int] = NGRAMM_DEFAULT_SIZE
    ) -> List[str]:
        ngrams = self.tokenizer.split_into_ngrams(
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


class AntiplagiarismService:
    def check(self, text: str, target: str) -> bool:
        pass
