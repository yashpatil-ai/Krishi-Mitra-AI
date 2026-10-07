from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.scheme import SchemeCreate, SchemeResponse
from app.services.scheme_service import (
    create_scheme,
    delete_scheme,
    get_scheme,
    get_schemes,
    update_scheme,
)

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("", response_model=list[SchemeResponse])
def list_schemes(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    level: str | None = Query(default=None),
    state: str | None = Query(default=None),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_schemes(
        db=db,
        search=search,
        category=category,
        level=level,
        state=state,
        active_only=active_only,
    )


@router.get("/{scheme_id}", response_model=SchemeResponse)
def read_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scheme = get_scheme(db, scheme_id)

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    return scheme


@router.post("", response_model=SchemeResponse)
def add_scheme(
    scheme_data: SchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_scheme(db, scheme_data)


@router.put("/{scheme_id}", response_model=SchemeResponse)
def edit_scheme(
    scheme_id: int,
    scheme_data: SchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scheme = get_scheme(db, scheme_id)

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    return update_scheme(db, scheme, scheme_data)


@router.delete("/{scheme_id}", response_model=SchemeResponse)
def deactivate_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scheme = get_scheme(db, scheme_id)

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    return delete_scheme(db, scheme)
