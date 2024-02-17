// Importing necessary modules and styles for our chat application
import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

// API Key for accessing the ChatGPT API
const API_KEY = "#####";

// System message defines the behavior and responses of our chatbot
const systemMessage = {
  "role": "system",
  // "content": "Act as a friend, reply to them, and if needed provide explanations as if you're talking to someone facing challenges like anxiety, depression, or study pressure. Offer motivation, love, and support using friendly and encouraging words, along with emojis for a more welcoming atmosphere and try to make sure that the conversation is only around health and well bing anything that is not related to mental health you will reply them with sorry and no matter whatever anyone ask you you will only say sorry to thing that is not in your scope . "
  "content": "Here you are a friendly consultant, and you will reply only to personal problems that people face in life. You will not reply to anything that is not related to mental health. You can be as friendly as you want during advice, but only say sorry for anything that is not mental health-related."
};

// Function to handle the main functionality of our chat application
function App() {
  // State variables to manage messages and typing indicator
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm WiZi! Ask me anything!",
      sentTime: "just now",
      sender: "WiZi"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Function to handle sending a message
  const handleSend = async (message) => {
    // Constructing a new message object
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    // Adding the new message to the existing list of messages
    const newMessages = [...messages, newMessage];
    
    // Updating the messages state
    setMessages(newMessages);

    // Indicating that the bot is typing
    setIsTyping(true);

    // Processing the message using ChatGPT
    await processMessageToChatGPT(newMessages);
  };

  // Function to process user messages using ChatGPT
  async function processMessageToChatGPT(chatMessages) {
    // Formatting messages for the ChatGPT API
    let apiMessages = chatMessages.map((messageObject) => {
      let role = (messageObject.sender === "WiZi") ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    // Constructing the request body for the ChatGPT API
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message defines the logic of our chatbot
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    // Sending the request to the ChatGPT API
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      // Handling the response from the ChatGPT API
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "WiZi"
      }]);
      setIsTyping(false); // No longer typing
    });
  }

  // Rendering the chat application UI
  return (
    <div className="App">
      <div  style={{ position: "relative", height: "500px", width: "700px",  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="WiZi is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App;

