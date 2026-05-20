from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth import get_current_user
from models.profile import PhysicalOrder, Brochure
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

class OrderCreate(BaseModel):
    brochure_id: int
    quantity: int
    paper_stock: str
    finish: str
    shipping_address: str

@router.post("/order")
async def create_order(order: OrderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """
    Creates a new physical fulfillment order for a specific brochure.
    """
    # Verify brochure ownership
    brochure = db.query(Brochure).filter(Brochure.id == order.brochure_id, Brochure.user_id == user.id).first()
    if not brochure:
        raise HTTPException(status_code=404, detail="Brochure asset not found or access denied")
        
    db_order = PhysicalOrder(
        brochure_id=order.brochure_id,
        user_id=user.id,
        quantity=order.quantity,
        paper_stock=order.paper_stock,
        finish=order.finish,
        shipping_address=order.shipping_address,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/orders")
async def list_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """
    Returns a history of all physical fulfillment orders for the current user.
    """
    return db.query(PhysicalOrder).filter(PhysicalOrder.user_id == user.id).order_by(PhysicalOrder.created_at.desc()).all()

@router.get("/orders/{order_id}")
async def get_order_status(order_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """
    Fetches details and status for a specific physical order.
    """
    order = db.query(PhysicalOrder).filter(PhysicalOrder.id == order_id, PhysicalOrder.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order record not found")
    return order
