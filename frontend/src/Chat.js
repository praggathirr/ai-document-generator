import React, { useState } from 'react';
import './App.css';

const Chat = ({ username }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    try {
      const res = await fetch('http://localhost:5001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error generating document:', error);
      setResponse('Error generating document');
    }
  };

  return (
    <div className="chat-container">
      <h2>Hi {username}</h2>
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Enter your prompt..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSend} className="send-button">Send</button>
      <div className="response-container">
        <h3>Generated Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chat;
