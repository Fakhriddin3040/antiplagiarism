from abc import ABC, abstractmethod
from typing import IO


class AbstractTextParser(ABC):
    @abstractmethod
    async def parse(self, io: IO[str]) -> str:
        pass


class AbstractBinaryTextParser(ABC):
    @abstractmethod
    async def parse(self, io: IO[bytes]) -> str:
        pass
