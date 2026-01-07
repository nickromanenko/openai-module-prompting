import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI();

app.post("/summarize", async (req, res) => {
    try {
        const text = req.body?.text;
        if (typeof text !== "string" || text.trim().length < 10) {
            return res
                .status(400)
                .json({ error: "text must be a string (min 10 chars)" });
        }

        const response = await client.responses.parse({
            model: "gpt-4.1",
            temperature: 0.2,
            max_output_tokens: 300,
            input: [],
        });

        return res.json({ summary: response.output_parsed });
    } catch (err: any) {
        // minimal error handling for lesson purposes
        res.status(500).json({
            error: "OpenAI request failed",
            details: err?.message,
        });
    }
});

app.listen(3000, () =>
    console.log("[+] API listening on http://localhost:3000")
);
