from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db
from . import models
from .models import Comments
from .schemas import CommentsOut, CommentsCreate, CommentsUpdate

from pathlib import Path
import json
from dateutil import parser as date_parser
from datetime import datetime, timezone

from fastapi import HTTPException

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    db_gen = get_db()
    db = next(db_gen)
    try:
        seed_db_if_empty(db)
    finally:
        db_gen.close()

    yield


app = FastAPI(title="Comments API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create table
models.Base.metadata.create_all(bind=engine)

# seed db
DATA_PATH = Path(__file__).parent.parent / "data" / "comments.json"


def seed_db_if_empty(db):
    # If the comments exist, skip
    if db.query(Comments).count() > 0:
        return

    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(e)

    for item in data.get("comments", []):
        db.add(
            Comments(
                source_id=item.get("id"),
                author=item.get("author", ""),
                text=item.get("text", ""),
                created_at=date_parser.parse(item["date"]),
                likes=item.get("likes", 0),
                image=item.get("image", "") or "",
            )
        )

    db.commit()


# health check
@app.get("/health")
def health():
    return {"status": "ok"}


# list all comments (Read)
@app.get("/comments", response_model=list[CommentsOut])
def list_comments(db: Session = Depends(get_db)):
    return db.query(Comments).order_by(Comments.created_at.asc()).all()


# add the comments (Create)
@app.post("/comments", response_model=CommentsOut)
def create_comments(payload: CommentsCreate, db: Session = Depends(get_db)):
    new_comments = Comments(
        author="Admin",
        text=payload.text,
        created_at=datetime.now(timezone.utc),
        likes=0,
        image="",
    )
    db.add(new_comments)
    db.commit()
    db.refresh(new_comments)
    return new_comments


# edit the comment (Update)
@app.patch("/comments/{comment_id}", response_model=CommentsOut)
def update_comment(
    comment_id: int, payload: CommentsUpdate, db: Session = Depends(get_db)
):
    comment = db.query(Comments).filter(Comments.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.text = payload.text
    db.commit()
    db.refresh(comment)
    return comment


# delete the comment (Delete)
@app.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comments).filter(Comments.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"ok": True}
