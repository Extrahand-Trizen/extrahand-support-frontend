'use client';

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import Chatbot from './Chatbot';
import LiveChat from './LiveChat';

export default function GlobalChat() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatbotSessionId, setChatbotSessionId] = useState('');

  useEffect(() => {
    // Generate or retrieve unique session ID for the AI chatbot
    let sid = localStorage.getItem('chatbot_session_id');
    if (!sid) {
      sid = 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('chatbot_session_id', sid);
    }
    setChatbotSessionId(sid);
  }, []);

  const handleOpenLiveChat = () => {
    setIsChatbotOpen(false);
    setIsLiveChatOpen(true);
  };

  return (
    <>
      {/* Chatbot Component */}
      {chatbotSessionId && (
        <Chatbot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
          sessionId={chatbotSessionId}
          onOpenLiveChat={handleOpenLiveChat}
        />
      )}

      {/* Live Chat Component */}
      <LiveChat
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
      />

      {/* Floating Chatbot Button */}
      {!isChatbotOpen && !isLiveChatOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-40 group"
          aria-label="Open chatbot"
        >
          <Bot className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            AI
          </span>
        </button>
      )}
    </>
  );
}
