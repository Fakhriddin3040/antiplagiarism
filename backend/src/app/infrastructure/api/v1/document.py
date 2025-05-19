from fastapi import APIRouter
from starlette import status

from src.app.infrastructure.schemas.document.document_schemas import DocumentCreateSchema

router = APIRouter()


@router.post(
    "/", response_model=DocumentCreateSchema, status_code=status.HTTP_201_CREATED
)
async def create(

) -> None: pass
