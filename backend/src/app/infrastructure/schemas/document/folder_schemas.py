from src.base.schema import (
    AbstractPydanticSchema,
    ChronoSchemaMixin,
    AuditableSchemaMixin,
)


class FolderListSchema(ChronoSchemaMixin, AuditableSchemaMixin):
    title: str


class FolderCreateSchema(AbstractPydanticSchema):
    title: str


class FolderUpdateSchema(AbstractPydanticSchema):
    title: str
