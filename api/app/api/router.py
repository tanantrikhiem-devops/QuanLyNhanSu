from functools import wraps
from inspect import isawaitable, signature
from typing import Any, get_type_hints

from fastapi import APIRouter, Response
from fastapi.datastructures import DefaultPlaceholder

from app.schemas.common import ApiResponse


class ApiRouter(APIRouter):
    def add_api_route(self, path: str, endpoint: Any, **kwargs: Any) -> None:
        response_model = kwargs.get("response_model")
        if response_model is None or isinstance(response_model, DefaultPlaceholder):
            endpoint_signature = signature(endpoint)
            return_type = get_type_hints(endpoint).get(
                "return", endpoint_signature.return_annotation
            )
            if (
                return_type is not endpoint_signature.empty
                and return_type is not Response
            ):
                kwargs["response_model"] = ApiResponse[return_type]
                original_endpoint = endpoint

                @wraps(original_endpoint)
                async def wrapped_endpoint(*args: Any, **endpoint_kwargs: Any) -> Any:
                    result = original_endpoint(*args, **endpoint_kwargs)
                    if isawaitable(result):
                        result = await result
                    return (
                        result
                        if isinstance(result, ApiResponse | Response)
                        else ApiResponse(data=result)
                    )

                endpoint = wrapped_endpoint

        super().add_api_route(path, endpoint, **kwargs)
