"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeft, FiSend, FiPaperclip } from "react-icons/fi";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

interface User {
  id: string;
  username: string;
  email?: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  sender?: User;
  recipient?: User;
}

interface Conversation {
  user: User;
  messages: Message[];
  lastMessage: Message;
}

const MessagesPage: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupUsername, setPopupUsername] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupError, setPopupError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/session/check`, {
          withCredentials: true,
        });
        const user = res.data?.data;
        if (user?.id) {
          setCurrentUserId(user.id);
        } else {
          setError("Session invalide. Veuillez vous reconnecter.");
        }
      } catch (err) {
        console.error("Erreur récupération session:", err);
        setError("Erreur lors de la vérification de session.");
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ data: Message[] }>(
          `${API_BASE_URL}/messages/`,
          { withCredentials: true }
        );
        const convMap: Record<string, { user: User; messages: Message[] }> = {};
        response.data.data.forEach((msg) => {
          if (
            msg.senderId === currentUserId &&
            msg.recipientId === currentUserId
          )
            return;
          const partner =
            msg.senderId === currentUserId ? msg.recipient : msg.sender;
          if (!partner) return;
          if (!convMap[partner.id]) {
            convMap[partner.id] = { user: partner, messages: [] };
          }
          convMap[partner.id].messages.push(msg);
        });
        const convList: Conversation[] = Object.values(convMap).map((conv) => {
          const sorted = conv.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          return {
            user: conv.user,
            messages: sorted,
            lastMessage: sorted[sorted.length - 1],
          };
        });
        setConversations(convList);
      } catch (err) {
        console.error("Erreur chargement conversations:", err);
        setError("Erreur lors du chargement des conversations.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [currentUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;
    if (selectedConversation.user.id === currentUserId) return;
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      recipientId: selectedConversation.user.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };
    try {
      await axios.post(
        `${API_BASE_URL}/messages`,
        {
          recipientId: selectedConversation.user.id,
          content: newMessage,
        },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, tempMessage]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === selectedConversation.user.id
            ? {
                ...conv,
                messages: [...conv.messages, tempMessage],
                lastMessage: tempMessage,
              }
            : conv
        )
      );
      setNewMessage("");
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  const handlePopupSend = async () => {
    setPopupError("");
    if (!popupUsername.trim() || !popupMessage.trim()) {
      setPopupError("Tous les champs sont obligatoires.");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/search/users`, {
        params: { query: popupUsername, limit: 1 },
        withCredentials: true,
      });
      const user: User | undefined = Array.isArray(res.data?.data?.users)
        ? res.data.data.users[0]
        : undefined;
      if (!user) {
        setPopupError("Utilisateur introuvable.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/messages`,
        {
          recipientId: user.id,
          content: popupMessage,
        },
        { withCredentials: true }
      );
      const refreshedConv = await axios.get<{ data: Message[] }>(
        `${API_BASE_URL}/messages/`,
        {
          withCredentials: true,
        }
      );
      const updatedMessages = refreshedConv.data.data.filter(
        (msg) =>
          (msg.senderId === currentUserId && msg.recipientId === user.id) ||
          (msg.senderId === user.id && msg.recipientId === currentUserId)
      );
      setSelectedConversation({
        user,
        messages: updatedMessages,
        lastMessage: updatedMessages.length
          ? updatedMessages[updatedMessages.length - 1]
          : {
              id: "placeholder",
              senderId: currentUserId!,
              recipientId: user.id,
              content: popupMessage,
              createdAt: new Date().toISOString(),
            },
      });
      setMessages(updatedMessages);
      setConversations((prev) => {
        const existing = prev.find((c) => c.user.id === user.id);
        if (existing) return prev;
        return [
          ...prev,
          {
            user,
            messages: updatedMessages,
            lastMessage: updatedMessages[updatedMessages.length - 1],
          },
        ];
      });
      setShowPopup(false);
      setPopupUsername("");
      setPopupMessage("");
      setPopupError("");
    } catch (err) {
      console.error("Erreur envoi message via popup:", err);
      setPopupError("Erreur lors de l'envoi du message.");
    }
  };

  if (error)
    return <div className="pt-[100px] text-center text-red-500">{error}</div>;
  if (!currentUserId)
    return (
      <div className="pt-[100px] text-center">Chargement de la session...</div>
    );
  if (loading)
    return <div className="pt-[100px] text-center">Chargement...</div>;

  return (
    <div className="relative pt-[100px] px-4 pb-4 flex flex-col h-screen bg-white">
      {!selectedConversation && conversations.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.user.id}
              onClick={() => {
                setSelectedConversation(conv);
                setMessages(conv.messages || []);
              }}
              className="flex items-center justify-between py-3 border-b cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {conv.user.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold">{conv.user.username}</p>
                  <p className="text-gray-500 text-sm truncate max-w-[200px]">
                    {conv.lastMessage?.content || ""}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {conv.lastMessage?.createdAt &&
                  new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedConversation && (
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 py-3 mb-2">
            <button
              onClick={() => setSelectedConversation(null)}
              className="text-gray-700 text-2xl"
            >
              <FiArrowLeft />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {selectedConversation.user.username?.[0]?.toUpperCase() || "?"}
              </div>
              <h2 className="font-semibold text-lg">
                {selectedConversation.user.username}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                Aucun message dans cette conversation.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`relative max-w-[75%] p-2 rounded-xl text-sm ${
                    msg.senderId === currentUserId
                      ? "ml-auto bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="block text-xs text-gray-400 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.senderId === currentUserId && (
                    <button
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `${API_BASE_URL}/messages/${msg.id}`,
                            {
                              withCredentials: true,
                            }
                          );
                          setMessages((prev) =>
                            prev.filter((m) => m.id !== msg.id)
                          );
                        } catch (err) {
                          console.error("Erreur suppression message:", err);
                          alert("Impossible de supprimer le message.");
                        }
                      }}
                      className="absolute top-1 right-2 text-xs text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 pt-3 mt-2 border-t mb-[130px]">
            <button className="text-gray-400">
              <FiPaperclip size={18} />
            </button>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ton message"
              className="flex-1 px-3 py-2 rounded-full bg-gray-100 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="text-green-500 font-semibold"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-45 right-6 bg-primary text-white rounded-full p-4 shadow-lg text-xl z-50"
        title="Nouvelle conversation"
      >
        💬
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Nouvelle conversation
            </h2>
            <input
              type="text"
              value={popupUsername}
              onChange={(e) => setPopupUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 focus:outline-none"
            />
            <textarea
              value={popupMessage}
              onChange={(e) => setPopupMessage(e.target.value)}
              placeholder="Message"
              className="w-full mb-3 px-3 py-2 rounded border border-gray-300 focus:outline-none"
            />
            {popupError && (
              <div className="text-sm text-red-500 mb-2">{popupError}</div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={handlePopupSend}
                className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
