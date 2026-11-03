from fastapi import FastAPI, Depends
from .routers import easy, medium, hard
from fastapi.middleware.cors import CORSMiddleware
from . import api_key

app = FastAPI(dependencies=[Depends(api_key.validate_api_key)])

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(easy.router)
app.include_router(hard.router)
app.include_router(medium.router)
#app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Hello World"}



