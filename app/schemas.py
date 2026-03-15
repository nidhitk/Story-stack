from pydantic import BaseModel
from typing import Optional

class ContentCreate(BaseModel):
    title: str
    content: str
    parent_id: Optional[int] = None