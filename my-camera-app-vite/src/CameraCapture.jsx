import React, { useState } from 'react';

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

export default FastAPICall;
