from sqlalchemy import Column, Integer, String, DateTime
from .database import Base


class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(String, unique=True, nullable=True, index=True)

    author = Column(String, nullable=False)
    text = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)

    likes = Column(Integer, nullable=False, default=0)
    image = Column(String, nullable=False, default="")
