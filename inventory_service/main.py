from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
import csv
import io

from .database import engine, SessionLocal
from .model import Base, Item
from .schema import ItemCreate, ItemResponse

app = FastAPI()

# CORS (keep here near top)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Inventory Service Running"}

# ---------------------------
# ✅ Non-dynamic routes first
# ---------------------------

# Get All Items
@app.get("/items/", response_model=list[ItemResponse])
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

# Create Item
@app.post("/items/", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    new_item = Item(
        item_name=item.item_name,
        category=item.category,
        quantity_in_stock=item.quantity_in_stock,
        reorder_level=item.reorder_level,
        supplier=item.supplier,
        last_updated=datetime.now()
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# Low Stock Items
@app.get("/items/low-stock", response_model=list[ItemResponse])
def get_low_stock(db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.quantity_in_stock < Item.reorder_level).all()

# Summary Endpoint
@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    total_items = len(items)
    low_stock = len([i for i in items if i.quantity_in_stock < i.reorder_level])
    return {"total_items": total_items, "low_stock_items": low_stock}

# ✅ CSV Download MUST be above /items/{item_id}
@app.get("/items/download-csv")
def download_csv(db: Session = Depends(get_db)):
    items = db.query(Item).all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Item Name",
        "Category",
        "Quantity In Stock",
        "Reorder Level",
        "Supplier",
        "Last Updated"
    ])

    for item in items:
        writer.writerow([
            item.id,
            item.item_name,
            item.category,
            item.quantity_in_stock,
            item.reorder_level,
            item.supplier,
            item.last_updated
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory.csv"}
    )

# ---------------------------
# ✅ Dynamic routes at bottom
# ---------------------------

# Get Single Item
@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Update Item
@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, updated_item: ItemCreate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.item_name = updated_item.item_name
    item.category = updated_item.category
    item.quantity_in_stock = updated_item.quantity_in_stock
    item.reorder_level = updated_item.reorder_level
    item.supplier = updated_item.supplier
    item.last_updated = datetime.now()

    db.commit()
    db.refresh(item)
    return item

# Delete Item
@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}
