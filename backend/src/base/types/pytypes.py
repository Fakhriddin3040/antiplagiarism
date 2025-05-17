from enum import Enum
from typing import TypeAlias, TypeVar, Union
from uuid import UUID

from pydantic import BaseModel

ID_T: TypeAlias = UUID

ENUM_T = TypeVar("ENUM_T", bound=Enum)

T = TypeVar("T")
TParams = TypeVar("TParams")

T_SCHEMA = TypeVar("T_SCHEMA", bound=BaseModel)

PasswordType: TypeAlias = Union[bytes, str]
