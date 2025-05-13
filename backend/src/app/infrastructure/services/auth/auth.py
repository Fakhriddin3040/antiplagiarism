from src.base.types.pytypes import TParams, T
from src.app.infrastructure.services.auth.credentials import AuthCredentialService
from src.app.infrastructure.services.auth.password import PasswordService


class AuthService:
    def __init__(
        self,
        password_service: PasswordService,
        credential_provider: AuthCredentialService[T, TParams],
    ):
        self.password_service = password_service
        self.credential_provider = credential_provider

    def password_authenticate(self, password: bytes | str):
        pass
