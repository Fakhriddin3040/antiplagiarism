from enum import Enum
from typing import TypeAlias, TypeVar
from uuid import UUID

ID_T: TypeAlias = UUID

ENUM_T = TypeVar("ENUM_T", bound=Enum)

T = TypeVar("T")
