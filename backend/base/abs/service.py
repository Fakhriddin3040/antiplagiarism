from typing import Generic, Optional, Any, Sequence, Dict, Union, Type, List

from sqlalchemy.orm.interfaces import ORMOption

from base.abs.repository import TAsyncRepository
from base.types.orm.models import TModel
from base.types.pytypes import ID_T, T_SCHEMA
from src.utils.helpers.exceptions import not_found, object_not_found, already_exists


class AbstractAsyncService(Generic[TModel, TAsyncRepository]):
    def __init__(self, repository: TAsyncRepository):
        self._repository = repository

    async def get(self, _id: "ID_T") -> Optional["TModel"]:
        """
        Retrieve a single record by ID using the repository.
        """
        result = await self._repository.get(_id)
        self.check_for_none(result, field="id", value=_id)
        return result

    async def get_detail(
        self, field: str, value: Any, options: Optional[Sequence[ORMOption]] = None
    ) -> Optional["TModel"]:
        """
        Retrieve a single record by ID with additional relationships using the repository.
        """
        result = await self._repository.get_detail(
            field=field, value=value, options=options
        )
        if not result:
            not_found(model=self._repository.model.__name__, field=field, value=value)
        return result

    async def all(self, **kwargs) -> Sequence["TModel"]:
        """
        Retrieve all records with optional pagination using the repository.
        """
        results = await self._repository.all(**kwargs)
        return results

    async def filter_by(self, **kwargs) -> Sequence["TModel"]:
        """
        Filter records based on keyword arguments using the repository.
        """
        return await self._repository.filter_by(**kwargs)

    async def filter(
        self,
        limit: int = 0,
        offset: int = 100,
        search: Optional[Dict[str, Any]] = None,
        **filters,
    ) -> Sequence["TModel"]:
        """Yuppy"""
        return await self._repository.filter(
            limit=limit, offset=offset, search=search, **filters
        )

    async def create(self, obj_in: "T_SCHEMA") -> "TModel":
        """
        Create a new record using a Pydantic schema and the repository.
        """
        obj_in_data = obj_in.model_dump()
        return await self._repository.create(obj_in=obj_in_data)

    async def bulk_create(self, objs_in: Sequence["T_SCHEMA"]) -> Sequence["TModel"]:
        """
        Create multiple records using a Pydantic schema and the repository.
        """
        objs_in_data = [obj_in.model_dump() for obj_in in objs_in]
        return await self._repository.bulk_create(objs_in=objs_in_data)

    async def update(self, _id: ID_T, obj_in: Union["T_SCHEMA"]) -> "TModel":
        """
        Update an existing record using a Pydantic schema or dictionary and the repository.
        """
        db_obj = await self._repository.get(_id)

        if db_obj is None:
            self.check_for_none(db_obj, field="id", value=_id)

        update_data = obj_in.model_dump(exclude_unset=True)

        return await self._repository.update(db_obj=db_obj, obj_in=update_data)

    async def remove(self, _id: ID_T) -> None:
        """
        Remove a record from the database using the repository.
        """
        if not await self._repository.exists(self._repository.model.id == _id):
            self.check_for_none(None, field="id", value=_id)
        await self._repository.remove(_id)

    async def map_to_schema(
        self, obj: "TModel", schema: Type["T_SCHEMA"], **kwargs
    ) -> "T_SCHEMA":
        return schema.model_validate(obj, **kwargs)

    def map_to_schema_many(
        self, objs: Sequence["TModel"], schema: Type["T_SCHEMA"]
    ) -> List["T_SCHEMA"]:
        return [schema.model_validate(obj) for obj in objs]

    async def exists(self, *args) -> bool:
        return await self._repository.exists(*args)

    async def ensure_exists(self, *args) -> None:
        if not await self.exists(*args):
            object_not_found(model=self._repository.model.__name__)

    def check_for_none(self, obj: Optional["TModel"], field: str, value: Any) -> None:
        if not obj:
            field = field or "id"
            value = value or obj.id
            not_found(model=self._repository.model.__name__, field=field, value=value)

    def check_for_deps_services(self, *services) -> None:
        """
        :param services: Sequence["AbstractAsyncService"]
        """
        not_exists = []
        for service in services:
            if not service:
                not_exists.append(service.__class__.__name__)

        if not_exists:
            raise AttributeError(
                f"The following services are required for service"
                f"{self.__class__.__name__}: {not_exists}"
            )

    def already_exists(self, field: str):
        already_exists(model=self._repository.model.__name__, field=field)
