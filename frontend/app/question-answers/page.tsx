'use client'

import React, { useState } from "react";

export default async function Page() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    const res = await fetch("/api/qa/ask", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <div>
      <textarea
        placeholder="Ask anything about the video..."
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      <div><strong>Answer:</strong> {answer}</div>
    </div>
  );
}
