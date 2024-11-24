const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://incandescent-elf-fb475e.netlify.app/', // Replace with your actual Netlify URL
  methods: ['GET', 'POST'],
}));

const port = process.env.PORT || 5001;


// Endpoint to create a new account
app.post('/create-account', (req, res) => {
    const { username } = req.body;

    // Insert a new user if the username doesn't exist
    const query = `INSERT INTO users (username) VALUES (?)`;

    db.run(query, [username], function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        res.json({ success: true, message: 'Account created successfully' });
    });
});

// Endpoint to sign in with an existing account
app.post('/sign-in', (req, res) => {
    const { username } = req.body;

    // Check if the username exists
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred' });
        }
        if (row) {
            res.json({ success: true, message: 'Sign-in successful' });
        } else {
            res.status(400).json({ success: false, message: 'Username not found' });
        }
    });
});

// Endpoint to save checklist items for a user
app.post('/save-checklist', (req, res) => {
    const { username, checklist } = req.body;

    // Get the user ID for the given username
    const queryUserId = `SELECT id FROM users WHERE username = ?`;
    db.get(queryUserId, [username], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const userId = row.id;

        // Insert each checklist item for the user
        const queryChecklist = `INSERT INTO checklists (user_id, item) VALUES (?, ?)`;
        db.serialize(() => {
            checklist.forEach((item) => {
                db.run(queryChecklist, [userId, item], (err) => {
                    if (err) {
                        console.error("Error saving checklist item:", err.message);
                    }
                });
            });
        });
        res.json({ success: true, message: 'Checklist saved successfully' });
    });
});

// Endpoint to get checklist of selected topics
app.post('/get-checklist', (req, res) => {
    const { username } = req.body;
  
    const queryUserId = `SELECT id FROM users WHERE username = ?`;
    db.get(queryUserId, [username], (err, row) => {
      if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
      const userId = row.id;
  
      const query = `SELECT topic FROM selected_topics WHERE user_id = ?`;
      db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Error fetching topics' });
        const topics = rows.map((row) => row.topic);
        res.json({ success: true, checklist: topics });
      });
    });
  });

// Endpoint to save or update the project overview
app.post('/save-overview', (req, res) => {
    const { username, projectOverview } = req.body;
  
    const query = `UPDATE users SET project_overview = ? WHERE username = ?`;
    db.run(query, [projectOverview, username], function (err) {
      if (err) {
        console.error("Error saving project overview:", err.message);
        return res.status(500).json({ success: false, message: 'Error saving project overview' });
      }
      res.json({ success: true, message: 'Project overview saved successfully' });
    });
});
  
  // Endpoint to get the project overview for a user
