const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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
app.post('/save-subtopic-response', (req, res) => {
const { username, topic, subtopic, response } = req.body;

const queryUserId = `SELECT id FROM users WHERE username = ?`;
db.get(queryUserId, [username], (err, row) => {
    if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
    const userId = row.id;

    const query = `INSERT INTO subtopic_responses (user_id, topic, subtopic, response) VALUES (?, ?, ?, ?)
                    ON CONFLICT(user_id, topic, subtopic) DO UPDATE SET response = ?`;
    db.run(query, [userId, topic, subtopic, response, response], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error saving subtopic response' });
    res.json({ success: true, message: 'Subtopic response saved successfully' });
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

// Endpoint to get subtopic responses for a user and topic
app.post('/get-subtopic-responses', (req, res) => {
const { username, topic } = req.body;

const queryUserId = `SELECT id FROM users WHERE username = ?`;
db.get(queryUserId, [username], (err, row) => {
    if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
    const userId = row.id;

    const query = `SELECT subtopic, response FROM subtopic_responses WHERE user_id = ? AND topic = ?`;
    db.all(query, [userId, topic], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching subtopic responses' });
    const responses = rows.reduce((acc, row) => ({ ...acc, [row.subtopic]: row.response }), {});
    res.json({ success: true, responses });
    });
});
});

// Endpoint to generate document based on user's responses
app.post('/generate-document', async (req, res) => {
const { username } = req.body;

const queryUserId = `SELECT id FROM users WHERE username = ?`;
db.get(queryUserId, [username], async (err, row) => {
    if (err || !row) return res.status(400).json({ success: false, message: 'User not found' });
    const userId = row.id;

    const query = `SELECT topic, subtopic, response FROM subtopic_responses WHERE user_id = ?`;
    db.all(query, [userId], async (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching responses' });

    const content = rows.map((row) => `${row.topic} - ${row.subtopic}: ${row.response}`).join('\n');

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content }],
        max_tokens: 1000,
        }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        });

        res.json({ success: true, document: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating document:", error.response ? error.response.data : error.message);
        res.status(500).send("Error generating document.");
    }
    });
});
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});