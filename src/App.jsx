import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");  // User's current question
  const [messages, setMessages] = useState([]);  // Messages (user and bot)
  const messageEndRef = useRef(null);  // Reference to scroll to the latest message

  const generateAnswer = async () => {
    if (!question.trim()) return;

    // Append user message to the chat history
    const newMessages = [...messages, { sender: "user", message: question }];
    setMessages(newMessages);
    setQuestion("");

    try {
      const prompt = `You are a financial advisor. Answer the following question related to finance: ${question}`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCABU8vunTPHLeim-C_a_5-ZtTp3FXol6Q",
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );

      let botAnswer = response.data.candidates[0].content.parts[0].text;

      // Clean up the bot's answer (remove unwanted formatting like asterisks, excessive spaces, etc.)
      botAnswer = formatAnswer(botAnswer);

      // Append bot message to the chat history
      setMessages([...newMessages, { sender: "bot", message: botAnswer }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", message: "Error generating answer. Please try again." }]);
    }
  };

  // Function to clean up the bot's response
  const formatAnswer = (answer) => {
    // Remove any unwanted characters like asterisks, extra spaces, etc.
    return answer
      .replace(/\*+/g, '')  // Remove any asterisks
      .replace(/\s{2,}/g, ' ')  // Remove extra spaces (more than 1)
      .trim();  // Remove leading and trailing spaces
  };

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Trigger scrolling whenever the messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Enter key press for submitting text
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  };

  return (
    <div id="root">
      <h1>Finance Bot</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-bubble">{msg.message}</div>
          </div>
        ))}
        <div ref={messageEndRef}></div> {/* Scroll reference */}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}  // Handle Enter key
          placeholder="Ask a finance-related question..."
        />
        <button onClick={generateAnswer}>➤</button>
      </div>

      <footer>
        Developed by <strong>GOAT</strong>
      </footer>
    </div>
  );
}

export default App;
