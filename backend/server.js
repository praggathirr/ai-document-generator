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

// In-memory storage for usernames
const users = new Set();

// Endpoint to generate document using OpenAI
app.post('/generate', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error making OpenAI API request:", error.response ? error.response.data : error.message);
        res.status(500).send("Error generating document.");
    }
});

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

// Endpoint to retrieve checklist items for a user
app.post('/get-checklist', (req, res) => {
    const { username } = req.body;

    // Get the user ID for the given username
    const queryUserId = `SELECT id FROM users WHERE username = ?`;
    db.get(queryUserId, [username], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const userId = row.id;

        // Retrieve the checklist items for the user
        const queryChecklist = `SELECT item FROM checklists WHERE user_id = ?`;
        db.all(queryChecklist, [userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            const checklist = rows.map(row => row.item);
            res.json({ success: true, checklist });
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
  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});