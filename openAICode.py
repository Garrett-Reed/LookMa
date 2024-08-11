import openai
import base64
from PIL import Image
from io import BytesIO

openai.api_key = 'APIKEY' #Replace APIKEY with your openAI API Key

async def openAIModel(photo):
    # OpenAI model

    img = photo
    
    # Convert the image to RGB mode if necessary
    img = img.convert("RGB")

    # Create an in-memory bytes buffer to hold the JPEG data
    jpeg_buffer = BytesIO()
    img.save(jpeg_buffer, format="JPEG")
    jpeg_data = jpeg_buffer.getvalue()

    # Encode JPEG data to base64
    jpeg_base64 = base64.b64encode(jpeg_data).decode('utf-8')
    image_url = f"data:image/jpeg;base64,{jpeg_base64}"

    # Make sure you are using the correct OpenAI API endpoint and model
    
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
        {"role": "user", "content": [
            {"type": "text", "text": "What's in this image?"},
            {"type": "image_url", "image_url": {
                "url": image_url}
            }
        ]}],

        max_tokens=300,
    )


    #Return the best response
    extracted_text = response.choices[0].message.content
    return extracted_text