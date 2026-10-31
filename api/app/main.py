from fastapi import FastAPI
#from . import models
#from .database import engine
from .routers import easy, medium, hard, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(easy.router)
#app.include_router(hard.router)
app.include_router(medium.router)
#app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Hello World"}



