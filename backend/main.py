from fastapi import FastAPI

app = FastAPI(
    title="TypeForm Clone",
    version="1.0.0"
)

@app.get('/')
def root():
    return {
        "message": "Welcome to TypeForm Clone API"
    }

@app.get('/health')
def health_check():
    return {
        "status": "ok"
    }