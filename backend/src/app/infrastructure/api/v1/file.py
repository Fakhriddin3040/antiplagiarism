from fastapi import APIRouter, Depends, Form, UploadFile, File
from starlette import status

from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.deps.services.file import get_file_create_service
from src.app.infrastructure.schemas.document.file_schemas import FileCreateSchema
from src.app.infrastructure.services.file.file_create_service import FileCreateService

router = APIRouter()


@router.post("/", responses=None, status_code=status.HTTP_201_CREATED)
async def create_file(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    service: FileCreateService = Depends(get_file_create_service),
) -> None:
    params = FileCreateSchema(
        title=title,
        description=description,
        file=file,
    )
    await service.create(user=user, params=params)
