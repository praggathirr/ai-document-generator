// ProjectOverview.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ProjectOverview = ({ username }) => {
  const [projectOverview, setProjectOverview] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing project overview if available
    const fetchProjectOverview = async () => {
      try {
        const response = await fetch('http://localhost:5001/get-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (data.success) {
          setProjectOverview(data.projectOverview);
        } else {
          setError(data.message || 'Error fetching project overview');
        }
      } catch (error) {
        console.error('Error fetching project overview:', error);
        setError('An error occurred while fetching the project overview.');
      }
    };

    if (username) {
      fetchProjectOverview();
    }
  }, [username]);

  // Save the project overview as the user types
  const handleOverviewChange = async (e) => {
    const updatedOverview = e.target.value;
    setProjectOverview(updatedOverview);

    try {
      await fetch('http://localhost:5001/save-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, projectOverview: updatedOverview }),
      });
    } catch (error) {
      console.error('Error saving project overview:', error);
      setError('An error occurred while saving the project overview.');
    }
  };

  return (
    <div className="overview-container">
      <h2 className="overview-title">Project Overview</h2>
      <textarea
        value={projectOverview}
        onChange={handleOverviewChange}
        placeholder="Enter a high-level overview of your project"
        rows="6"
        cols="50"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => navigate('/topics')} className="next-button">Next</button>
    </div>
  );
};

export default ProjectOverview;
