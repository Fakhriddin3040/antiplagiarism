from abc import abstractmethod
from enum import StrEnum


class ModelFieldsEnum(StrEnum):
    @property
    def as_foreign_key(self):
        return f"{self.value}_id"

    @staticmethod
    @abstractmethod
    def as_outref() -> str:
        pass
