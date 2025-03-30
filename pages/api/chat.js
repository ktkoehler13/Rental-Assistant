// pages/api/chat.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // Validate and sanitize input
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Invalid message input." });
  }

  try {
    // Step 1: Create a thread
    const thread = await openai.beta.threads.create();

    // Step 2: Add user message to thread using proper structure
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: [{ type: "text", text: message.trim() }],
    });

    // Step 3: Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_5KR4b69UdfTUh0phUvvNeMpR",
    });

    // Step 4: Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Step 5: Fetch the assistant's reply
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find((m) => m.role === "assistant");

    res.status(200).json({
      reply: assistantMessage?.content?.[0]?.text?.value || "No response received.",
    });
  } catch (error) {
    console.error("Error communicating with Assistant:", error);
    res.status(500).json({ error: "Failed to get assistant response" });
  }
}
