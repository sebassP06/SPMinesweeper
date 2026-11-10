from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from fastapi.params import Body
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from . import auth
from .. import schemas, utils

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate):

    #hash password
    hash_password = utils.hash(user.password)
    user.password = hash_password
    auth.cursor.execute("""INSERT INTO users (username, password) VALUES (%s, %s) RETURNING * """, (user.username, user.password))
    new_user = auth.cursor.fetchone()
    auth.conn.commit()
   
    return new_user



""" @router.get("/{id}", response_model=schemas.UserOut)
def get_user(id: int):
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with id: {id} does not exist")

    return user """