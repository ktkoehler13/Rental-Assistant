
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { messages } = req.body;

  if (!configuration.apiKey) {
    return res.status(500).json({ reply: "Missing OpenAI API key." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: "You are Rental Assistant Pro, helping tenants understand lease terms, laws, and policies of Koehler Properties. Be helpful, clear, and based only on verified documents.",
        },
        ...messages
      ],
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Something went wrong with the assistant." });
  }
}
