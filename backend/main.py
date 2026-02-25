from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cloud App API",
    description="API untuk mata kuliah Komputasi Awan",
    version="0.1.0"
)

# CORS - agar frontend bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk development saja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Hello from Cloud App API!",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/team")
def team_info():
    return {
        "team": "cloud-team-XX",
        "members": [
            # TODO: Isi dengan data tim Anda
            {"name": "Amazia Devid", "nim": "10231013", "role": "Lead Frontend"},
            {"name": "Andini Permata Sari", "nim": "10231015", "role": "Lead QA & Docs"},
            {"name": "Alsha Dwi Cahya", "nim": "10231011", "role": "Lead Container"},
            {"name": "Ansellma Tita Pakartiwuri Putri", "nim": "10231017", "role": "Lead Deploy & CI/CD"},
            {"name": "Tiya Mitra Ayu", "nim": "10231088", "role": "Backend"},
        ]
    }