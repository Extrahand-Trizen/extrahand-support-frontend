'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, User, Headphones, Clock, MessageSquare } from 'lucide-react';

interface ChatSession {
  id: number;
  agent_name: string | null;
  status: 'pending' | 'active' | 'closed';
  created_at: string;
}

interface Message {
  id: string;
  content: string;
  sender_type: 'customer' | 'agent' | 'system';
  timestamp: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize: Check auth and fetch history
  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isOpen]);

  const initializeChat = async () => {
    setIsLoading(true);
    setNeedsLogin(false);
    try {
      // Check for existing auth token from main site
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setNeedsLogin(true);
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      
      // Register/Login with Chat Backend using real user data
      const response = await fetch('http://localhost:8000/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name || user.email.split('@')[0]
        })
      });
      
      const data = await response.json();
      setCustomerId(data.customer_id);
      
      // Fetch history
      const historyResponse = await fetch(`http://localhost:8000/api/customer/${data.customer_id}/sessions`);
      const historyData = await historyResponse.json();
      setSessions(historyData.sessions);

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // If error (e.g. backend down), maybe show error state
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    if (!customerId) return;
    
    // Connect to WS with customer ID, backend will create new session if needed
    // But wait, our backend creates session on connection if we pass customer_id
    // We need to handle "Start New" vs "Continue Old".
    // Our backend `get_or_create_active_session` returns an existing active/pending session
    // OR creates a new one.
    
    connectWebSocket();
    setView('chat');
  };

  const openSession = async (session: ChatSession) => {
    setCurrentSessionId(session.id);
    // Fetch messages for this session
    const response = await fetch(`http://localhost:8000/api/sessions/${session.id}/messages`);
    const data = await response.json();
    setMessages(data.messages);
    
    // If session is active or pending, connect WS
    if (session.status !== 'closed') {
      connectWebSocket();
    }
    
    setView('chat');
  };

  const connectWebSocket = () => {
    if (socket) socket.close();
    if (!customerId) {
      console.log('[LiveChat] Cannot connect: No customer ID');
      return;
    }

    console.log('[LiveChat] Connecting WebSocket for customer:', customerId);
    const ws = new WebSocket(`ws://localhost:8000/ws/customer/${customerId}`);

    ws.onopen = () => {
      console.log('[LiveChat] WebSocket connected successfully');
      setIsConnected(true);
    };
    
    ws.onerror = (error) => {
      console.error('[LiveChat] WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[LiveChat] Received message:', data);
      
      if (data.type === 'history') {
        console.log('[LiveChat] Received history with', data.messages?.length, 'messages');
        setMessages(data.messages);
        if (data.session_id) setCurrentSessionId(data.session_id);
      } else if (data.type === 'message') {
        console.log('[LiveChat] New message from', data.sender);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: data.content,
          sender_type: data.sender, // 'agent' or 'customer' or 'system'
          timestamp: data.timestamp
        }]);
      } else if (data.type === 'system') {
         console.log('[LiveChat] System message:', data.content);
         setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: data.content,
          sender_type: 'system',
          timestamp: new Date().toISOString()
        }]);
      } else if (data.type === 'session_closed') {
        console.log('[LiveChat] Session closed');
        const closeMessage = data.message || 'This chat has been resolved and closed.';
        const fullMessage = data.resolution_note 
          ? `${closeMessage}\n\nResolution: ${data.resolution_note}` 
          : closeMessage;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: fullMessage,
          sender_type: 'system',
          timestamp: new Date().toISOString()
        }]);
        
        setIsConnected(false);
        
        // Refresh session list after a delay
        setTimeout(() => {
          if (customerId) {
            fetch(`http://localhost:8000/api/customer/${customerId}/sessions`)
              .then(res => res.json())
              .then(data => setSessions(data.sessions))
              .catch(err => console.error('Failed to refresh sessions:', err));
          }
        }, 1000);
      }
    };

    ws.onclose = () => {
      console.log('[LiveChat] WebSocket disconnected');
      setIsConnected(false);
      setSocket(null);
    };

    setSocket(ws);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, view]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const messageText = inputMessage.trim();
    
    socket.send(JSON.stringify({ 
      type: 'message',
      content: messageText 
    }));

    // Optimistic update - show message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: messageText,
      sender_type: 'customer',
      timestamp: new Date().toISOString()
    }]);
    
    setInputMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          {view === 'chat' && (
            <button onClick={() => setView('list')} className="hover:bg-white/20 rounded-full p-1 mr-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
          )}
          <div className="bg-white/20 rounded-full p-2">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Live Support</h3>
            <p className="text-xs opacity-90 flex items-center">
              {isConnected ? (
                <><span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>Online</>
              ) : (
                <><span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>Offline</>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : needsLogin ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-sm text-gray-500 mb-6">
              Please sign in to your account to access live support and view your chat history.
            </p>
            <a 
              href="/login" 
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-md"
            >
              Sign In
            </a>
            <p className="mt-4 text-xs text-gray-400">
              Don't have an account? <a href="/signup" className="text-purple-600 hover:underline">Sign up</a>
            </p>
          </div>
        ) : view === 'list' ? (
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={startNewChat}
              className="w-full bg-purple-600 text-white rounded-xl p-4 mb-6 flex items-center justify-center space-x-2 hover:bg-purple-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Start New Conversation</span>
            </button>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Previous Chats</h4>
            <div className="space-y-3">
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => openSession(session)}
                  className="w-full bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      session.status === 'active' ? 'bg-green-100 text-green-700' :
                      session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2 group-hover:text-purple-600 transition-colors">
                    {session.agent_name ? `Chat with ${session.agent_name}` : 'Support Request'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: #{session.id}
                  </p>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No previous conversations</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    message.sender_type === 'customer' ? 'justify-end' : 
                    message.sender_type === 'system' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  {message.sender_type === 'system' ? (
                    <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                      {message.content}
                    </span>
                  ) : (
                    <div className={`flex items-end space-x-2 max-w-[85%] ${message.sender_type === 'customer' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender_type === 'customer' ? 'bg-gray-200' : 'bg-purple-100'
                      }`}>
                        {message.sender_type === 'customer' ? (
                          <User className="h-3 w-3 text-gray-600" />
                        ) : (
                          <Headphones className="h-3 w-3 text-purple-600" />
                        )}
                      </div>
                      
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 shadow-sm ${
                            message.sender_type === 'customer'
                              ? 'bg-purple-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className={`text-[10px] mt-1 px-1 ${message.sender_type === 'customer' ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isConnected ? "Type your message..." : "Connecting..."}
                  className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 rounded-xl transition-all"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!isConnected || !inputMessage.trim()}
                  className="bg-purple-600 text-white p-2.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
