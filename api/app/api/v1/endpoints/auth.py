import jwt
from fastapi import Cookie, HTTPException, Response, status
from sqlmodel import select

from app.api.deps import SessionDep
from app.api.router import ApiRouter
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.user import UserCreate, UserLogin, UserRead
from app.utils.response import success_response

router = ApiRouter(prefix="/auth", tags=["auth"])
COOKIE_NAME = "access_token"
REFRESH_COOKIE_NAME = "refresh_token"


@router.post(
    "/register",
    response_model=ApiResponse[UserRead],
    status_code=status.HTTP_201_CREATED,
)
def register(user_in: UserCreate, session: SessionDep) -> ApiResponse[UserRead]:
    email = str(user_in.email).lower()
    if session.exec(select(User).where(User.email == email)).first() is not None:
        raise HTTPException(status_code=409, detail="Email đã được đăng ký")

    user = User(email=email, password_hash=hash_password(user_in.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return success_response(data=user, schema=UserRead, message="Đăng ký thành công")


@router.post("/login", response_model=ApiResponse[UserRead])
def login(
    user_in: UserLogin, response: Response, session: SessionDep
) -> ApiResponse[UserRead]:
    email = str(user_in.email).lower()
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không hợp lệ")

    if user.id is None:
        raise HTTPException(status_code=500, detail="Người dùng chưa có mã định danh")

    response.set_cookie(
        key=COOKIE_NAME,
        value=create_access_token(user.id),
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.auth_token_expire_minutes * 60,
    )
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=create_refresh_token(user.id),
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.auth_refresh_token_expire_days * 24 * 60 * 60,
    )
    return success_response(data=user, schema=UserRead, message="Đăng nhập thành công")


@router.post("/refresh", response_model=ApiResponse[UserRead])
def refresh(
    response: Response,
    session: SessionDep,
    refresh_token: str | None = Cookie(default=None),
) -> ApiResponse[UserRead]:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Refresh token không hợp lệ hoặc bị thiếu",
    )
    if refresh_token is None:
        raise credentials_error

    try:
        user_id = decode_refresh_token(refresh_token)
    except (ValueError, TypeError, jwt.PyJWTError):
        raise credentials_error from None

    user = session.get(User, user_id)
    if user is None or user.id is None:
        raise credentials_error

    response.set_cookie(
        key=COOKIE_NAME,
        value=create_access_token(user.id),
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.auth_token_expire_minutes * 60,
    )
    return success_response(
        data=user, schema=UserRead, message="Làm mới phiên đăng nhập thành công"
    )


@router.post("/logout")
def logout(response: Response) -> None:
    response.delete_cookie(key=COOKIE_NAME)
    response.delete_cookie(key=REFRESH_COOKIE_NAME)
