import React, { useState, useRef, useEffect } from 'react';

function CameraCapture() {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, []);

  const getVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      setError('Error accessing camera: ' + error.message);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      setImageData(blob);
      sendImageToServer(blob);
    }, 'image/jpeg', 0.95);
  };

  const sendImageToServer = async (blob) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    const formData = new FormData();
    formData.append('imgFile', 'captured_image.jpg');

    try {
      const response = await fetch('http://localhost:8000/uploadfile', {  // Updated endpoint
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully!', data);
      } else {
        setError('Image upload failed: ' + response.statusText);
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '400px' }} />
      <button onClick={captureImage} disabled={isLoading}>
        {isLoading ? 'Capturing...' : 'Capture'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageData && (
        <div>
          <h2>Captured Image:</h2>
          <img src={URL.createObjectURL(imageData)} alt="Captured" />
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
