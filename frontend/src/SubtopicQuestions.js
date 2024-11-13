// SubtopicQuestions.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import subtopics from './subtopics';
import './App.css';

const SubtopicQuestions = ({ username }) => {
  const { topic } = useParams(); // topic from URL parameters
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing responses for this topic if available
    const fetchResponses = async () => {
      try {
        const response = await fetch('http://localhost:5001/get-subtopic-responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, topic }),
        });
        const data = await response.json();
        if (data.success) {
          setResponses(data.responses);
        } else {
          setError(data.message || 'Error fetching subtopic responses');
        }
      } catch (error) {
        console.error('Error fetching subtopic responses:', error);
        setError('An error occurred while fetching subtopic responses.');
      }
    };

    if (username && topic) {
      fetchResponses();
    }
  }, [username, topic]);

  // Save the response as the user types
  const handleResponseChange = (subtopic, value) => {
    setResponses((prev) => ({ ...prev, [subtopic]: value }));

    // Save response to the backend
    fetch('http://localhost:5001/save-subtopic-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, topic, subtopic, response: value }),
    }).catch((error) => console.error('Error saving subtopic response:', error));
  };

  // Get the list of subtopics for the selected topic
  const topicSubtopics = subtopics[topic] || [];

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>{topic}</h2>
      {error && <p className="error-message">{error}</p>}
      
      <div className="subtopic-questions-container">
        {topicSubtopics.map((subtopic, index) => (
          <div key={index} className="subtopic-question">
            <label>{subtopic}</label>
            <textarea
              value={responses[subtopic] || ''}
              onChange={(e) => handleResponseChange(subtopic, e.target.value)}
              rows="3"
              cols="50"
              placeholder="Enter your response here"
            />
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/selected-topics')} className="back-button">
       &#8592; Back to Topics
      </button>
    </div>
  );
};

export default SubtopicQuestions;
