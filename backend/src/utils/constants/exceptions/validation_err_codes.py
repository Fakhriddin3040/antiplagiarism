from enum import IntEnum, auto


class FieldValidationErrorCodes(IntEnum):
    ALREADY_EXISTS = auto()  # Field already exists at database
