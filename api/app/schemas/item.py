from sqlmodel import SQLModel


class ItemCreate(SQLModel):
    title: str
    description: str | None = None


class ItemUpdate(SQLModel):
    title: str | None = None
    description: str | None = None


class ItemRead(SQLModel):
    id: int
    title: str
    description: str | None = None
    owner_id: int
