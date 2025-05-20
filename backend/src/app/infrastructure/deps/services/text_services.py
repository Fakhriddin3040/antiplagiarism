from fastapi import Depends

from src.app.core.services import TextIndexer, TextTokenizer


def get_text_tokenizer() -> TextTokenizer:
    return TextTokenizer()


def get_text_indexer(text_tokenizer=Depends(get_text_tokenizer)) -> TextIndexer:
    return TextIndexer(tokenizer=text_tokenizer)
