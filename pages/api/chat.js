
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ reply: "Missing OpenAI API key." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Rental Assistant Pro, helping tenants understand lease terms, laws, and policies of Koehler Properties. Be helpful, clear, and based only on verified documents."
        },
        ...messages
      ],
      temperature: 0.7
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ reply: "Something went wrong with the assistant." });
  }
}
