from fastapi import FastAPI, Depends
from .routers import easy, medium, hard, auth, users
from fastapi.middleware.cors import CORSMiddleware
from . import api_key

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
app.include_router(hard.router)
app.include_router(medium.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/all")
def get_all():
    auth.cursor.execute("""SELECT *
FROM (
    (SELECT *, 'easy' AS difficulty
     FROM easy
     ORDER BY time_data ASC
     LIMIT 10)

    UNION ALL

    (SELECT *, 'medium' AS difficulty
     FROM medium
     ORDER BY time_data ASC
     LIMIT 10)

    UNION ALL

    (SELECT *, 'hard' AS difficulty
     FROM hard
     ORDER BY time_data ASC
     LIMIT 10)
);""")
    table = auth.cursor.fetchall()
    return table


