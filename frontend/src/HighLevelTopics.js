import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const topics = [
  "Hierarchy of responsibility (Organization Chart)",
  "Coordination with related Trade Partners",
  "List of 'required' Mock-Ups and Benchmark equipment and structure",
  "List of 'non-required' Mock-Ups and Benchmark equipment and structure",
  "List of 'specified' tolerances",
  "Coordination of submittals for building enclosure and support Structural Trade Partner",
  "Program for identifying and correcting defective work",
  "Start-Up procedures (if applicable)",
  "Closeout procedures",
  "Installation, maintenance, and operation instructions for manufactured items",
  "Installer qualifications and certifications including date of expiration",
  "Control and calibration records of all tools and test instruments used for Quality Control activities",
  "Third-Party testing/inspection qualifications and certifications including date of expiration",
  "Procedures for fabrication and installation",
  "Procedures for verification of compliance with equipment manufacturer storage requirements",
  "Develop an Equipment Protection Plan in accordance with spec section 01 40 00",
  "Procedures for planning and verifying compliance of work",
  "Procedures for layout verification",
  "Procedures for verification of compliance with requirements of contract documents",
  "Entry of Autodesk Platform quality inspection and forms",
  "Include plan to complete and review 100% of all documentation for accuracy prior to uploading to Autodesk Platform",
  "Include plan to upload inspection documentation in accordance with spec section 01 40 00",
  "Testing and Inspection Plans as necessary",
  "Include right the first-time audit every month with an action plan if RFTF % drops below 80 percent",
  "Process for collection, review, and submittal of sub-tiers quality plans and contact information",
  "The procedure for ensuring that all required programs will be implemented and enforced for all employees",
  "The method that will be used to ensure that all necessary training is performed as required",
  "The process for training new employees, transient workers, returning employees, etc."
];

const HighLevelTopics = ({ username }) => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      // Fetch existing checklist if needed
      console.log("HighLevelTopics received username:", username); // Check username value
      const fetchChecklist = async () => {
        try {
          const response = await fetch('http://localhost:5001/get-checklist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
          });
          const data = await response.json();
          if (data.success) {
            setSelectedTopics(data.checklist);
          } else {
            setError('Error fetching checklist');
          }
        } catch (error) {
          console.error('Error fetching checklist:', error);
          setError('An error occurred while fetching the checklist.');
        }
      };
  
      if (username) {
        fetchChecklist();
      }
    }, [username]);
  
    const handleCheckboxChange = (topic) => {
      setSelectedTopics((prevSelected) =>
        prevSelected.includes(topic)
          ? prevSelected.filter((t) => t !== topic)
          : [...prevSelected, topic]
      );
    };
  
    const handleSaveChecklist = async () => {
      console.log("Saving checklist for username:", username);
      console.log("Checklist items to save:", selectedTopics);
      try {
        const response = await fetch('http://localhost:5001/save-checklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, checklist: selectedTopics }),
        });
        const data = await response.json();
        if (data.success) {
          navigate('/chat'); // Proceed to chat page after saving
        } else {
          setError('Error saving checklist');
        }
      } catch (error) {
        console.error('Error saving checklist:', error);
        setError('An error occurred while saving the checklist.');
      }
    };
  
    return (
      <div className="topics-container">
        <h2>High-Level Topics Checklist</h2>
        <p>Please check off all topics that are necessary for your project:</p>
        <ul className="topics-list">
          {topics.map((topic, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleCheckboxChange(topic)}
                />
                {topic}
              </label>
            </li>
          ))}
        </ul>
        <div className="next-button-container">
          <button onClick={handleSaveChecklist} className="next-button">Save and Continue</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  };
  
  export default HighLevelTopics;
