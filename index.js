const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/generate", async (req, res) => {
  const { prompt } = req.query;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Respond like a human, the objective is to generate text that mimics human conversation. Your goal is to produce responses to user input in a natural and human-like manner. When a user interacts with the system, the responses should be generated in a way that it appears as if two humans are engaging in a conversation. The generated text should be relevant, informative, and contextually appropriate, without introducing extraneous or unnecessary information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).send(response.choices[0].message.content);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server error" });
  }
});

app.post("/summarize", async (req, res) => {
  let { query } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "your objective is to develop a tool that simplifies long documents, articles, or texts. The tool should create short, easy-to-understand summaries. These summaries should include all the essential information without any extra details. The goal is to make complex content more accessible to non-technical readers.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).send(response.choices[0].message.content);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server error" });
  }
});

app.post("/translate", async (req, res) => {
    let { query,language } = req.body;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              `act as language translate expert, your task is convert the given input into ${language} without adding extra information.`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      res.status(200).send(response.choices[0].message.content);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server error" });
    }
  });

app.listen(4000, () => {
  try {
    console.log("server is running");
  } catch (error) {
    console.log(error);
  }
});
