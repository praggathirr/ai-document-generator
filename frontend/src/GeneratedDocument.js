// GeneratedDocument.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

const GeneratedDocument = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { document } = location.state;

  return (
    <div>
      <h2>Generated Quality Management Document</h2>
      <pre>{document}</pre>
      <button onClick={() => navigate('/selected-topics')}>Back to Topics</button>
    </div>
  );
};

export default GeneratedDocument;
