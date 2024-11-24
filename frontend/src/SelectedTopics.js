// SelectedTopics.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const SelectedTopics = ({ username }) => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/get-selected-topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (data.success) setTopics(data.topics);
    };
    fetchTopics();
  }, [username]);

  const handleGenerateDocument = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/generate-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (data.success) navigate('/generated-document', { state: { document: data.document } });
  };

  return (
    <div className="selected-topics-container">
      {/* Back Arrow Button */}
      <button className="back-button" onClick={() => navigate('/topics')}>
        &#8592; Back
      </button>
      <h2>Your Selected Topics</h2>
      <ul className="topics-list">
        {topics.map((topic) => (
          <li key={topic} className="topic-button" onClick={() => navigate(`/topic/${topic}`)}>
            {topic}
          </li>
        ))}
      </ul>
      <button onClick={handleGenerateDocument} className="generate-button">
        Generate Document
      </button>
    </div>
  );
};

export default SelectedTopics;
