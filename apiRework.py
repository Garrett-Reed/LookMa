from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from PIL import Image
from pydantic import BaseModel
import io
from starlette.responses import StreamingResponse

app = FastAPI()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    grayscale_image = image.convert("L")
    buffer = io.BytesIO()
    grayscale_image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")
    #testString = 'Hello Dolly'
    #return testString