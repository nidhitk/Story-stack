from fastapi import FastAPI
from app.schemas import ParentContent,ChildContent,postupdate,titleupdate
from app.database import SessionLocal, engine
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.models import Content,Posts
from app import models
models.Base.metadata.create_all(bind=engine)
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://story-stack-lilac.vercel.app/"],  # allows all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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

# @app.get("/title/{titile_id}/posts")
# def getposts(title_id:int,db:Session=Depends(get_db)):
#    return db.query(Posts).filter(Posts.parent_id==title_id).all()

@app.get("/titile/{titile_id}/allposts")
def getallposts(titile_id:int,db:Session=Depends(get_db)):
    title=db.query(Content).filter(Content.id==titile_id).first()
    if not title:
        return {"no title found"}
    posts=db.query(Posts).filter(Posts.parent_id==titile_id).all()
    return{
        "titile":title,
        "posts":posts
    }

@app.get("/titles")
def getalltitles(db: Session = Depends(get_db)):
    titles = db.query(Content).all()
    result = []
    for title in titles:
        posts = db.query(Posts).filter(Posts.parent_id == title.id).all()
        result.append({
            "id": title.id,
            "title": title.title,
            "content": title.content,
            "posts": posts
        })
    return result   
    


@app.patch("/editTitle")
def edittitle(title_id:int,updatedtitle:titleupdate,db:Session=Depends(get_db)):
    titlecontent=db.query(Content).filter(Content.id==title_id).first()
    if not titlecontent:
        return {"error":"No title found"}
    if updatedtitle.title is not None:
       titlecontent.title=updatedtitle.title
    if updatedtitle.content is not None:
        titlecontent.content=updatedtitle.content 
    db.commit()
    db.refresh(titlecontent)
    return titlecontent


@app.patch("/editposts")
def editposts(post_id:int,updatedPosts: postupdate,db:Session=Depends(get_db)):
    childpost=db.query(Posts).filter(Posts.post_id==post_id).first()
    if not childpost:
        return{"error":"posts not found"}
    if updatedPosts.title is not None:
        childpost.title=updatedPosts.title
    if updatedPosts.content is not None:
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












