import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    if (!question.trim()) return;
    setAnswer("loading...");
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCABU8vunTPHLeim-C_a_5-ZtTp3FXol6Q",
        { contents: [{ parts: [{ text: question }] }] }
      );
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setAnswer("Error generating answer. Please try again.");
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  }

  return (
    <>
      <h1>AI ChatBot</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter key
        cols="30"
        rows="10"
        placeholder="Type your question and press Enter..."
      ></textarea>
      <button onClick={generateAnswer}>Generate Answer</button>
      <pre>{answer}</pre>
      <footer className="footer">
        Developed by <strong>Priyanshu Pratik</strong> 💻
      </footer>
    </>
  );
}

export default App;
