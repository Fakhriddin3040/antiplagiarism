from fastapi import Depends, Body
from fastapi.routing import APIRouter
from starlette import status

from src.app.application.schemas.auth.login_credentials_schema import (
    LoginCredentialsSchema,
)
from src.app.application.schemas.auth.registration_schemas import UserRegisterSchema
from src.app.infrastructure.auth.schemas.token_response_schemes import (
    TokenResponseSchema,
)
from src.app.infrastructure.auth.deps.auth import (
    get_user_register_service,
    get_user_login_service,
    get_current_user,
)
from src.app.infrastructure.schemas.user.user_detail_schemas import UserDetailSchema

router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=TokenResponseSchema,
)
async def register(
    params: UserRegisterSchema = Body(),
    user_register_service=Depends(get_user_register_service),
) -> TokenResponseSchema:
    response = await user_register_service.register(params)
    return TokenResponseSchema(access_token=response.access_token)


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=TokenResponseSchema,
)
async def login(
    params: LoginCredentialsSchema = Body(),
    login_service=Depends(get_user_login_service),
) -> TokenResponseSchema:
    response = await login_service.login(params)
    return TokenResponseSchema(access_token=response.access_token)


@router.get("check_auth", status_code=status.HTTP_200_OK, response_model=None)
async def fuck_you_niga(user=Depends(get_current_user)):
    return {"Fuck You Niga": user.email}


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=UserDetailSchema,
)
async def me(
    user=Depends(get_current_user),
):
    return user
