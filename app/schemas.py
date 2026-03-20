from pydantic import BaseModel
from typing import Optional

class ParentContent(BaseModel):
    title: str
    content: str

class ChildContent(BaseModel):
    title:str
    content:str
class postupdate(BaseModel):
    title:Optional[str]=None
    content:Optional[str]=None

class titleupdate(BaseModel):
    title:Optional[str]=None
    content:Optional[str]=None    

