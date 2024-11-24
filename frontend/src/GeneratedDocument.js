// GeneratedDocument.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './App.css';

const GeneratedDocument = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state && location.state.document) {
      // If document content is passed via navigation state
      setDocumentContent(location.state.document);
    } else {
      // Fetch the generated document from the server
      fetchDocument();
    }
  }, [location.state]);

  const fetchDocument = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: location.state?.username }),
      });
      const data = await response.json();

      if (data.success) {
        setDocumentContent(data.document);
      } else {
        setError('Error fetching the document: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('An error occurred while fetching the document.');
    }

    setLoading(false);
  };

  return (
    <div className="generated-document-container">
      <button onClick={() => navigate('/selected-topics')} className="back-button">
        &#8592; Back to Topics
      </button>
      <h2>Generated Quality Management Document</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="document-content">
          {/* Use ReactMarkdown to format the document content */}
          <ReactMarkdown>{documentContent}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default GeneratedDocument;
