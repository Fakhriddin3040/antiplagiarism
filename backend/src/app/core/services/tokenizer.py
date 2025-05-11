import re
from typing import Optional, List

from src.app.core.constants import ALL_STOP_WORDS


class TextTokenizer:
    STOP_WORDS = ALL_STOP_WORDS

    def text_into_ngrams(
        self, text: str, ngram_size: int, clear: Optional[bool] = True
    ) -> List[str]:
        """
        :param text: Text to be split
        :param ngram_size: Chunk size by words
        :param clear: Clear text before splitting
        :return: List of words(str)
        """
        tokens = self.simple_tokenize(text=text)
        if clear:
            tokens = self.clean_tokens(tokens)

        ngrams = [
            " ".join(tokens[i : i + ngram_size])
            for i in range(0, len(tokens) - ngram_size + 1)
        ]
        return ngrams

    def tokens_into_ngrams(
        self, tokens: List[str], ngram_size: int, clean: Optional[bool] = False
    ) -> List[str]:
        if clean:
            tokens = self.clean_tokens(tokens)
        ngrams = [
            " ".join(tokens[i : i + ngram_size])
            for i in range(0, len(tokens) - ngram_size + 1)
        ]
        return ngrams

    def simple_tokenize(self, text) -> List[str]:
        """
        Split text into tokens
        :param text:
        :return:
        """
        return re.findall(r"\b\w+\b", text.lower())

    def clean_tokens(self, tokens: List[str]) -> List[str]:
        result = [w for w in tokens if w not in self.STOP_WORDS]
        return result

    def clean(self, text: str) -> str:
        tokens = self.simple_tokenize(text)
        return " ".join(token for token in self.clean_tokens(tokens))
