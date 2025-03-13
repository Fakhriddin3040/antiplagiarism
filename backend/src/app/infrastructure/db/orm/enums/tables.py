from enum import StrEnum


class DatabaseTables(StrEnum):
    # User
    USERS = "users"

    # Document
    DOCUMENTS = "documents"
    TEXTS = "texts"

    # Plagiarism result
    PLAGIARISM_RESULTS = "plagiarism_results"

    @property
    def as_foreign_key(self):
        return f"{self.value}.id"

    def specific_field(self, column: str):
        return f"{self.value}.{column}"
