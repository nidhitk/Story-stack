from fastapi import FastAPI
from app.schemas import ParentContent,ChildContent,postupdate,titleupdate,UserCreate,UserLogin,Token
from app.database import SessionLocal, engine
from fastapi import FastAPI, Depends,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models import Content,Posts,User
from app import models
models.Base.metadata.create_all(bind=engine)
from fastapi.middleware.cors import CORSMiddleware
from app.auth import create_access_token, create_refresh_token,hash_password,verify_password,SECRET_KEY,oauth2_scheme,jwt

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://story-stack-lilac.vercel.app"],  # allows all origins during development
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

@app.post("/register")
def register(user:UserCreate, db:Session=Depends(get_db)):
      
     existing_user=db.query(User).filter((User.username==user.username) |( User.email==user.email)).first()
     if existing_user:
         return {"message":"user already existing"}
     hashed = hash_password(user.password)
     new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed
    )
     db.add(new_user)
     db.commit()
     db.refresh(new_user)
     return {"message":"user created"}

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": db_user.username})
    refresh_token = create_refresh_token({"sub": db_user.username})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

def get_current_user(token: str = Depends(oauth2_scheme),db:Session=Depends(get_db)):
    payload=jwt.decode(token,SECRET_KEY,algorithms=["HS256"])
    username=payload.get("sub")
    
    user=db.query(User).filter(User.username==username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user







@app.post("/Title")
def create(ContentTitle:ParentContent, db: Session = Depends(get_db),):
    newrecord=Content(title=ContentTitle.title,
                            content=ContentTitle.content)
    db.add(newrecord)
    db.commit()
    db.refresh(newrecord)

    return newrecord

@app.post("/posts")
def createposts(parent_id:int,ContentPosts:ChildContent,db:Session=Depends(get_db), current_user: models.User = Depends(get_current_user)):
    newrecord=Posts(title=ContentPosts.title,content=ContentPosts.content,parent_id=parent_id,owner_id=current_user.id)
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
def editposts(post_id:int,updatedPosts: postupdate,db:Session=Depends(get_db),current_user:models.User=Depends(get_current_user)):
    
    childpost=db.query(Posts).filter(Posts.post_id==post_id).first()
    if not childpost:
        return{"error":"posts not found"}
    
    if childpost.owner_id!=current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
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
def deletepost(post_id:int,db:Session=Depends(get_db),current_user:models.User=Depends(get_current_user)):
    postcontent=db.query(Posts).filter(Posts.post_id==post_id).first()
    if not postcontent:
       return{"error":"post not found"}
    if postcontent.owner_id!=current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(postcontent)
    db.commit()
    return {"suucess":"post deleted"}












