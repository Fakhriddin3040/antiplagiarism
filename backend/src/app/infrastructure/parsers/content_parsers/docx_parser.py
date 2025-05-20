from pathlib import Path
from typing import Generator, Iterable

from docx_parser import DocumentParser

from src.app.core.abstracts.text_parser import AbstractParser


class DocxParser(AbstractParser):
    def __init__(self, path: str | Path):
        super().__init__(path)
        self.parser = DocumentParser(filename=self.path)

    def parse(self) -> str:
        items = self.parser.parse()
        full_text = " ".join(part for part in self._parse(items=items) if part)
        return full_text

    def _parse(self, items) -> Generator[str, None, None]:
        if items is None:
            return

        elif isinstance(items, dict):
            part = items.get("text")
            if part:
                yield part
            return

        for _, item in items:
            if isinstance(item, dict):
                part = item.get("text")
                if part:
                    yield part
            elif isinstance(item, list):
                yield from self.parse_list(item)

    def parse_list(self, items: Iterable) -> Generator:
        for item in items:
            if isinstance(item, dict):
                it = item.get("text")
                if it:
                    yield it
            elif isinstance(item, list):
                yield from self.parse_list(item)
