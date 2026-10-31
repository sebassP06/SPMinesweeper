from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class PostBase(BaseModel):
    username: str
    time_data: int

class Post(PostBase):
    id: int
    created_at: datetime

class PostOut(BaseModel):
    Post: Post

class PostCreate(PostBase):
    pass