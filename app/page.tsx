"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      const botMsg = {
        role: "assistant",
        content: data.reply || "No response",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🧠 DWA AI Chatbot
        </h1>

        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 text-sm max-w-xs ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <strong className="block mb-1"></strong>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-2 rounded-2xl text-sm text-gray-600 animate-pulse">
                Bot is typing...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-blue-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-blue-700 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
