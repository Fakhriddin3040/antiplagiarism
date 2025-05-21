from __future__ import annotations
from abc import ABC, abstractmethod
from collections import Counter
from pathlib import Path
from typing import Iterable, Generator


class AbstractParser(ABC):
    def __init__(self, path: str | Path, repeat_threshold: int = 3):
        self.path = Path(path)
        self._counter: Counter[str] = Counter()
        self._threshold = repeat_threshold

    # ---------- интерфейс ----------
    @abstractmethod
    def parse(self) -> str: ...

    def get_file_content(
        self, mode="r", encoding="utf-8", **kwargs
    ) -> Generator[str, None, None]:
        """Строчка за строчкой, без \n на хвосте."""
        with self.path.open(mode, encoding=encoding, **kwargs) as f:
            for line in f:
                yield line.rstrip("\n")

    def read_text(self, mode="r", encoding="utf-8", **kwargs) -> str:
        """Прочитать весь файл в строку."""
        with self.path.open(mode, encoding=encoding, **kwargs) as f:
            return f.read()

    def scan_common(self, items: Iterable) -> set[str]:
        """Вернёт множество повторяющихся строк ≥ threshold."""
        self._counter.clear()
        self._scan_recursively(items)
        return {s for s, c in self._counter.items() if c >= self._threshold}

    def _scan_recursively(self, items: Iterable):
        for item in items:
            if item is None:
                continue
            if isinstance(item, str):
                txt = item.strip()
                if txt:
                    self._counter[txt] += 1
            elif isinstance(item, Iterable) and not isinstance(item, str):
                self._scan_recursively(item)
