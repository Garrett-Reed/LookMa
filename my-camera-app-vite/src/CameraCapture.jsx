import React, { useRef, useState } from 'react';

function FastAPICall() {
    const [response, setResponse] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { name, description };

        try {
            const res = await fetch('http://127.0.0.1:8000/items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            setResponse(result);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <button type="submit">Submit</button>
            </form>
            {response && (
                <div>
                    <h3>Modified Text:</h3>
                    <p>Modified Name: {response.modified_name}</p>
                    <p>Modified Description: {response.modified_description}</p>
                </div>
            )}
        </div>
    );
}

//export default FastAPICall;


function WebcamCapture() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [captured, setCaptured] = useState(false);
    const [extractedText, setExtractedText] = useState('');

    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            })
            .catch(err => console.error("Error accessing webcam:", err));
    };

    const captureImage = () => {
        if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    setImage(blob);
                    setCaptured(true);

                    // Stop the webcam stream
                    const stream = video.srcObject;
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                    video.srcObject = null;
                }, 'image/jpeg');
            }
        }
    };

    const transferImage = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('file', image, 'image.jpg');

        try {
            const response = await fetch('http://127.0.0.1:8000/upload-image/', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log(result);
            setExtractedText(result.extracted_text); // Store the returned text
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div>
            <div>
                <video ref={videoRef} width="400" height="300" style={{ display: captured ? 'none' : 'block' }} />
                {captured && image && (
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Captured"
                        width="400"
                        height="300"
                    />
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div>
            <button onClick={startWebcam} disabled={captured}>Start Camera</button>
            <button onClick={captureImage} disabled={captured}>Capture Image</button>
            <button onClick={transferImage} disabled={!captured}>Transfer Image</button>
            </div>
            {extractedText && (
                <div>
                    <h2>Extracted Text:</h2>
                    <p>{extractedText}</p>
                </div>
            )}
        </div>
    );
}

export default WebcamCapture;

