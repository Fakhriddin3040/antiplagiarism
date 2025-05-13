from typing import Union

import bcrypt


class PasswordService:
    def hash_password(self, password: str) -> bytes:
        pwd_bytes = self.to_bytes(password)
        salt = self.generate_salt()
        return bcrypt.hashpw(password=pwd_bytes, salt=salt)

    def generate_salt(self) -> bytes:
        return bcrypt.gensalt()

    def verify_password(
        self, password: Union[str, bytes], hashed_password: Union[str, bytes]
    ) -> bool:
        hashed_password = self.get_bytes(hashed_password)
        password = self.get_bytes(password)

        return self._verify_password(hashed_password=hashed_password, password=password)

    def _verify_password(self, hashed_password: bytes, password: bytes) -> bool:
        try:
            return bcrypt.checkpw(password=password, hashed_password=hashed_password)
        except ValueError:
            return False

    def get_bytes(self, password: Union[str, bytes]) -> bytes:
        return password if isinstance(password, bytes) else self.to_bytes(password)

    def to_bytes(self, value: str) -> bytes:
        return value.encode("utf-8")
