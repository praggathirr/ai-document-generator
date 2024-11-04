const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

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

    // Check if the username already exists
    if (users.has(username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Add the new username to the users set
    users.add(username);
    res.json({ success: true, message: 'Account created successfully' });
});

// Endpoint to sign in with an existing account
app.post('/sign-in', (req, res) => {
    const { username } = req.body;

    // Check if the username exists in the users set
    if (users.has(username)) {
        return res.json({ success: true, message: 'Sign-in successful' });
    }

    // If username not found, return an error
    res.status(400).json({ success: false, message: 'Username not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
