from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Posts(Base):
    __tablename__ = "posts"

    post_id=Column(Integer,primary_key=True,index=True)
    title  =Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    parent_id=Column(Integer,ForeignKey("contents.id"))

