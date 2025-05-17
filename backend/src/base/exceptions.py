from starlette import status


class BaseHttpException(Exception):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
