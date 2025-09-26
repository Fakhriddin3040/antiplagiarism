from abc import ABC
from typing import Type, Optional, Any, Sequence, TypeVar, Dict, Mapping, Tuple, List

from sqlalchemy import select, exists, Select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.interfaces import ORMOption
from sqlalchemy.sql.functions import count

from src.base.types.orm.models import TModel
from src.base.types.pytypes import ID_T
from src.utils.helpers.exceptions import not_found, object_not_found, already_exists


class AbstractAsyncSQLAlchemyRepository(ABC):
    def __init__(self, model: Type[TModel], db: AsyncSession):
        self.model = model
        self.db = db

    async def _get_by_field(
        self, field: str, value: Any, options: Optional[Sequence[ORMOption]] = None
    ) -> Optional[TModel]:
        if not hasattr(self.model, field):
            raise ValueError(f"{self.model} does not have a field named {field}")

        _select = select(self.model).where(getattr(self.model, field) == value)  # noqa

        if options:
            _select = _select.options(*options)

        result = await self.db.execute(_select)

        return result.scalar_one_or_none()

    async def get_by_id(self, id_: "ID_T") -> Optional["TModel"]:
        return await self._get_by_field("id", id_)

    async def get_detail(
        self, field: str, value: Any, options: Optional[Sequence[ORMOption]] = None
    ) -> Optional["TModel"]:
        raise NotImplementedError()

    async def all(self, offset: int = 0, limit: int = 100) -> Sequence["TModel"]:
        result = await self.db.execute(select(self.model).offset(offset).limit(limit))
        return result.scalars().all()

    async def filter_by(
        self,
        offset: int = 0,
        limit: int = 100,
        options: Optional[Sequence[ORMOption]] = None,
        **kwargs,
    ) -> Optional[Sequence[TModel]]:
        filters = []

        for key, value in kwargs.items():
            if value is None:
                continue

            col = getattr(self.model, key, None)

            if col is None:
                self._field_does_not_exist(key)

            filters.append(col == value)

        if not filters:
            raise ValueError("At least one filter must be provided")

        _select = select(self.model).where(*filters)

        if options:
            _select = _select.options(*options).limit(limit).offset(offset)

        result = await self.db.execute(_select)

        return result.scalars().all()

    def parse_to_statement(
        self, search: Optional[Dict[str, Any]] = None, **filters
    ) -> Optional[Select]:
        filter_args = [
            getattr(self.model, key) == value for key, value in filters.items() if value
        ]

        search_filters = self._parse_search(search) if search else list()

        conditions = [*filter_args, *search_filters]

        if not conditions:
            return None

        _select = select(self.model).where(*conditions)
        return _select

    def _parse_search(self, search: Dict[str, Any]) -> List[Select]:
        return [
            getattr(self.model, key).ilike(f"%{value}%")
            for key, value in search.items()
            if value
        ]

    async def filter(
        self,
        limit: Optional[int] = 10,
        offset: int = 0,
        search: Optional[Dict[str, Any]] = None,
        need_count: Optional[bool] = False,
        **filters,
    ) -> Sequence[TModel] | Tuple[Sequence[TModel], int]:
        if not filters and not search:
            _select = select(self.model).offset(offset).limit(limit)
        else:
            _select = self.parse_to_statement(search=search, **filters)
            _select = _select.limit(limit).offset(offset)

        result = (await self.db.execute(_select)).scalars().all()

        if not need_count:
            return result

        res_len = len(result)

        if res_len == limit:
            return result, await self._get_count(smt=_select)
        elif res_len > 0:
            return result, offset + res_len

        return result, 0

    async def _get_count(self, smt: Select) -> Optional[int]:
        return (
            await self.db.execute(select(count()).select_from(smt.subquery()))
        ).scalar_one_or_none()

    async def filter_exists(
        self, search: Optional[Dict[str, Any]] = None, **filters
    ) -> bool:
        _select = self.parse_to_statement(search=search, **filters)

        if _select is None:
            return False

        result = await self.db.execute(select(exists(_select)))
        return result.scalar_one_or_none() is True

    async def create(self, obj_in: Mapping[str, Any]) -> TModel:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.flush()
        await self.refresh(db_obj)
        return db_obj

    async def refresh(self, db_obj: TModel) -> None:
        await self.db.refresh(db_obj)

    async def batch_create_from_dict(
        self, objs_in: Tuple[Dict[str, Any], ...], batch_size: int = 200, **kwargs
    ) -> None:
        offset = 0
        total = len(objs_in)

        while total > offset:
            current_batch_size = min(batch_size, total - offset)
            objs = [
                self.model(**objs_in[i], **kwargs)
                for i in range(offset, offset + current_batch_size)
            ]
            self.db.add_all(objs)
            offset += current_batch_size

        await self.db.flush()

    async def batch_create(
        self, objs_in: Sequence[TModel], batch_size: int = 200
    ) -> None:
        offset = 0
        total = len(objs_in)

        while total > offset:
            current_batch_size = min(batch_size, total - offset)
            self.db.add_all(objs_in[offset : offset + current_batch_size])
            offset += current_batch_size

        await self.db.flush()

    async def update(self, *, db_obj: TModel, obj_in: dict) -> TModel:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        await self.db.flush()
        await self.refresh(db_obj)
        return db_obj

    async def save(self, db_obj: TModel) -> None:
        self.db.add(db_obj)
        await self.db.flush()

    async def batch_save(
        self, db_objs: Sequence[TModel], batch_size: int = 200
    ) -> None:
        offset = 0
        total = len(db_objs)
        while total > offset:
            current_batch_size = min(batch_size, total - offset)
            self.db.add_all(db_objs[offset : offset + current_batch_size])
            offset += current_batch_size

        await self.db.flush()

    async def remove(self, _id: ID_T) -> "int":
        stmt = delete(self.model).where(self.model.id == _id)
        result = await self.db.execute(stmt)
        return result.rowcount  # noqa

    async def exists(self, *args) -> bool:
        result = await self.db.execute(select(exists().where(*args)))
        return result.scalar()

    async def get_for_update(self, _id: ID_T) -> Optional[TModel]:
        result = await self.db.execute(
            select(self.model).where(self.model.id == _id).with_for_update()
        )
        return result.scalar_one_or_none()

    async def ensure_exists(self, *args) -> None:
        if not await self.exists(*args):
            object_not_found(model=self.model.__name__)

    def _field_does_not_exist(self, field: str) -> None:
        raise ValueError(f"Model {self.model} does not have a field named {field}")

    def check_for_none(self, obj: Optional["TModel"], field: str, value: Any) -> None:
        if not obj:
            field = field or "id"
            value = value or obj.id
            not_found(model=self.model.__name__, field=field, value=value)

    def already_exists(self, field: str):
        already_exists(model=self.model.__name__, field=field)


TAsyncRepository = TypeVar("TAsyncRepository", bound=AbstractAsyncSQLAlchemyRepository)
