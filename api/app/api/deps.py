from typing import Annotated

import jwt
from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session

from app.core.security import decode_access_token
from app.db.session import get_session
from app.models.user import User

SessionDep = Annotated[Session, Depends(get_session)]


def get_current_user(
    session: SessionDep,
    access_token: Annotated[str | None, Cookie()] = None,
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Cookie xác thực không hợp lệ hoặc bị thiếu",
    )
    if access_token is None:
        raise credentials_error

    try:
        user_id = decode_access_token(access_token)
    except (ValueError, jwt.PyJWTError):
        raise credentials_error from None

    user = session.get(User, user_id)
    if user is None:
        raise credentials_error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
