from fastapi import FastAPI

app = FastAPI(title="Comments API")


@app.get("/health")
def health():
    return {"status": "ok"}
