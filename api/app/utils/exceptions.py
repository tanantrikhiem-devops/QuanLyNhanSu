from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.utils.response import error_response


def http_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, HTTPException):
        raise exc
    response = error_response(exc.status_code, str(exc.detail))
    return JSONResponse(
        status_code=exc.status_code,
        content=response.model_dump(),
        headers=exc.headers,
    )


def validation_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, RequestValidationError):
        raise exc
    errors: dict[str, list[str]] = {}
    for error in exc.errors():
        field = ".".join(str(part) for part in error["loc"] if part != "body")
        errors.setdefault(field, []).append(error["msg"])
    response = error_response(422, "Dữ liệu không hợp lệ", errors)
    return JSONResponse(
        status_code=422,
        content=response.model_dump(),
    )
