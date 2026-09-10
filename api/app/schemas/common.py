from typing import TypeVar

from pydantic import BaseModel, ConfigDict

DataT = TypeVar("DataT")


class PaginationMeta(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int


class ApiResponse[DataT](BaseModel):
    data: DataT
    meta: PaginationMeta | None = None
    message: str | None = None


class ErrorResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status_code: int
    message: str
    errors: dict[str, list[str]] | None = None
