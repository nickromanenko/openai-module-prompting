import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/summarize", async (req, res) => {
    try {
        const text = req.body?.text;
        if (typeof text !== "string" || text.trim().length < 10) {
            return res
                .status(400)
                .json({ error: "text must be a string (min 10 chars)" });
        }

        const response = await client.responses.create({
            model: "gpt-5",
            temperature: 0.2,
            max_output_tokens: 300,
            input: [
                {
                    role: "developer",
                    content:
                        "You are a backend summarization service. " +
                        "Return:\n" +
                        "1) Exactly 3 bullet points (max 18 words each)\n" +
                        "2) A line: Keywords: k1, k2, k3\n" +
                        "No extra text.",
                },
                {
                    role: "user",
                    content:
                        "Summarize the following text:\n\n" +
                        "```text\n" +
                        text +
                        "\n```",
                },
            ],
        });

        res.json({ summary: response.output_text });
    } catch (err: any) {
        // minimal error handling for lesson purposes
        res.status(500).json({
            error: "OpenAI request failed",
            details: err?.message,
        });
    }
});

app.listen(3000, () => console.log("API listening on http://localhost:3000"));
