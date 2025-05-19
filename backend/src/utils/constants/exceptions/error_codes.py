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

    # FILES SPECIFIED
    FILE_SIZE_LIMIT_EXCEEDED = auto()
    FILE_NOT_FOUND_IN_FS = auto()
    UNSUPPORTED_FILE_FORMAT = auto()
    INVALID_FILE_FORMAT = auto()

    # ===== COMMON =====
    OBJECT_NOT_FOUND = auto()
    REQUEST_BODY_IS_EMPTY = auto()


class ApiExceptionMessage(StrEnum):
    NOT_FOUND = "Not found"
    ACCESS_TOKEN_REQUIRED = "Access token is not provided."
    INVALID_LOGIN_CREDENTIALS = "Invalid login credentials."
    INVALID_TOKEN_PROVIDED = "Invalid access key"
    FILE_SIZE_LIMIT_EXCEEDED = "File size limit exceeded."
    UNSUPPORTED_FILE_FORMAT = "Unsupported file format."
    INVALID_FILE_FORMAT = "Invalid file format."
    FILE_NOT_FOUND_IN_FS = "File exists in database, but not found in file system."
    REQUEST_BODY_IS_EMPTY = "Request body is empty."
