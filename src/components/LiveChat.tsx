'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, Headphones, LogIn, History, MessageSquare, ArrowLeft, CheckCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import IssueSelector from './IssueSelector';
import { formatToIST, formatTimeToIST, formatDateToIST } from '../lib/dateUtils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
}

interface ClosedTicket {
  id: number;
  ticket_id: string;
  agent_name: string;
  created_at: string;
  closed_at: string;
  resolution_note: string;
  rating?: number;
  feedback?: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('Guest User');
  const [customerEmail, setCustomerEmail] = useState('guest@example.com');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'requesting' | 'waiting' | 'connected'>('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [showIssueSelector, setShowIssueSelector] = useState(false);
  const [selectedHistoryTicket, setSelectedHistoryTicket] = useState<any>(null);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [closedTickets, setClosedTickets] = useState<ClosedTicket[]>([]);
  const [issueCategory, setIssueCategory] = useState<string>('');
  const [issueType, setIssueType] = useState<string>('');
  const [issueCategoryLabel, setIssueCategoryLabel] = useState<string>('');
  const [issueTypeLabel, setIssueTypeLabel] = useState<string>('');
  const [isSessionClosed, setIsSessionClosed] = useState<boolean>(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [closedSessionId, setClosedSessionId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check authentication and initialize customer info
  useEffect(() => {
    if (!isOpen) return;

    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (userStr && accessToken) {
      try {
        const user = JSON.parse(userStr);
        setCustomerName(user.name || user.email?.split('@')[0] || 'User');
        setCustomerEmail(user.email || 'guest@example.com');
        setIsLoggedIn(true);

        // Check if user has an active or previous session
        checkExistingSession(user.email);
        // Load closed tickets history
        loadClosedTickets(user.email);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [isOpen]);

  // Load closed tickets for customer
  const loadClosedTickets = async (email: string) => {
    try {
      console.log(`[INFO] Loading closed tickets for ${email}`);
      const response = await fetch(`http://localhost:8001/api/customer/history/${email}`);
      const data = await response.json();
      console.log(`[INFO] Response:`, data);

      if (data.error) {
        console.error(`[ERROR] API error: ${data.error}`);
      }

      if (data.message) {
        console.log(`[INFO] API message: ${data.message}`);
      }

      console.log(`[INFO] Loaded ${data.sessions?.length || 0} closed tickets`);
      setClosedTickets(data.sessions || []);
    } catch (error) {
      console.error('Failed to load closed tickets:', error);
    }
  };

  // Check for existing chat sessions
  const checkExistingSession = async (email: string) => {
    try {
      console.log('🔍 Checking for existing session for:', email);
      const response = await fetch(`http://localhost:8001/api/customer/can-chat/${email}`);
      const data = await response.json();
      console.log('📋 Can chat response:', data);

      if (!data.can_chat && data.active_session_id) {
        // User has an active session, reconnect to it
        console.log('♻️ Reconnecting to existing session:', data.active_session_id);
        setSessionId(data.active_session_id);
        setRequestStatus('waiting');

        // Connect to existing session
        const wsUrl = `ws://localhost:8001/ws/customer/${data.active_session_id}`;
        console.log('🔌 Reconnecting WebSocket URL:', wsUrl);
        const ws = new WebSocket(wsUrl);
        setupWebSocket(ws);
        setSocket(ws);
      }
    } catch (error) {
      console.error('❌ Failed to check existing session:', error);
    }
  };

  // Load messages for a specific ticket
  const loadTicketMessages = async (ticketId: string) => {
    try {
      console.log(`[INFO] Loading messages for ticket ${ticketId}`);
      const response = await fetch(`http://localhost:8001/api/ticket/history/${ticketId}`);
      const data = await response.json();
      console.log(`[INFO] Received ticket data:`, data);

      if (data.messages) {
        const formattedMessages: Message[] = data.messages.map((msg: any) => {
          const senderField = msg.sender_type || msg.sender;
          return {
            id: `${msg.timestamp}-${Math.random()}`,
            text: msg.content,
            sender: senderField === 'customer' ? 'user' : senderField,
            timestamp: new Date(msg.timestamp)
          };
        });
        console.log(`[INFO] Formatted ${formattedMessages.length} messages`);
        setHistoryMessages(formattedMessages);
        setSelectedHistoryTicket(data);
      }
    } catch (error) {
      console.error('Failed to load ticket messages:', error);
    }
  };

  // Request agent connection with issue information
  const requestAgent = async () => {
    if (!isLoggedIn) {
      return;
    }

    setRequestStatus('requesting');

    // Create new session with issue information
    fetch('http://localhost:8001/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        customer_email: customerEmail,
        issue_category: issueCategory,
        issue_type: issueType,
        issue_category_label: issueCategoryLabel,
        issue_type_label: issueTypeLabel
      })
    })
      .then(res => res.json())
      .then(data => {
        const newSessionId = data.session_id;
        setSessionId(newSessionId);
        setRequestStatus('waiting');

        setMessages([{
          id: Date.now().toString(),
          text: `Issue: ${issueTypeLabel}\nRequest sent to support team. Waiting for an agent to join...`,
          sender: 'system',
          timestamp: new Date()
        }]);

        // Connect to WebSocket to listen for agent
        const ws = new WebSocket(`ws://localhost:8001/ws/customer/${newSessionId}`);
        setupWebSocket(ws);
        setSocket(ws);
      })
      .catch(err => {
        console.error('Failed to create session:', err);
        setMessages([{
          id: Date.now().toString(),
          text: 'Failed to connect to support. Please try again later.',
          sender: 'system',
          timestamp: new Date()
        }]);
        setRequestStatus('idle');
      });
  };

  // Handle issue selection
  const handleIssueSelect = (category: string, type: string, categoryLabel: string, typeLabel: string) => {
    setIssueCategory(category);
    setIssueType(type);
    setIssueCategoryLabel(categoryLabel);
    setIssueTypeLabel(typeLabel);
    setShowIssueSelector(false);

    // Request agent with the selected issue
    setRequestStatus('requesting');

    fetch('http://localhost:8001/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        customer_email: customerEmail,
        issue_category: category,
        issue_type: type,
        issue_category_label: categoryLabel,
        issue_type_label: typeLabel
      })
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Server error: ${error}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Session created:', data);
        const newSessionId = data.session_id;
        console.log('🔗 Connecting to WebSocket with session ID:', newSessionId);
        setSessionId(newSessionId);
        setRequestStatus('waiting');

        setMessages([{
          id: Date.now().toString(),
          text: `Issue: ${typeLabel}\nRequest sent to support team. Waiting for an agent to join...`,
          sender: 'system',
          timestamp: new Date()
        }]);

        // Connect to WebSocket to listen for agent
        const wsUrl = `ws://localhost:8001/ws/customer/${newSessionId}`;
        console.log('🔌 WebSocket URL:', wsUrl);
        const ws = new WebSocket(wsUrl);
        setupWebSocket(ws);
        setSocket(ws);
      })
      .catch(err => {
        console.error('❌ Failed to create session:', err);
        setMessages([{
          id: Date.now().toString(),
          text: `Failed to connect to support: ${err.message || 'Please check if the support server is running and try again.'}`,
          sender: 'system',
          timestamp: new Date()
        }]);
        setRequestStatus('idle');
      });
  };

