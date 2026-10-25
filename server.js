import "dotenv/config";
import express from "express";
import { ChatGroq } from "@langchain/groq";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const llm = new ChatGroq({ model: "openai/gpt-oss-20b" });

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // frontend ka "ai" role model ke liye "assistant" banta hai
    const history = messages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    }));

    const result = await llm.invoke(history);
    res.json({ content: result.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));