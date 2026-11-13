from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from better_profanity import profanity
from . import auth
from .. import schemas

router = APIRouter(
    prefix="/easy",
    tags=['Easy']
)

@router.get("/")
def get_easy_all():
    auth.cursor.execute("""select * from easy order by time_data ASC LIMIT 10""")
    table = auth.cursor.fetchall()
    return table

@router.post("/", response_model=schemas.Post)
def create_easy_post(post: schemas.PostCreate):
    auth.cursor.execute("""INSERT INTO easy (username, time_data) VALUES (%s, %s) RETURNING * """, (post.username[:12], post.time_data))
    new_post = auth.cursor.fetchone()
    auth.conn.commit()
    return new_post

