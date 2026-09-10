from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(subject: int) -> str:
    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.auth_token_expire_minutes
    )
    payload = {"sub": str(subject), "type": "access", "exp": expires_at}
    return jwt.encode(payload, settings.auth_secret_key, algorithm="HS256")


def create_refresh_token(subject: int) -> str:
    expires_at = datetime.now(UTC) + timedelta(
        days=settings.auth_refresh_token_expire_days
    )
    payload = {"sub": str(subject), "type": "refresh", "exp": expires_at}
    return jwt.encode(payload, settings.auth_secret_key, algorithm="HS256")


def decode_access_token(token: str) -> int:
    payload = jwt.decode(token, settings.auth_secret_key, algorithms=["HS256"])
    if payload.get("type") != "access":
        raise TypeError("Invalid token type")
    subject = payload.get("sub")
    if not isinstance(subject, str):
        raise TypeError("Invalid token subject")
    return int(subject)


def decode_refresh_token(token: str) -> int:
    payload = jwt.decode(token, settings.auth_secret_key, algorithms=["HS256"])
    if payload.get("type") != "refresh":
        raise TypeError("Invalid token type")
    subject = payload.get("sub")
    if not isinstance(subject, str):
        raise TypeError("Invalid token subject")
    return int(subject)
