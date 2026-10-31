from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from fastapi.params import Body
from typing import Optional, List
from . import auth
from .. import schemas

router = APIRouter(
    prefix="/hard",
    tags=['Hard']
)

@router.get("/")
def get_hard_all():
    auth.cursor.execute("""select * from hard order by time_data ASC""")
    table = auth.cursor.fetchall()
    return table

@router.post("/", response_model=schemas.Post)
def create_hard_post(post: schemas.PostCreate):
    auth.cursor.execute("""INSERT INTO hard (username, time_data) VALUES (%s, %s) RETURNING * """, (post.username, post.time_data))
    new_post = auth.cursor.fetchone()
    auth.conn.commit()
    return new_post

@router.get("/{id}")
def get_hard_post(id: int):
    auth.cursor.execute("""SELECT * FROM hard WHERE id = %s;""", (id,))
    post = auth.cursor.fetchone()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} was not found")

    return post

@router.put("/{id}")
def update_hard_posts(id: int, post: schemas.PostCreate):
    auth.cursor.execute("""UPDATE hard SET username = %s, time_data = %s where id = %s returning *""", (post.username, post.time_data, id,))
    index = auth.cursor.fetchone()
    auth.conn.commit()

    if index == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} does not exist")
    return index
