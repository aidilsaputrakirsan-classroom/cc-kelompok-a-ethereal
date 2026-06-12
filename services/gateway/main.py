import os
import httpx
import logging
import asyncio
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gateway")

app = FastAPI(title="API Gateway")

# Environment variables for internal service URLs
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
TASK_SERVICE_URL = os.getenv("TASK_SERVICE_URL", "http://localhost:8002")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# CORS Configuration
# Di produksi Railway, allow origin dari domain publik gateway itu sendiri dan frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*" # Dipermudah untuk fleksibilitas Railway, bisa diperketat nanti
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "healthy", "service": "gateway"}

@app.get("/status")
async def get_status():
    """
    Aggregated health check for all services in parallel.
    """
    async with httpx.AsyncClient() as client:
        # Define health check tasks
        async def check_auth():
            try:
                auth_res = await client.get(f"{AUTH_SERVICE_URL}/health", timeout=2.0)
                return {"status": "healthy"} if auth_res.status_code == 200 else {"status": "unhealthy"}
            except Exception as e:
                logger.error(f"Error checking auth health: {e}")
                return {"status": "unhealthy", "message": str(e)}

        async def check_tasks():
            try:
                task_res = await client.get(f"{TASK_SERVICE_URL}/health", timeout=2.0)
                return {"status": "healthy"} if task_res.status_code == 200 else {"status": "unhealthy"}
            except Exception as e:
                logger.error(f"Error checking task health: {e}")
                return {"status": "unhealthy", "message": str(e)}

        # Run checks in parallel
        auth_status, task_status = await asyncio.gather(check_auth(), check_tasks())

        return {
            "gateway": {"status": "healthy"},
            "auth": auth_status,
            "tasks": task_status
        }

async def proxy_request(url: str, request: Request):
    """
    Generic proxy function to forward requests to microservices.
    """
    logger.info(f"Proxying {request.method} {request.url} -> {url}")
    async with httpx.AsyncClient() as client:
        method = request.method
        content = await request.body()
        headers = dict(request.headers)
        
        # Remove headers that should be recalculated by httpx
        headers.pop("host", None)
        headers.pop("content-length", None)

        try:
            response = await client.request(
                method,
                url,
                content=content,
                headers=headers,
                params=request.query_params,
                timeout=10.0
            )
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
        except Exception as e:
            logger.error(f"Proxy error to {url}: {e}")
            return JSONResponse(
                status_code=503,
                content={"detail": "Service unavailable"}
            )

# Proxy routes for Auth Service
@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def auth_proxy(path: str, request: Request):
    # Map /auth/login -> {AUTH_SERVICE_URL}/login
    # Check if path starts with register, login, or verify
    url = f"{AUTH_SERVICE_URL}/{path}"
    return await proxy_request(url, request)

# Proxy routes for Task Service
@app.api_route("/tasks/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def task_proxy(path: str, request: Request):
    url = f"{TASK_SERVICE_URL}/tasks/{path}" if path else f"{TASK_SERVICE_URL}/tasks"
    return await proxy_request(url, request)

# Catch-all proxy for Frontend (static files / React app)
@app.api_route("/{path:path}", methods=["GET"])
async def frontend_proxy(path: str, request: Request):
    # Ignore /status, /health, /auth, /tasks which are handled above
    if path.startswith(("status", "health", "auth", "tasks")):
        return Response(status_code=404)
        
    url = f"{FRONTEND_URL}/{path}"
    return await proxy_request(url, request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=80)
