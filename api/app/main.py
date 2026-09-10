from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError

from app.api.v1.router import api_router
from app.db.session import create_db_and_tables
from app.schemas.common import ApiResponse
from app.utils.exceptions import http_exception_handler, validation_exception_handler


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root() -> ApiResponse[dict[str, str]]:
    return ApiResponse(data={"message": "Hello Bigger Applications!"})
