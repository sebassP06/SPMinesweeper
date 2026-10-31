from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from fastapi.params import Body
from typing import Optional, List
from . import auth
from .. import schemas

router = APIRouter(
    prefix="/medium",
    tags=['Medium']
)

@router.get("/")
def get_medium_all():
    auth.cursor.execute("""select * from medium order by time_data ASC""")
    table = auth.cursor.fetchall()
    return table

@router.post("/", response_model=schemas.Post)
def create_medium_post(post: schemas.PostCreate):
    auth.cursor.execute("""INSERT INTO medium (username, time_data) VALUES (%s, %s) RETURNING * """, (post.username, post.time_data))
    new_post = auth.cursor.fetchone()
    auth.conn.commit()
    return new_post

@router.get("/{id}")
def get_medium_post(id: int):
    auth.cursor.execute("""SELECT * FROM medium WHERE id = %s;""", (id,))
    post = auth.cursor.fetchone()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} was not found")

    return post

@router.put("/{id}")
def update_medium_posts(id: int, post: schemas.PostCreate):
    auth.cursor.execute("""UPDATE medium SET username = %s, time_data = %s where id = %s returning *""", (post.username, post.time_data, id,))
    index = auth.cursor.fetchone()
    auth.conn.commit()

    if index == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} does not exist")
    return index
