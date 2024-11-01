import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Instructions from './Instructions';
import Chat from './Chat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the instructions page */}
          <Route path="/" element={<Instructions />} />
          {/* Route for the chat page */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
