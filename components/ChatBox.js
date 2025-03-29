
import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: Unable to get a response.' }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }}>
      <div style={{ height: 400, overflowY: 'auto', marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              backgroundColor: msg.role === 'user' ? '#d0e8ff' : '#eee',
              textAlign: msg.role === 'user' ? 'right' : 'left',
              padding: 10,
              borderRadius: 10,
              marginBottom: 5
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div style={{ fontStyle: 'italic', color: '#999' }}>Assistant is typing...</div>}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a lease question..."
          style={{ flex: 1, padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: '8px 12px' }}>
          Send
        </button>
      </div>
    </div>
  );
}
