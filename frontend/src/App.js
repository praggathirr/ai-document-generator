import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Instructions from './Instructions';
import CreateAccount from './CreateAccount';
import SignIn from './SignIn';
import ProjectOverview from './ProjectOverview';
import HighLevelTopics from './HighLevelTopics';
import SelectedTopics from './SelectedTopics';
import SubtopicQuestions from './SubtopicQuestions';
import GeneratedDocument from './GeneratedDocument';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Instructions />} />
          <Route path="/create-account" element={<CreateAccount setUsername={setUsername} />} />
          <Route path="/sign-in" element={<SignIn setUsername={setUsername} />} />
          <Route path="/overview" element={<ProjectOverview username={username} />} />
          <Route path="/topics" element={<HighLevelTopics username={username} />} />
          <Route path="/selected-topics" element={<SelectedTopics username={username} />} />
          <Route path="/topic/:topic" element={<SubtopicQuestions username={username} />} />
          <Route path="/generated-document" element={<GeneratedDocument />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
