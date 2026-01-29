from datetime import datetime
from pydantic import BaseModel, Field


class CommentsCreate(BaseModel):
    text: str = Field(min_length=1)


class CommentsUpdate(BaseModel):
    text: str = Field(min_length=1)


class CommentsOut(BaseModel):
    id: int
    author: str
    text: str
    created_at: datetime
    likes: int
    image: str

    class Config:
        from_attributes = True
