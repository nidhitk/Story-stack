from fastapi import FastAPI
from app.schemas import ParentContent,ChildContent
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
from app.models import Content,Posts
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

@app.post("/Title")
def create(ContentTitle:ParentContent, db: Session = Depends(get_db)):
    newrecord=Content(title=ContentTitle.title,
                            content=ContentTitle.content)
    db.add(newrecord)
    db.commit()
    db.refresh(newrecord)

    return newrecord

@app.post("/posts")
def createposts(parent_id:int,ContentPosts:ChildContent,db:Session=Depends(get_db)):
    newrecord=Posts(title=ContentPosts.title,content=ContentPosts.content,parent_id=parent_id)
    db.add(newrecord)
    db.commit()
    db.refresh(newrecord)
    return newrecord

@app.get("/title/{titile_id}/posts")
def getposts(title_id:int,db:Session=Depends(get_db)):
   return db.query(Posts).filter(Posts.parent_id==title_id).all()


@app.put("/editTitle")
def edittitle(title_id:int,updatedtitle:ParentContent,db:Session=Depends(get_db)):
    titlecontent=db.query(Content).filter(Content.id==title_id).first()
    if not titlecontent:
        return {"error":"No title found"}
    titlecontent.content=updatedtitle.content
    db.commit()
    db.refresh(titlecontent)
    return titlecontent


@app.put("/editposts")
def editposts(post_id:int,updatedPosts:ChildContent ,db:Session=Depends(get_db)):
    childpost=db.query(Posts).filter(Posts.post_id==post_id).first()
    if not childpost:
        return{"error":"posts not found"}
    childpost.content=updatedPosts.content
    db.commit()
    db.refresh(childpost)
    return childpost

@app.delete("/deletecontent")
def deletecontent(titile_id:int,forced_delete:bool,db:Session=Depends(get_db)):
    titlecontent=db.query(Content).filter(Content.id==titile_id).first()
    if not titlecontent:
        return{"error":"Titile not found"}
    postcontent=db.query(Posts).filter(Posts.parent_id==titile_id).first()
    if not postcontent:
        db.delete(titlecontent)
        db.commit()
        return{"Title delete success"}

    if postcontent and forced_delete:
        db.query(Posts).filter(Posts.parent_id==titile_id).delete()
        db.delete(titlecontent)
        db.commit()
        return{"Title delete success from forced"}
    return{"error":"post is present, manual post delete required"}

@app.delete("/deletepost")
def deletepost(post_id:int,db:Session=Depends(get_db)):
    postcontent=db.query(Posts).filter(Posts.post_id==post_id).first()
    if not postcontent:
        return{"error":"post not found"}
    db.delete(postcontent)
    db.commit()
    return {"suucess":"post deleted"}










