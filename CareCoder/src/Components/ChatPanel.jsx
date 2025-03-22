import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const toggleChatPanel = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      // Add user message
      setMessages([...messages, { text: inputValue, type: 'user' }]);

      try {
        // Send user query to the Flask API
        const response = await axios.post('http://localhost:5000/api/chat', {
          query: inputValue
        });

        // Add Gemini response
        setMessages([...messages, { text: inputValue, type: 'user' }, { text: response.data.response, type: 'gemini' }]);
      } catch (error) {
        setMessages([...messages, { text: inputValue, type: 'user' }, { text: 'Sorry, something went wrong.', type: 'gemini' }]);
      }

      // Clear input field
      setInputValue('');
    }
  };

  return (
    <div>
      <button
        className={`fixed bottom-4 right-4 p-3 bg-[#23c483] text-white rounded-xl px-5 shadow-lg ${
          isOpen ? 'transform rotate-45' : ''
        } transition-transform duration-300`}
        onClick={toggleChatPanel}
      >
        <span className="text-xs">{isOpen ? 'Close Chat' : 'Chat With Us'}</span>
      </button>
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-80 h-80 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-300 flex"
          >
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="ml-2 bg-[#23c483] text-white p-2 rounded-lg hover:bg-[#1be996] transition-colors"
            >
              Send
            </button>
          </form>
          <button
            className="absolute top-2 right-2 p-2 bg-[#23c483] text-white rounded-full"
            onClick={toggleChatPanel}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatPanel;
