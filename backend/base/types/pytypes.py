from enum import Enum
from typing import TypeAlias, TypeVar
from uuid import UUID

from pydantic import BaseModel

ID_T: TypeAlias = UUID

ENUM_T = TypeVar("ENUM_T", bound=Enum)

T = TypeVar("T")

T_SCHEMA = TypeVar("T_SCHEMA", bound=BaseModel)
