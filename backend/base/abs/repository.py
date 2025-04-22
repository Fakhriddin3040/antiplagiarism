from abc import ABC
from typing import Type, Optional, Any, Sequence, TypeVar, Dict

from sqlalchemy import select, exists
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.interfaces import ORMOption

from base.types.orm.models import TModel
from base.types.pytypes import ID_T


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

    async def get_by_id(self, _id: "ID_T") -> Optional["TModel"]:
        return await self._get_by_field("id", _id)

    async def get_detail(
        self, field: str, value: Any, options: Optional[Sequence[ORMOption]] = None
    ) -> Optional["TModel"]:
        raise NotImplementedError()

    async def all(self, skip: int = 0, limit: int = 100) -> Sequence["TModel"]:
        result = await self.db.execute(select(self.model).offset(skip).limit(limit))
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

    async def filter(
        self,
        limit: Optional[int] = 0,
        offset: int = 100,
        search: Optional[Dict[str, Any]] = None,
        **filters,
    ) -> Sequence[TModel]:
        if not filters and not search:
            return await self.all(skip=offset, limit=limit)

        filter_args = [
            getattr(self.model, key) == value for key, value in filters.items() if value
        ]

        search_filters = (
            [
                getattr(self.model, key).ilike(f"%{value}%")
                for key, value in search.items()
                if value
            ]
            if search
            else []
        )

        where_filters = [*filter_args, *search_filters]

        _select = select(self.model).limit(limit).offset(offset)

        if where_filters:
            _select = _select.where(*where_filters)

        result = await self.db.execute(_select)

        return result.scalars().all()

    async def create(self, obj_in: dict) -> TModel:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.flush()
        await self.refresh(db_obj)
        return db_obj

    async def refresh(self, db_obj: TModel) -> None:
        await self.db.refresh(db_obj)

    async def bulk_create(self, objs_in: Sequence[Dict[str, Any]]) -> Sequence[TModel]:
        db_objs = [self.model(**obj_in) for obj_in in objs_in]
        self.db.add_all(db_objs)
        await self.db.flush()
        return db_objs

    async def update(self, *, db_obj: TModel, obj_in: dict) -> TModel:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        await self.db.flush()
        await self.refresh(db_obj)
        return db_obj

    async def remove(self, _id: ID_T) -> None:
        obj = await self.get_by_id(_id)
        if obj:
            await self.db.delete(obj)
            await self.db.flush()

    async def exists(self, *args) -> bool:
        result = await self.db.execute(select(exists().where(*args)))
        return result.scalar()

    async def get_for_update(self, _id: ID_T) -> Optional[TModel]:
        result = await self.db.execute(
            select(self.model).where(self.model.id == _id).with_for_update()
        )
        return result.scalar_one_or_none()

    def _field_does_not_exist(self, field: str) -> None:
        raise ValueError(f"Model {self.model} does not have a field named {field}")


TAsyncRepository = TypeVar("TAsyncRepository", bound=AbstractAsyncSQLAlchemyRepository)
