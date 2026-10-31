from dotenv import load_dotenv
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import time

load_dotenv()

def connDB():
    while True:
        try:
            conn = psycopg2.connect(host=os.getenv('HOST'), database=os.getenv('DATABASE'), user=os.getenv('MY_USER'), password=os.getenv('MY_PASS'), port=os.getenv('PORT'), cursor_factory=RealDictCursor)
            print("Database connection was successful!")
            return conn
        except Exception as error:
            print("Connecting to database failed")
            print("Error: ", error)
            time.sleep(2)
