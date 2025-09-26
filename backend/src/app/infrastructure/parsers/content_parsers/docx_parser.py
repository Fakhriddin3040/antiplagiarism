from __future__ import annotations

from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import Generator, Iterable

from docx_parser import DocumentParser
from src.app.core.abstracts.text_parser import AbstractParser


class DocxParser(AbstractParser):
    def __init__(self, path: str | Path, repeat_threshold: int = 3):
        super().__init__(path, repeat_threshold=repeat_threshold)
        self.parser = DocumentParser(filename=self.path)

    def parse(self) -> str:
        # 1) материализуем, чтобы можно было пройтись несколько раз
        items = list(self.parser.parse())

        # 2) считаем повторяющиеся строки по тем же данным
        common_lines = self.scan_common(items)

        # 3) парсим текст
        parts = [
            part
            for part in self._parse(items)
            if part and part not in common_lines and not part.isdigit()
        ]
        return " ".join(parts)

    def _parse(self, node) -> Generator[str, None, None]:
        """Бережный обход: dict['text'] + значения; (type, val); списки; строки."""
        if node is None:
            return

        # строка
        if isinstance(node, str):
            s = node.strip()
            if s:
                yield s
            return

        # пара (type, value)
        if isinstance(node, tuple) and len(node) == 2:
            _, val = node
            yield from self._parse(val)
            return

        # словарь
        if isinstance(node, Mapping):
            txt = (node.get("text") or "").strip()
            if txt:
                yield txt
            for v in node.values():
                if isinstance(v, (Mapping, Sequence)) and not isinstance(
                    v, (str, bytes)
                ):
                    yield from self._parse(v)
            return

        # последовательность (list/tuple и т.п.), но не строка/bytes
        if isinstance(node, Sequence) and not isinstance(node, (str, bytes)):
            for el in node:
                yield from self._parse(el)
            return
        # остальное игнор

    def parse_list(self, items: Iterable) -> Generator[str, None, None]:
        # можно удалить, но если нужно — используем тот же обход
        yield from self._parse(items)

    def _scan_recursively(self, node: Iterable):
        # используем тот же устойчивый обход, чтобы счётчик совпадал с _parse
        for s in self._parse(node):
            self._counter[s] += 1
