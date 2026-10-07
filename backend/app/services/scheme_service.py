from datetime import datetime

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.scheme import Scheme
from app.models.user import User
from app.models.notification import Notification
from app.schemas.scheme import SchemeCreate


def get_schemes(
    db: Session,
    search: str | None = None,
    category: str | None = None,
    level: str | None = None,
    state: str | None = None,
    active_only: bool = True,
):
    query = db.query(Scheme)

    if active_only:
        query = query.filter(Scheme.is_active.is_(True))

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Scheme.name.ilike(term),
                Scheme.short_name.ilike(term),
                Scheme.description.ilike(term),
                Scheme.category.ilike(term),
                Scheme.target_beneficiaries.ilike(term),
                Scheme.eligible_crops.ilike(term),
            )
        )

    if category:
        query = query.filter(Scheme.category.ilike(category.strip()))

    if level:
        query = query.filter(Scheme.level.ilike(level.strip()))

    if state:
        query = query.filter(
            or_(
                Scheme.state.ilike(state.strip()),
                Scheme.state.is_(None),
            )
        )

    return query.order_by(Scheme.name.asc()).all()


def get_scheme(db: Session, scheme_id: int):
    return db.query(Scheme).filter(Scheme.id == scheme_id).first()


def create_scheme(db: Session, scheme_data: SchemeCreate):
    scheme = Scheme(**scheme_data.model_dump())
    scheme.last_verified_at = datetime.utcnow()

    db.add(scheme)
    db.commit()
    db.refresh(scheme)

    return scheme


def update_scheme(db: Session, scheme: Scheme, scheme_data: SchemeCreate):
    old_values = {
        field: getattr(scheme, field)
        for field in scheme_data.model_dump().keys()
    }

    new_values = scheme_data.model_dump()

    changed_fields = [
        field
        for field, value in new_values.items()
        if old_values.get(field) != value
    ]

    for field, value in new_values.items():
        setattr(scheme, field, value)

    scheme.last_verified_at = datetime.utcnow()

    db.commit()
    db.refresh(scheme)

    if changed_fields:
        users = db.query(User).all()

        field_names = ", ".join(
            field.replace("_", " ").title()
            for field in changed_fields
        )

        for user in users:
            db.add(
                Notification(
                    user_id=user.id,
                    scheme_id=scheme.id,
                    notification_type="scheme_update",
                    title=f"Scheme updated: {scheme.name}",
                    message=(
                        f"{scheme.name} has been updated. "
                        f"Changed: {field_names}."
                    ),
                )
            )

        db.commit()

    return scheme


def delete_scheme(db: Session, scheme: Scheme):
    scheme.is_active = False
    db.commit()
    db.refresh(scheme)

    return scheme
