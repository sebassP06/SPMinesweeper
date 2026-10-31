from ..database import connDB
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from .. import schemas, oauth2
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from dotenv import load_dotenv
import os

load_dotenv('../.env')

conn = connDB()
cursor = conn.cursor()

router = APIRouter(tags=['Authentication'])

@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends()):
    
    if not (user_credentials.username == os.getenv('MY_USER')):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    if not (user_credentials.password == os.getenv('MY_PASS')):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    access_token = oauth2.create_access_token(data = {"id": os.getenv('MY_ID')})
    return {"access_token": access_token, "token_type": "bearer"}