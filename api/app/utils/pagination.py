from math import ceil

from app.schemas.common import PaginationMeta


def pagination_meta(total: int, page: int, limit: int) -> PaginationMeta:
    return PaginationMeta(
        total=total,
        page=page,
        limit=limit,
        total_pages=ceil(total / limit) if total else 0,
    )
