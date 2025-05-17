from typing import Optional, List, Any, Mapping, Union

from pydantic import BaseModel, Field
from starlette import status

from src.base.enums import ModelFieldsEnum
from src.utils.constants.exceptions.error_codes import ApiExceptionStatusCodes


class ApiExceptionDetail(BaseModel):
    status: ApiExceptionStatusCodes
    field: Optional[ModelFieldsEnum] = None
    payload: Optional[Mapping[str, Any]] = Field(default_factory=dict)


class ApiException(Exception):
    ERRORS_ITEM_LEN = 2

    def __init__(
        self,
        message: str,
        details: Optional[Union[List[ApiExceptionDetail], ApiExceptionDetail]] = None,
        exception_status: Optional[int] = None,
        status_code: Optional[int] = status.HTTP_400_BAD_REQUEST,
    ):
        """
        :param errors: Array of tuples describing the errors encountered
            indexes explains:
                1: Status codes from ApiExceptionStatusCodes
                2: Key value pair format
        :param exception_status: Optional exception status code from ApiExceptionStatusCodes
        :param status_code: Http default status code
        """
        self.details = None
        has_error_details = details is not None

        if not has_error_details and not exception_status:
            raise ValueError(
                "At least one of `details` or `exception_status` must be provided"
            )

        self.message = message
        self.status_code = status_code

        if not has_error_details:
            self.exception_status = exception_status
            return

        if isinstance(details, ApiExceptionDetail):
            details = [details]

        if not isinstance(details, list) and not isinstance(
            details[0], ApiExceptionDetail
        ):
            raise TypeError(
                "Unexpected type: {} for handling API Exception".format(type(details))
            )

        self.exception_status = ApiExceptionStatusCodes.DETAILED_ERROR

        self.details = [item.model_dump(exclude_none=True) for item in details]

    def __str__(self):
        return f"ApiException: \nHttp status code: {self.status_code} \nException_status: {self.exception_status} \nDetails: {self.details}"

    def as_dict(self):
        result = {
            "message": self.message,
        }
        if self.exception_status:
            result.update({"exception_status": self.exception_status})

        if self.details:
            result.update({"details": self.details})

        return result
