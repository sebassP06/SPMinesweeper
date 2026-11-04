from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from better_profanity import profanity
from . import auth
from .. import schemas

router = APIRouter(
    prefix="/medium",
    tags=['Medium']
)

@router.get("/")
def get_medium_all():
    auth.cursor.execute("""select * from medium order by time_data ASC LIMIT 10""")
    table = auth.cursor.fetchall()
    return table

@router.post("/", response_model=schemas.Post)
def create_medium_post(post: schemas.PostCreate):
    auth.cursor.execute("""INSERT INTO medium (username, time_data) VALUES (%s, %s) RETURNING * """, (profanity.censor(post.username[:12]), post.time_data))
    new_post = auth.cursor.fetchone()
    auth.conn.commit()
    return new_post

