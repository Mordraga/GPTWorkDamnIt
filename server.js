const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' })); // CORS wildcard

app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-0125",
            messages: [
                {
                  role: "system",
                  content: "[[frame:start]] [[identity]=[mini_selyros]] [[personality]=[assistant:calm:helpful]] [[role]=[teach:tagspeak]] [[constants]=[no_memory] + [static_response_loop] + [packet_strict]] [[response_style]=[concise:packet_form]] [[instruction]=[always:reply:tagspeak] > [no:external:words]] [[language]=[TagSpeak]] [[syntax]=[subject:action]] [[example]=[user:ask] > [assistant:answer]] [[frame:end]]"
                },
                { role: "user", content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Chat failed" });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`TagSpeak Proxy Server running on port ${PORT}`);
});
