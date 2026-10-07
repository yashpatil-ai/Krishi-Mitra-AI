from sqlalchemy.orm import Session
from app.models.market import MarketPrice


def get_market_prices(
    db: Session,
    commodity: str | None = None,
    state: str | None = None,
    district: str | None = None,
):
    query = db.query(MarketPrice)

    if commodity:
        query = query.filter(MarketPrice.commodity.ilike(commodity))

    if state:
        query = query.filter(MarketPrice.state.ilike(state))

    if district:
        query = query.filter(MarketPrice.district.ilike(district))

    return query.order_by(MarketPrice.price_date.desc()).all()


def get_market_price(db: Session, price_id: int):
    return db.query(MarketPrice).filter(MarketPrice.id == price_id).first()


def create_market_price(db: Session, data):
    price = MarketPrice(**data.model_dump())
    db.add(price)
    db.commit()
    db.refresh(price)
    return price


def delete_market_price(db: Session, price_id: int):
    price = get_market_price(db, price_id)

    if price:
        db.delete(price)
        db.commit()

    return price
