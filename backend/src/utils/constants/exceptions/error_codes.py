from enum import IntEnum, auto, StrEnum


class ApiExceptionStatusCodes(IntEnum):
    # AUTH
    INVALID_LOGIN_CREDENTIALS = auto()  # 1
    INVALID_ACCESS_TOKEN = auto()  # 2
    ACCESS_TOKEN_REQUIRED = auto() # 3
    INVALID_PASSWORD = auto()  # 4

    # VALIDATION
    UNIQUE_CONSTRAINT = auto()  # 5

    # SPECIAL_USE_CASES
    DETAILED_ERROR = auto()  # 6

    # FILES SPECIFIED
    FILE_SIZE_LIMIT_EXCEEDED = auto() # 7
    FILE_NOT_FOUND_IN_FS = auto() # 7
    UNSUPPORTED_FILE_FORMAT = auto() # 8
    INVALID_FILE_FORMAT = auto() # 9

    # ===== COMMON =====
    OBJECT_NOT_FOUND = auto()
    REQUEST_BODY_IS_EMPTY = auto()

    # ===== UNKNOWN =====
    UNKNOWN_ERROR = auto()

    # ===== DOCUMENT SPECIFIED =====
    TOO_SHORT_CONTENT = auto()


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
    UNIQUE_CONSTRAINT = "Unique constraint violated. One or more constraints violated."

    # ===== UNKNOWN =====
    UNKNOWN_ERROR = "Unknown error."

    # ===== COMMON =====
    DETAILED_ERROR = "Detailed error. See details."

    # ===== DOCUMENT SPECIFIED =====
    TOO_SHORT_CONTENT = "File content is too short."
