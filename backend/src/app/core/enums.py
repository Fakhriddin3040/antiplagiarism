from enum import IntEnum


class PlagiarismResultStatusEnum(IntEnum):
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETE = 3
    FAILED = 4
