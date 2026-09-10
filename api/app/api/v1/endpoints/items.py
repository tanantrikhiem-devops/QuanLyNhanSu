from fastapi import HTTPException, Query, status
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.api.router import ApiRouter
from app.models.item import Item
from app.schemas.common import ApiResponse
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.utils.pagination import pagination_meta
from app.utils.response import success_response

router = ApiRouter(prefix="/items", tags=["items"])


@router.post(
    "", response_model=ApiResponse[ItemRead], status_code=status.HTTP_201_CREATED
)
def create_item(
    item_in: ItemCreate, session: SessionDep, current_user: CurrentUser
) -> ApiResponse[ItemRead]:
    if current_user.id is None:
        raise HTTPException(status_code=500, detail="Người dùng chưa có mã định danh")
    item = Item(
        title=item_in.title,
        description=item_in.description,
        owner_id=current_user.id,
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    return success_response(data=item, schema=ItemRead, message="Tạo mục thành công")


@router.get("", response_model=ApiResponse[list[ItemRead]])
def list_items(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
) -> ApiResponse[list[ItemRead]]:
    query = select(Item).where(Item.owner_id == current_user.id)
    db_items = list(session.exec(query.offset((page - 1) * limit).limit(limit)).all())
    total = session.exec(
        select(func.count()).select_from(Item).where(Item.owner_id == current_user.id)
    ).one()
    return success_response(
        data=db_items, schema=ItemRead, meta=pagination_meta(total, page, limit)
    )


def get_owned_item(
    item_id: int, session: SessionDep, current_user: CurrentUser
) -> Item:
    item = session.exec(
        select(Item).where(Item.id == item_id, Item.owner_id == current_user.id)
    ).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục")
    return item


@router.get("/{item_id}", response_model=ApiResponse[ItemRead])
def read_item(
    item_id: int, session: SessionDep, current_user: CurrentUser
) -> ApiResponse[ItemRead]:
    return success_response(
        data=get_owned_item(item_id, session, current_user),
        schema=ItemRead,
    )


@router.patch("/{item_id}", response_model=ApiResponse[ItemRead])
def update_item(
    item_id: int,
    item_in: ItemUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> ApiResponse[ItemRead]:
    item = get_owned_item(item_id, session, current_user)
    for key, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    session.add(item)
    session.commit()
    session.refresh(item)
    return success_response(
        data=item, schema=ItemRead, message="Cập nhật mục thành công"
    )


@router.delete("/{item_id}", response_model=ApiResponse[None])
def delete_item(
    item_id: int, session: SessionDep, current_user: CurrentUser
) -> ApiResponse[None]:
    item = get_owned_item(item_id, session, current_user)
    session.delete(item)
    session.commit()
    return success_response(data=None, message="Xóa mục thành công")
