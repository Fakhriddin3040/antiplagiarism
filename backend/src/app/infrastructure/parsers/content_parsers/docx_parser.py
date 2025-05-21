from pathlib import Path
from typing import Generator, Iterable

from docx_parser import DocumentParser

from src.app.core.abstracts.text_parser import AbstractParser


class DocxParser(AbstractParser):
    def __init__(self, path: str | Path, repeat_threshold: int = 3):
        super().__init__(path, repeat_threshold=repeat_threshold)
        self.parser = DocumentParser(filename=self.path)

    def parse(self) -> str:
        items = self.parser.parse()

        common_lines = self.scan_common(items)

        parts = [
            part
            for part in self._parse(items)
            if part and part not in common_lines and not part.isdigit()
        ]
        return " ".join(parts)

    def _parse(self, items) -> Generator[str, None, None]:
        if not items:
            return

        if isinstance(items, dict):
            txt = (items.get("text") or "").strip()
            if txt:
                yield txt
            # пробегись по подпунктам словаря
            for v in items.values():
                if isinstance(v, (list, tuple)):
                    yield from self._parse(v)
            return

        for _, item in items:
            yield from self._parse(item)

    def parse_list(self, items: Iterable) -> Generator:
        for item in items:
            if isinstance(item, dict):
                it = item.get("text")
                if it:
                    yield it
            elif isinstance(item, list):
                yield from self.parse_list(item)

    def _scan_recursively(self, items: Iterable):
        for item in items:
            if item is None:
                continue

            # ----- dict -----
            if isinstance(item, dict):
                txt = (item.get("text") or "").strip()
                if txt:
                    self._counter[txt] += 1
                # вдруг в dict лежат вложенные списки
                for v in item.values():
                    if isinstance(v, Iterable) and not isinstance(v, str):
                        self._scan_recursively(v)

            # ----- строка -----
            elif isinstance(item, str):
                txt = item.strip()
                if txt:
                    self._counter[txt] += 1

            # ----- список / кортеж и т.д. -----
            elif isinstance(item, Iterable):
                self._scan_recursively(item)
