import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Instructions = () => {
  const navigate = useNavigate();


  return (
    <div className="instructions-container">
      <h1>Welcome to the AI Document Generation System</h1>
      <p>
        This system leverages AI to automate guided document creation based on user-provided prompts and related subtopics.
        Follow these steps to get started:
      </p>
      <ol>
        <li>Create a username to get started or log-in with an existing username.</li>
        <li>Provide an overview of your project.</li>
        <li>Check off topics from a high-level checklist of topics provided with those that apply to your project.</li>
        <li>Answer specific questions related to the subtopics presented for each topic you initially checked off (Please be as detailed as possible to generate the best and highly accurate document!).</li>
        <li>The AI will generate a draft document based on the selected topics and your answers.</li>
        <li>Review the generated document and make any necessary refinements.</li>
      </ol>
      <p>
        Once you’re ready, click the "Start" button below to begin creating your document.
      </p>
      <div className="button-container">
        <button onClick={() => navigate('/sign-in')} className="auth-button">Sign In</button>
        <button onClick={() => navigate('/create-account')} className="auth-button">Create Account</button>
      </div>
    </div>
  );
};

export default Instructions;
