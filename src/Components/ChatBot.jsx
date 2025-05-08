import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

/**
 * ChatBot component for Driving School Management System.
 * Uses OpenAI Chat Completions API.
 * Requires REACT_APP_OPENAI_API_KEY in environment variables.
 */
export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'system', content: "Hello! I'm your driving school assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [...messages, userMsg],
          temperature: 0.7
        })
      });
      const data = await response.json();
      const botMsg = data.choices?.[0]?.message || { role: 'system', content: 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('ChatBot error:', err);
      setMessages(prev => [...prev, { role: 'system', content: 'Error: Unable to communicate with the assistant.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">AI Driving Assistant</h3>
        <p className="text-sm text-gray-500">Ask questions about your driving lessons, progress, or account.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 p-3 rounded-lg text-sm ${
                msg.role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3/4 p-3 rounded-lg bg-gray-100 text-gray-900">
              Typing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-3 border-t border-gray-200 flex items-center">
        <textarea
          className="flex-1 resize-none border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          onClick={sendMessage}
          className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md px-4 py-2 focus:outline-none"
          disabled={loading}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
