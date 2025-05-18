from abc import ABC, abstractmethod
from pathlib import Path
from typing import TextIO


class AbstractParser(ABC):
    def __init__(self, path: Path | str):
        self.path = Path(path)

    @abstractmethod
    def parse(self) -> str:
        pass

    def get_file_content(self, mode=None, encoding=None, **kwargs) -> str:
        f = self.open(mode, encoding=encoding, **kwargs)
        content = f.read()
        f.close()
        return content

    def open(self, mode: str = "r", encoding: str = "utf-8", **kwargs):
        f = open(self.path, mode, encoding=encoding, **kwargs)
        return f

    def close(self, file: TextIO):
        file.close()
