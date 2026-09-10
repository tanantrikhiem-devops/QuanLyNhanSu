from pydantic import EmailStr, Field
from sqlmodel import SQLModel


class UserCreate(SQLModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserLogin(UserCreate):
    pass


class UserRead(SQLModel):
    id: int
    email: EmailStr
