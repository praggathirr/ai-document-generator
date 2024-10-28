import React, { useState } from 'react';
import './App.css';

function App() {
  // State to hold the prompt and response
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  // Function to call the backend and generate the document
  const generateDocument = async () => {
    try {
      const res = await fetch('http://localhost:5001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error generating document:', error);
      setResponse('Error generating document');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>QA/QC Document Generator</h1>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          rows="5"
          cols="50"
        />
        <br />
        <button onClick={generateDocument}>Generate Document</button>
        <div>
          <h2>Generated Document:</h2>
          <p>{response}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
