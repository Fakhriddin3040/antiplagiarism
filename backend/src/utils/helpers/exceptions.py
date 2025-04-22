from typing import Any, Optional, Dict

from fastapi import HTTPException
from starlette import status


def not_found(model: str, field: str, value: Any) -> None:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{model.capitalize()} with '{field}' '{value}' not found",
    )


def object_not_found(model: str):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{model.capitalize()} not found",
    )


def already_exists(model: str, field: str):
    msg = f"{model} with given '{field}' already exists"
    raise_validation_error(
        detail=msg,
    )


def raise_validation_error(
    detail: str,
    status_code: Optional[int] = status.HTTP_400_BAD_REQUEST,
    headers: Optional[Dict] = None,
) -> object:
    raise HTTPException(detail=detail, status_code=status_code, headers=headers)
