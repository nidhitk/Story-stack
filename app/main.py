from fastapi import FastAPI
from app.schemas import ContentCreate
app=FastAPI()

# @app.get("/item/{num}")
# def storystack(n:int):
#     return {"result":"hello users ,from story stack{num}"}

# @app.get("/items/{item_id}")
# async def read_item(item_id: str, q: str | None = None, short: bool = False):
#     item = {"item_id": item_id}
    
#     if q:
#         item.update({"q": q})
#     if not short:
#         item.update(
#             {"description": "This is an amazing item that has a long description"}
#         )
#     return item
from app.database import SessionLocal, engine
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.models import Content
from app import models
models.Base.metadata.create_all(bind=engine)


@app.get("/")
def health():
    return {"health":"server is good"}




def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/create/{journal_id}")
def create(journal_id:int,journals:ContentCreate, db: Session = Depends(get_db)):
    newrecord=Content(title=journals.title,
                            content=journals.content,
                             parent_id=journals.parent_id )
    db.add(newrecord)
    db.commit()
    db.refresh(newrecord)

    return newrecord



 

