from app.api.deps import CurrentUser
from app.api.router import ApiRouter
from app.schemas.common import ApiResponse
from app.schemas.user import UserRead
from app.utils.response import success_response

router = ApiRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=ApiResponse[UserRead])
def read_current_user(current_user: CurrentUser) -> ApiResponse[UserRead]:
    return success_response(data=current_user, schema=UserRead)
