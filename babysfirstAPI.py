from fastapi import FastAPI, Form, UploadFile
from typing import Annotated

app = FastAPI()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}

async def upload_file(file: UploadFile = imgFile()):
    # Read the file contents
    contents = await file.read()
    return JSONResponse(content={"filename": file.filename})


    
async def root():
    return {"message": "Hello"}