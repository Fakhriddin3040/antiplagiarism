from enum import IntEnum, auto, StrEnum


class ApiExceptionStatusCodes(IntEnum):
    # AUTH
    INVALID_LOGIN_CREDENTIALS = auto()  # 1
    INVALID_ACCESS_TOKEN = auto()  # 2
    ACCESS_TOKEN_REQUIRED = auto()
    INVALID_PASSWORD = auto()  # 3

    # VALIDATION
    UNIQUE_CONSTRAINT = auto()  # 4

    # SPECIAL_USE_CASES
    DETAILED_ERROR = auto()  # 5


class ApiExceptionMessage(StrEnum):
    ACCESS_TOKEN_REQUIRED = "Access token is not provided."
    INVALID_LOGIN_CREDENTIALS = "Invalid login credentials."
    INVALID_TOKEN_PROVIDED = "Invalid access key"
