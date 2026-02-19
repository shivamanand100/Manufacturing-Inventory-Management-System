from pydantic import BaseModel
from datetime import datetime

class ItemBase(BaseModel):
    item_name: str
    category: str
    quantity_in_stock: int
    reorder_level: int
    supplier: str

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True
