from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Item
from schemas import ItemCreate, ItemUpdate, ItemResponse, ItemListResponse
import crud

# Buat semua tabel di database (jika belum ada)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cloud App API",
    description="REST API untuk mata kuliah Komputasi Awan — SI ITK",
    version="0.2.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== HEALTH CHECK ====================

@app.get("/health")
def health_check():
    """Endpoint untuk mengecek apakah API berjalan."""
    return {"status": "healthy", "version": "0.2.0"}


# ==================== CRUD ENDPOINTS ====================

@app.post("/items", response_model=ItemResponse, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """
    Buat item baru.
    """
    return crud.create_item(db=db, item_data=item)


@app.get("/items", response_model=ItemListResponse)
def list_items(
    skip: int = Query(0, ge=0, description="Jumlah data yang di-skip"),
    limit: int = Query(20, ge=1, le=100, description="Jumlah data per halaman"),
    search: str = Query(None, description="Cari berdasarkan nama/deskripsi"),
    db: Session = Depends(get_db),
):
    """
    Ambil daftar items dengan pagination dan search.
    """
    return crud.get_items(db=db, skip=skip, limit=limit, search=search)


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Ambil satu item berdasarkan ID."""
    item = crud.get_item(db=db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    """
    Update item berdasarkan ID.
    """
    updated = crud.update_item(db=db, item_id=item_id, item_data=item)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return updated


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """Hapus item berdasarkan ID."""
    success = crud.delete_item(db=db, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return None


# ==================== ITEM STATS (TUGAS BACKEND) ====================

@app.get("/items/stats")
def items_stats(db: Session = Depends(get_db)):
    """Statistik inventory."""
    items = db.query(Item).all()
    if not items:
        return {"total_items": 0, "total_value": 0, "most_expensive": None, "cheapest": None}
    
    return {
        "total_items": len(items),
        "total_value": sum(i.price * i.quantity for i in items),
        "most_expensive": {"name": max(items, key=lambda x: x.price).name, 
                          "price": max(items, key=lambda x: x.price).price},
        "cheapest": {"name": min(items, key=lambda x: x.price).name,
                    "price": min(items, key=lambda x: x.price).price},
    }

# ==================== TEAM INFO ====================

@app.get("/team")
def team_info():
    """Informasi tim."""
    return {
        "team": "cloud-team-XX",
        "members": [
            {"name": "Amazia Devid", "nim": "10231013", "role": "Lead Frontend"},
            {"name": "Andini Permata Sari", "nim": "10231015", "role": "Lead QA & Docs"},
            {"name": "Alsha Dwi Cahya", "nim": "10231011", "role": "Lead Container"},
            {"name": "Ansellma Tita Pakartiwuri Putri", "nim": "10231017", "role": "Lead Deploy & CI/CD"},
            {"name": "Tiya Mitra Ayu", "nim": "10231088", "role": "Lead Backend"},
        ],
    }