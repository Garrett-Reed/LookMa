from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from PIL import Image
from pydantic import BaseModel
import io
from starlette.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import requests
from transformers import BlipProcessor, BlipForConditionalGeneration


app = FastAPI()

# Set all CORS enabled origins
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:1664",
    "http://localhost:1664",
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://127.0.0.1:5173"
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class Item(BaseModel):
    name: str
    description: str = None

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

@app.post("/items/")
async def create_item(item: Item):
    # Append a word to the end of the name and description
    modified_name = item.name + " appended_word"
    modified_description = (item.description or "") + " appended_word"
    return {"modified_name": modified_name, "modified_description": modified_description}
    
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()

    #convert to image type usable by local model
    image_stream = io.BytesIO(contents)
    image = Image.open(image_stream)
    
    #Local Model
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    raw_image = image

    # unconditional image captioning for Local AI Model
    inputs = processor(raw_image, return_tensors="pt")
    out = model.generate(**inputs)
    extracted_text = (processor.decode(out[0], skip_special_tokens=True))
    #extracted_text = "Shortcut Achieved2"
    return JSONResponse(content={"filename": file.filename, "extracted_text": extracted_text})