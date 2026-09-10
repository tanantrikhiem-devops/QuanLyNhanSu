from typing import Any, TypeVar, overload

from pydantic import BaseModel

from app.schemas.common import ApiResponse, ErrorResponse, PaginationMeta

T = TypeVar("T", bound=BaseModel)


@overload
def success_response(
    data: None,
    schema: None = None,
    meta: PaginationMeta | None = None,
    message: str | None = None,
) -> ApiResponse[None]: ...


@overload
def success_response[T: BaseModel](
    data: list[Any],
    schema: type[T],
    meta: PaginationMeta | None = None,
    message: str | None = None,
) -> ApiResponse[list[T]]: ...


@overload
def success_response[T: BaseModel](
    data: BaseModel,
    schema: type[T],
    meta: PaginationMeta | None = None,
    message: str | None = None,
) -> ApiResponse[T]: ...


def success_response[T: BaseModel](
    data: Any,
    schema: type[T] | None = None,
    meta: PaginationMeta | None = None,
    message: str | None = None,
) -> ApiResponse[Any]:
    if data is None:
        parsed_data = None
    elif isinstance(data, list):
        if schema is None:
            raise ValueError("schema is required for list data")
        parsed_data = [schema.model_validate(item) for item in data]
    else:
        if schema is None:
            raise ValueError("schema is required for model data")
        parsed_data = schema.model_validate(data)
    return ApiResponse(data=parsed_data, meta=meta, message=message)


def error_response(
    status_code: int,
    message: str,
    errors: dict[str, list[str]] | None = None,
) -> ErrorResponse:
    return ErrorResponse(status_code=status_code, message=message, errors=errors)
