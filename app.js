const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

require("dotenv").config();

const app = express();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/news", async (req, res) => {
    try {

        const query = req.query.q;
        let url = "";

        if (query) {
            url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`;
        } else {
            url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
        }

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {

        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch news" });

    }
});

app.post("/summarise", async (req, res) => {
    try {
        const { title, description } = req.body;

        const prompt = `
        Summarise this news article in exactly 2 concise sentences:
        
        Title: ${title}
        Description: ${description}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        res.json({summary: response.text});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI summarisation failed" });
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});