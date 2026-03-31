const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/news", async (req, res) => {
    try {
        const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});