from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(UserCreate):
    pass

class PostBase(BaseModel):
    username: str
    time_data: int

class Post(PostBase):
    id: int
    created_at: datetime
    user_id: int
    owner: UserOut
    class Config:
            from_attributes = True

class PostOut(BaseModel):
    Post: Post

class PostCreate(PostBase):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None