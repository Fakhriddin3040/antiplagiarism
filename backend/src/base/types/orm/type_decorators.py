from typing import Optional, Generic, Type

from sqlalchemy import TypeDecorator, Dialect
from src.base.types.pytypes import ENUM_T


class SQLAlchemyEnumTypeDecorator(TypeDecorator, Generic[ENUM_T]):
    impl: Dialect
    choices: Type[ENUM_T]

    def process_bind_param(
        self, value: Optional[ENUM_T], dialect: Dialect
    ) -> Optional[ENUM_T]:
        if value is None:
            return

        if isinstance(value, self.choices):
            return value.value  # noqa

        if value in self.choices:
            return value

        raise ValueError(f"Invalid type. Expected {self.choices}, got {type(value)}")

    def process_result_value(
        self, value: Optional[ENUM_T], dialect: Dialect
    ) -> Optional[ENUM_T]:
        if value is None:
            return

        return self.choices(value)
