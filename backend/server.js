const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 5001;

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