  // Show issue selector before requesting agent
  const initiateChat = () => {
    if (!isLoggedIn) {
      return;
    }
    setShowIssueSelector(true);
  };

  // Setup WebSocket handlers
  const setupWebSocket = (ws: WebSocket) => {
    ws.onopen = () => {
      console.log('✅ WebSocket connected successfully');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 Received WebSocket message:', data);

      if (data.type === 'history') {
        // Handle chat history - load previous messages
        if (data.messages && data.messages.length > 0) {
          const historyMessages = data.messages.map((msg: any) => {
            // Normalize sender field: database uses sender_type, websocket uses sender
            const senderField = msg.sender_type || msg.sender;
            return {
              id: `${msg.timestamp}-${Math.random()}`,
              text: msg.content,
              sender: senderField === 'customer' ? 'user' : senderField,
              timestamp: new Date(msg.timestamp)
            };
          });
          // Replace messages with history (don't append, as this is the full history)
          setMessages(historyMessages);
          console.log(`[INFO] Loaded ${historyMessages.length} messages from history`);
        } else {
          // No history, start with empty messages
          setMessages([]);
        }

        // Check if session is already active (agent already joined)
        const session = data.session;
        if (session && session.status === 'active') {
          setRequestStatus('connected');
          setIsConnected(true);
          console.log('[INFO] Reconnected to active session');
        } else if (session && session.status === 'pending') {
          setRequestStatus('waiting');
          // Only add waiting message if there are no messages yet
          if (!data.messages || data.messages.length === 0) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: 'Waiting for an agent to join...',
              sender: 'system',
              timestamp: new Date()
            }]);
          }
        }
      } else if (data.type === 'agent_joined') {
        console.log('Agent joined the chat!');
        setRequestStatus('connected');
        setIsConnected(true);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.message || 'Agent has joined! You can now start chatting.',
          sender: 'system',
          timestamp: new Date()
        }]);
      } else if (data.type === 'message') {
        // Normalize sender field: database uses sender_type, websocket uses sender
        const senderField = data.sender_type || data.sender;
        console.log('Received message from:', senderField);
        // Handle messages from both agent and customer (with server timestamp)
        const sender = senderField === 'customer' ? 'user' : senderField;
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.content,
          sender: sender,
          timestamp: new Date(data.timestamp || Date.now())
        }]);
      } else if (data.type === 'session_closed') {
        console.log('[INFO] Session closed by agent');

        // Add closing message
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.message || 'This chat session has been closed by the agent.',
          sender: 'system',
          timestamp: new Date()
        }]);

        // Update states
        setIsConnected(false);
        setIsSessionClosed(true);

        // Store session ID for feedback before clearing it
        const currentSessionId = sessionId;
        if (currentSessionId) {
          setClosedSessionId(currentSessionId);
          console.log('[INFO] Stored session ID for feedback:', currentSessionId);
        }

        // Show feedback form immediately
        setShowFeedbackForm(true);
        setRequestStatus('idle');

        // Delay WebSocket cleanup to ensure message is delivered
        setTimeout(() => {
          console.log('[INFO] Cleaning up WebSocket connection');
          if (ws) {
            ws.close();
          }
          setSocket(null);
          setSessionId(null);
        }, 2000); // Increased to 2 seconds for better UX
      }
    };

    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
      // Only show connection lost message if we weren't expecting the close
      if (!isSessionClosed && requestStatus === 'waiting') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Connection lost. Please try again.',
          sender: 'system',
          timestamp: new Date()
        }]);
        setRequestStatus('idle');
      }
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('🔴 WebSocket error occurred:', error);
      console.error('WebSocket readyState:', ws.readyState);
      console.error('WebSocket URL:', ws.url);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Connection error. Please check if the support server is running and try again.',
        sender: 'system',
        timestamp: new Date()
      }]);
      setRequestStatus('idle');
    };
  };

  // Cleanup on close
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const messageText = inputMessage.trim();

    // Send to WebSocket with correct action format
    socket.send(JSON.stringify({
      action: 'send_message',
      content: messageText
    }));

    // Don't add to local state - wait for server echo with correct timestamp
    setInputMessage('');
  };

  // Submit feedback
  const submitFeedback = async () => {
    if (feedbackRating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!closedSessionId) {
      console.error('No session ID for feedback');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8001/api/sessions/${closedSessionId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: feedbackRating,
          feedback: feedbackText || null
        })
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setShowFeedbackForm(false);

        // Add thank you message
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Thank you for your feedback! You can start a new conversation by clicking "Request Agent" below.',
          sender: 'system',
          timestamp: new Date()
        }]);

        // Reload history to show updated feedback
        if (customerEmail) {
          loadClosedTickets(customerEmail);
        }
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (!isOpen) return null;

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="fixed bottom-4 right-4 w-[calc(100vw-32px)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
        <div className="w-full flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <Headphones className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Live Support</h3>
              <p className="text-xs opacity-90">Login Required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-b-2xl">
          <div className="bg-purple-100 p-6 rounded-full mb-6">
            <LogIn className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Login Required</h3>
          <p className="text-sm text-gray-600 text-center mb-8 max-w-sm">
            Please log in to your account to connect with our support team and get help.
          </p>
          <button
            onClick={() => {
              onClose();
              router.push('/login');
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[calc(100vw-32px)] sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="w-full flex-shrink-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

        <div className="flex items-center space-x-3 relative z-10 min-w-0 flex-shrink-0">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-2.5 flex-shrink-0 shadow-inner">
            <Headphones className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <h3 className="text-base font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis leading-tight">Live Support</h3>
            <div className="flex items-center space-x-1.5 mt-1">
              <div className="relative flex items-center justify-center">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-white/40'}`}></span>
                {isConnected && <span className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping opacity-40"></span>}
              </div>
              <p className="text-xs font-semibold text-white/95 uppercase tracking-wide truncate">
                {showHistory ? 'Chat History' :
                  requestStatus === 'connected' ? 'Connected' :
                    requestStatus === 'waiting' ? 'In Queue' :
                      requestStatus === 'requesting' ? 'Connecting...' : 'Online'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all duration-200"
            title={showHistory ? "Back to Chat" : "Chat History"}
          >
            {showHistory ? <MessageSquare className="h-5 w-5" /> : <History className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-red-500/80 hover:scale-105 active:scale-95 rounded-xl transition-all duration-200"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {showHistory ? (
        selectedHistoryTicket ? (
          // Show selected ticket messages
          <div className="flex-1 flex flex-col bg-white">
            {/* Ticket Header */}
            <div className="p-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 shadow-sm">
              <button
                onClick={() => {
                  setSelectedHistoryTicket(null);
                  setHistoryMessages([]);
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 group transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Back to History</span>
              </button>

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                      #{selectedHistoryTicket.ticket_id}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDateToIST(selectedHistoryTicket.closed_at)}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mt-2">
                    Interaction with {selectedHistoryTicket.agent_name || 'Support Agent'}
                  </h4>
                </div>
                {selectedHistoryTicket.rating && (
                  <div className="flex flex-col items-end">
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= selectedHistoryTicket.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
              {historyMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' :
                    message.sender === 'system' ? 'justify-center' : 'justify-start'
                    } group`}
                >
                  {message.sender === 'system' ? (
                    <div className="flex flex-col items-center max-w-[90%]">
                      <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm uppercase tracking-tighter">
                        {message.text}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'space-x-2'} max-w-[85%]`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${message.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600'
                        : 'bg-white border border-gray-100'
                        }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Headphones className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>

                      <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-300 ${message.sender === 'user'
                            ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 mt-1.5 px-1 uppercase tracking-wider">
                          {formatTimeToIST(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Show ticket list
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">History</h3>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                {closedTickets.length} Session{closedTickets.length !== 1 ? 's' : ''}
              </span>
            </div>

            {closedTickets.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                  <History className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">No past conversations</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  When you complete a support session, it will appear here for your reference.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {closedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => loadTicketMessages(ticket.ticket_id)}
                    className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer hover:border-indigo-200 relative overflow-hidden"
                  >
                    {/* Hover indicator */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded uppercase tracking-tighter">
                        #{ticket.ticket_id}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {formatDateToIST(ticket.closed_at)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        <Headphones className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {ticket.agent_name || 'Support Agent'}
                        </p>
                        <p className="text-[10px] text-gray-500">Service interaction completed</p>
                      </div>
                    </div>

                    {ticket.resolution_note && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-4 line-clamp-2 border border-gray-100 italic">
                        "{ticket.resolution_note}"
                      </p>
                    )}
                    {ticket.rating && (
                      <div className="mb-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = ticket.rating ?? 0;
                            return (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            );
                          })}
                          <span className="text-xs text-gray-600 ml-1">({ticket.rating ?? 0}/5)</span>
                        </div>
                        {ticket.feedback && (
                          <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">
                            "{ticket.feedback}"
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                        Full Transcript <ChevronRight className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : showIssueSelector ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <IssueSelector
            onSelect={handleIssueSelect}
            onBack={() => setShowIssueSelector(false)}
          />
        </div>
      ) : requestStatus === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/30 animate-fadeIn">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/10 border border-gray-50">
              <Headphones className="h-16 w-16 text-indigo-600 animate-bounce-short" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
            </div>
          </div>

          <div className="text-center max-w-xs mb-10">
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Need Support?</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Experience the fastest support. Our average response time is currently <span className="text-indigo-600 font-bold">under 2 mins</span>.
            </p>
          </div>

          <button
            onClick={initiateChat}
            disabled={!isLoggedIn}
            className="group relative w-full overflow-hidden"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-3 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale">
              <span>{isLoggedIn ? 'Launch Live Session' : 'Login to Continue'}</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="flex items-center space-x-4 mt-8 opacity-40">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-gray-${100 + i * 100}`}></div>
              ))}
            </div>
            {/* <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              
            </span> */}
          </div>
        </div>
      ) : (requestStatus === 'requesting' || requestStatus === 'waiting') && messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white space-y-8 animate-fadeIn">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-gray-50 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-indigo-600 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Connecting to Secure Server</h3>
            <p className="text-sm text-gray-500 font-medium max-w-[240px] mx-auto">
              Please stay on this screen. We're matching you with the best available agent.
            </p>
          </div>

          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50 scroll-smooth">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' :
                  message.sender === 'system' ? 'justify-center' : 'justify-start'
                  } animate-slideUp`}
              >
                {message.sender === 'system' ? (
                  <div className="flex flex-col items-center max-w-[90%]">
                    <span className="text-[10px] font-bold text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-100 px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                      {message.text}
                    </span>
                  </div>
                ) : (
                  <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'space-x-2'} max-w-[85%]`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform hover:scale-110 ${message.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-blue-600'
                      : 'bg-white border border-gray-100'
                      }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Headphones className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>

                    <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md transition-all duration-300 ${message.sender === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 mt-2 px-1 uppercase tracking-widest opacity-70">
                        {formatTimeToIST(message.timestamp)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Feedback Form */}
          {showFeedbackForm && !feedbackSubmitted && (
            <div className="px-4 py-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-t-2 border-purple-300">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-3">
                  <Star className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">How was your experience?</h3>
                <p className="text-xs text-gray-600">Your feedback helps us improve our service</p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="transition-all transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`h-9 w-9 ${star <= feedbackRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-gray-400'
                        }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              {feedbackRating > 0 && (
                <p className="text-center text-sm font-medium text-purple-600 mb-3">
                  {feedbackRating === 5 ? '⭐ Excellent!' :
                    feedbackRating === 4 ? '😊 Good!' :
                      feedbackRating === 3 ? '👍 Okay' :
                        feedbackRating === 2 ? '😐 Could be better' : '😞 Needs improvement'}
                </p>
              )}

              {/* Feedback Text */}
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us more about your experience (optional)..."
                className="w-full p-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mb-3"
                rows={3}
              />

              {/* Submit Button */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setFeedbackSubmitted(true);
                    setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      text: 'You can start a new conversation by clicking "Request Agent" below.',
                      sender: 'system',
                      timestamp: new Date()
                    }]);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-all text-sm"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={feedbackRating === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-2"
                >
                  <span>Submit Feedback</span>
                  {feedbackRating > 0 && <CheckCircle className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Closed Conversation Notice */}
          {isSessionClosed && !showFeedbackForm && (
            <div className="px-4 py-5 bg-gradient-to-br from-gray-50 to-gray-100 border-t-2 border-gray-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {feedbackSubmitted ? 'Thank you for your feedback!' : 'Conversation Closed'}
                </h3>
                <p className="text-sm text-gray-600 mb-5 max-w-xs mx-auto">
                  {feedbackSubmitted
                    ? 'Your feedback helps us provide better support. Feel free to start a new conversation anytime.'
                    : 'This conversation has been marked as closed. Need more help?'}
                </p>
                <button
                  onClick={() => {
                    setIsSessionClosed(false);
                    setFeedbackSubmitted(false);
                    setShowFeedbackForm(false);
                    setFeedbackRating(0);
                    setFeedbackText('');
                    setMessages([]);
                    setSessionId(null);
                    setClosedSessionId(null);
                    setRequestStatus('idle');
                    setShowIssueSelector(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-[1.02]"
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          {!isSessionClosed && (
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={sendMessage}
                className="relative group transition-all duration-300"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500 ${requestStatus !== 'connected' ? 'hidden' : ''}`}></div>
                <div className="relative flex items-center space-x-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 group-focus-within:border-indigo-200 group-focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={requestStatus === 'connected' ? "Message our team..." : "Wait for an agent..."}
                    className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-900 focus:outline-none disabled:cursor-not-allowed"
                    disabled={requestStatus !== 'connected'}
                  />
                  <button
                    type="submit"
                    disabled={requestStatus !== 'connected' || !inputMessage.trim()}
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all"
                  >
                    <Send className={`h-4.5 w-4.5 ${inputMessage.trim() ? 'animate-bounce-short' : ''}`} />
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-center space-x-2 mt-3">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center">
                  <ShieldCheck className="h-3 w-3 mr-1 text-green-400" />
                  Secure & Private
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}