app.post('/get-overview', (req, res) => {
    const { username } = req.body;
  
    const query = `SELECT project_overview FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
      if (err) {
        console.error("Error fetching project overview:", err.message);
        return res.status(500).json({ success: false, message: 'Error fetching project overview' });
      }
      res.json({ success: true, projectOverview: row ? row.project_overview : '' });
    });
});
  

// Endpoint to save selected topics
app.post('/save-selected-topics', (req, res) => {
    const { username, topics } = req.body;
    if (!Array.isArray(topics)) {
        return res.status(400).json({ success: false, message: 'Topics must be an array' });
      }
    const queryUserId = `SELECT id FROM users WHERE username = ?`;
    db.get(queryUserId, [username], (err, row) => {
      if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
      const userId = row.id;
  
      const query = `INSERT INTO selected_topics (user_id, topic) VALUES (?, ?)`;
      db.serialize(() => {
        // Delete all previously saved topics for this user
        db.run(`DELETE FROM selected_topics WHERE user_id = ?`, [userId]);
  
        // Insert each newly selected topic for this user
        topics.forEach((topic) => db.run(query, [userId, topic]));
  
        res.json({ success: true, message: 'Selected topics saved successfully' });
      });
    });
});
  

// Endpoint to save subtopic responses
app.post('/save-subtopic-responses', (req, res) => {
    const { username, topic, responses } = req.body;
    if (!username || !topic || !responses) {
      return res.status(400).json({ success: false, message: 'Missing data' });
    }
  
    const queryUserId = `SELECT id FROM users WHERE username = ?`;
    db.get(queryUserId, [username], (err, row) => {
      if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
      const userId = row.id;
  
      db.serialize(() => {
        // Delete existing responses for the topic to avoid duplicates
        db.run(`DELETE FROM subtopic_responses WHERE user_id = ? AND topic = ?`, [userId, topic]);
  
        // Insert each subtopic response into the database
        const insertQuery = `INSERT INTO subtopic_responses (user_id, topic, subtopic, response) VALUES (?, ?, ?, ?)`;
        for (const [subtopic, response] of Object.entries(responses)) {
          db.run(insertQuery, [userId, topic, subtopic, response]);
        }
  
        res.json({ success: true, message: 'Responses saved successfully' });
      });
    });
  });
  

// Endpoint to get selected topics for a user
app.post('/get-selected-topics', (req, res) => {
const { username } = req.body;

const queryUserId = `SELECT id FROM users WHERE username = ?`;
db.get(queryUserId, [username], (err, row) => {
    if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
    const userId = row.id;

    const query = `SELECT topic FROM selected_topics WHERE user_id = ?`;
    db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching topics' });
    const topics = rows.map((row) => row.topic);
    res.json({ success: true, topics });
    });
  });
});

// Endpoint to get subtopic responses
app.post('/get-subtopic-responses', (req, res) => {
    const { username, topic } = req.body;
    if (!username || !topic) {
      return res.status(400).json({ success: false, message: 'Missing data' });
    }
  
    const queryUserId = `SELECT id FROM users WHERE username = ?`;
    db.get(queryUserId, [username], (err, row) => {
      if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
      const userId = row.id;
  
      const selectQuery = `SELECT subtopic, response FROM subtopic_responses WHERE user_id = ? AND topic = ?`;
      db.all(selectQuery, [userId, topic], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Error retrieving responses' });
  
        // Convert rows to an object where keys are subtopics and values are responses
        const responses = {};
        rows.forEach(row => {
          responses[row.subtopic] = row.response;
        });
  
        res.json({ success: true, responses });
      });
    });
});
  

// // Endpoint to generate the quality management document
// app.post('/generate-document', (req, res) => {
//   const { username } = req.body;

//   if (!username) {
//       return res.status(400).json({ success: false, message: 'Username is required' });
//   }

//   // Retrieve the user ID based on the username
//   const queryUserId = `SELECT id FROM users WHERE username = ?`;
//   db.get(queryUserId, [username], (err, row) => {
//       if (err || !row) {
//       console.error("User not found or database error:", err);
//       return res.status(400).json({ success: false, message: 'User not found' });
//       }
//       const userId = row.id;

//       // Retrieve all subtopic responses for the selected topics of this user
//       const selectQuery = `SELECT topic, subtopic, response FROM subtopic_responses WHERE user_id = ?`;
//       db.all(selectQuery, [userId], async (err, rows) => {
//       if (err) {
//           console.error("Error retrieving responses:", err);
//           return res.status(500).json({ success: false, message: 'Error retrieving responses' });
//       }

//       // Organize responses by topic and subtopic
//       const documentContent = {};
//       rows.forEach(row => {
//           if (!documentContent[row.topic]) {
//           documentContent[row.topic] = [];
//           }
//           documentContent[row.topic].push({ subtopic: row.subtopic, response: row.response });
//       });

//       // Format the document content into a structured text
//       let prompt = `Create a quality management plan based on the following topics and responses:\n\n`;
//       for (const [topic, subtopics] of Object.entries(documentContent)) {
//           prompt += `\n## ${topic}\n`;
//           subtopics.forEach(({ subtopic, response }) => {
//           prompt += `\n- **${subtopic}**: ${response || 'No response provided.'}\n`;
//           });
//       }

//       try {
//           // Send the document content to OpenAI to generate a refined document
//           const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//           model: "gpt-4o-mini",
//           messages: [{ role: "user", content: prompt }],
//           max_tokens: 4000,
//           }, {
//           headers: {
//               'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//               'Content-Type': 'application/json',
//           }
//           });

//           // Return the generated document to the client
//           res.json({ success: true, document: response.data.choices[0].message.content });
//       } catch (error) {
//           console.error("Error generating document:", error.response ? error.response.data : error.message);
//           res.status(500).json({ success: false, message: 'Error generating document' });
//       }
//       });
//   });
// });

// Endpoint to generate the quality management document
app.post('/generate-document', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  // Retrieve the user ID and project overview based on the username
  const queryUser = `SELECT id, project_overview FROM users WHERE username = ?`;
  db.get(queryUser, [username], (err, row) => {
    if (err || !row) {
      console.error("User not found or database error:", err);
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const userId = row.id;
    const projectOverview = row.project_overview || "No project overview provided.";

    // Retrieve all subtopic responses for the selected topics of this user
    const selectQuery = `SELECT topic, subtopic, response FROM subtopic_responses WHERE user_id = ?`;
    db.all(selectQuery, [userId], async (err, rows) => {
      if (err) {
        console.error("Error retrieving responses:", err);
        return res.status(500).json({ success: false, message: 'Error retrieving responses' });
      }

      // Organize responses by topic and subtopic
      const documentContent = {};
      rows.forEach(row => {
        if (!documentContent[row.topic]) {
          documentContent[row.topic] = [];
        }
        documentContent[row.topic].push({ subtopic: row.subtopic, response: row.response });
      });

      // Format the document content into a structured prompt with project overview
      let prompt = `Create a detailed quality management plan for the project overview and selected topics below and add necessary details for each topic. If no response provided for a topic/subtopic, fill it in appropriately using context. Make sure each section title is the appropriate topic title including project overview. Don't add additional topics.\n\n`;
      prompt += `## Project Overview\n${projectOverview}\n\n`;

      for (const [topic, subtopics] of Object.entries(documentContent)) {
        prompt += `\n## ${topic}\n`;
        subtopics.forEach(({ subtopic, response }) => {
          prompt += `\n- **${subtopic}**: ${response || 'No response provided.'}\n`;
        });
      }

      try {
        // Send the document content to OpenAI to generate a refined document
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 10000,
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }
        });

        // Return the generated document to the client
        res.json({ success: true, document: response.data.choices[0].message.content });
      } catch (error) {
        console.error("Error generating document:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error generating document' });
      }
    });
  });
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});