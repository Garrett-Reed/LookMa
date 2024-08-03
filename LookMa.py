import cv2
import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

def takePic():
    #Use web cam to capture image
    img = webCam()
    
    #Use USB C camera on laptop to capture image
    #img = pcCameraUSB()
    return img

def webCam():
    #Take picture of whatever the webcam sees
    cap = cv2.VideoCapture(0) # video capture source camera (Here webcam of laptop) 
    ret, frame = cap.read() # return a single frame in variable `frame`
    cap.release()
    return frame

def pcCameraUSB():
    pass
    
def rawImage():
    #get from VITE image button thingy
    #pass as parameter to runModel()
    #may not need and just get the image from FAST API
    pass
  
def runModel():
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    #raw_image = from parameter
    raw_image = Image.fromarray(takePic()).convert('RGB')
    #img_url = 'https://storage.googleapis.com/sfr-vision-language-research/BLIP/demo.jpg' 
    #img_url = 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Friedrich-Johann-Justin-Bertuch_Mythical-Creature-Dragon_1806.jpg'
    #raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')
    #raw_image = URLImageInput(img_url)
    ## conditional image captioning
    #text = "A victorian painting of"
    #inputs = processor(raw_image, text, return_tensors="pt")

    #out = model.generate(**inputs)
    #print(processor.decode(out[0], skip_special_tokens=True))
    # >>> a photography of a woman and her dog

    # unconditional image captioning
    inputs = processor(raw_image, return_tensors="pt")

    out = model.generate(**inputs)
    print(processor.decode(out[0], skip_special_tokens=True))

runModel()