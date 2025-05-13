from typing import Optional

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from src.app.core.services.antiplagiarism.tokenizer import TextTokenizer


class AntiplagiarismService:
    def __init__(self, text_tokenizer: Optional[TextTokenizer] = None):
        self.tokenizer = text_tokenizer or TextTokenizer()
        self.vectorizer = CountVectorizer()

    def term_frequency_check(self, text: str, target: str) -> float:
        text = self.tokenizer.clean(text)
        target = self.tokenizer.clean(target)
        self.vectorizer.fit([text, target])
        vectors = self.vectorizer.transform([text, target])
        similarity = cosine_similarity(vectors[0], vectors[1]).item()
        return similarity
