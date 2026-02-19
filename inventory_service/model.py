from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    category = Column(String)
    quantity_in_stock = Column(Integer)
    reorder_level = Column(Integer)
    supplier = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)
