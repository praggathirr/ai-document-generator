import React, { useState } from 'react';
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

const HighLevelTopics = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (topic) => {
    setSelectedTopics((prevSelected) =>
      prevSelected.includes(topic)
        ? prevSelected.filter((t) => t !== topic)
        : [...prevSelected, topic]
    );
  };

  const handleNext = () => {
    // Save selected topics if needed (e.g., send to backend or store in state)
    console.log("Selected topics:", selectedTopics);
    navigate('/chat');
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
              <span>{topic}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="next-button-container">
        <button onClick={handleNext} className="next-button">Next</button>
      </div>
    </div>
  );
};

export default HighLevelTopics;
