import cv2

def takePic():
    #Take picture of whatever the webcam sees
    cap = cv2.VideoCapture(0) # video capture source camera (Here webcam of laptop) 
    ret, frame = cap.read() # return a single frame in variable `frame`
    #print(frame.shape)
    cap.release() 
    
    #Open window displaying the picture
    #cv2.imshow('image', frame)
    
    #On window close finish the application
    #if cv2.waitKey(0) & 0xff == ord('q'): # press q to exit
    #    cv2.destroyAllWindows()
    return frame

print(takePic().shape)
