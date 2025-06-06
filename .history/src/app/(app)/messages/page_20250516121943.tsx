"use client";
import React, { useState } from "react";

const messages = [
  {
    name: "Théo",
    text: "C’est trop grave mdrr",
    time: "3 min",
    color: "bg-yellow-200",
  },
  {
    name: "Jeanne",
    text: "3 nouveaux messages",
    time: "Jeu",
    color: "bg-blue-200",
  },
  {
    
  },
  {
    name: "Lucas",
    text: "Mercii pour la reco je l’adore....",
    time: "Mer",
    color: "bg-green-200",
  },
  { name: "Tiph", text: "Same bro same", time: "Mer", color: "bg-gray-200" },
  {
    name: "Agathe",
    text: "A liké votre message",
    time: "Dim",
    color: "bg-pink-200",
  },
  {
    name: "Serge",
    text: "2 nouveaux messages",
    time: "Dim",
    color: "bg-gray-300",
  },
];

const chatMessages = [
  { text: "Hello!", time: "9:24", sent: true },
  {
    text: "Thank you very much for your traveling, we really like the apartments. we will stay here for another 5 days...",
    time: "9:30",
    sent: true,
  },
  { text: "Hello!", time: "9:34", sent: false },
  { text: "I’m very glad you like it👍", time: "9:35", sent: false },
  {
    text: "We are arriving today at 01:45, will someone be at home?",
    time: "9:37",
    sent: false,
  },
  { text: "I will be at home", time: "9:39", sent: true },
];

const MessageList = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className=" mx-auto rounded-lg p-4">
      {selectedChat === null ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-center p-3 border-b last:border-b-0 cursor-pointer ${
              index === 0 ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelectedChat(msg.name)}
          >
            <div
              className={`w-10 h-10 rounded-full ${msg.color} flex items-center justify-center text-lg font-bold`}
            >
              🙂
            </div>
            <div className="ml-3 flex-1">
              <div className="font-bold">{msg.name}</div>
              <div className="text-gray-500 text-sm truncate">{msg.text}</div>
            </div>
            <div className="text-gray-400 text-xs">{msg.time}</div>
          </div>
        ))
      ) : (
        <div className="p-4">
          <button
            className="mb-4 text-blue-500"
            onClick={() => setSelectedChat(null)}
          >
            ← Retour
          </button>
          <h2 className="text-xl font-bold mb-4">{selectedChat}</h2>
          <div className="space-y-2">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sent ? "bg-green-100 ml-auto text-right" : "bg-gray-200"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
