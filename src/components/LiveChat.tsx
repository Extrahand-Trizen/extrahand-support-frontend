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
      <div className="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
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
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-2">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">Live Support</h3>
            <p className="text-xs opacity-90">
              {showHistory ? 'Chat History' :
               requestStatus === 'connected' ? 'Connected' : 
               requestStatus === 'waiting' ? 'Waiting for agent...' : 
               requestStatus === 'requesting' ? 'Requesting...' : 'Ready'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
            title={showHistory ? "Back to Chat" : "View History"}
          >
            {showHistory ? <MessageSquare className="h-5 w-5" /> : <History className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {showHistory ? (
        selectedHistoryTicket ? (
          // Show selected ticket messages
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Ticket Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <button
                onClick={() => {
                  setSelectedHistoryTicket(null);
                  setHistoryMessages([]);
                }}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Back to History</span>
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {selectedHistoryTicket.ticket_id}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    Agent: {selectedHistoryTicket.agent_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatToIST(selectedHistoryTicket.closed_at)}
                  </p>
                </div>
                {selectedHistoryTicket.rating && (
                  <div className="text-yellow-500 flex items-center">
                    {'⭐'.repeat(selectedHistoryTicket.rating)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {historyMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 
                    message.sender === 'system' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  {message.sender === 'system' ? (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {message.text}
                    </span>
                  ) : (
                    <div className={`flex items-start space-x-2 max-w-[80%]`}>
                      {message.sender === 'agent' && (
                        <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                          <Headphones className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                      
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1.5 px-1">
                          {formatTimeToIST(message.timestamp)}
                        </span>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="bg-purple-100 rounded-full p-2 flex-shrink-0 order-first ml-auto">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Show ticket list
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Previous Conversations</h3>
            {closedTickets.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">No Closed Tickets</p>
                <p className="text-xs text-gray-500">
                  Closed conversations will appear here after an agent closes your support ticket.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Start a conversation by clicking "Request Support Agent" below.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {closedTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    onClick={() => loadTicketMessages(ticket.ticket_id)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-purple-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {ticket.ticket_id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDateToIST(ticket.closed_at)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Agent: {ticket.agent_name || 'Unknown'}
                    </p>
                    {ticket.resolution_note && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {ticket.resolution_note}
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
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatToIST(ticket.closed_at)}
                      </span>
                      <span className="text-xs text-purple-600 font-medium">
                        View Chat →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : showIssueSelector ? (
        <IssueSelector 
          onSelect={handleIssueSelect}
          onBack={() => setShowIssueSelector(false)}
        />
      ) : requestStatus === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="bg-purple-100 p-6 rounded-full mb-6">
            <Headphones className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 text-center mb-8 max-w-sm">
            Connect with our support team to get instant help with your questions or issues.
          </p>
          <button
            onClick={initiateChat}
            disabled={!isLoggedIn}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggedIn ? 'Request Support Agent' : 'Login to Get Support'}
          </button>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Average response time: &lt; 2 minutes
          </p>
        </div>
      ) : (
        <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 
              message.sender === 'system' ? 'justify-center' : 'justify-start'
            }`}
          >
            {message.sender === 'system' ? (
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {message.text}
              </span>
            ) : (
              <div className={`flex items-start space-x-2 max-w-[80%]`}>
                {message.sender === 'agent' && (
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <Headphones className="h-4 w-4 text-purple-600" />
                  </div>
                )}
                
                <div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatTimeToIST(message.timestamp)}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
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
                  className={`h-9 w-9 ${
                    star <= feedbackRating
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
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={requestStatus === 'connected' ? "Type your message..." : "Waiting for agent..."}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
            disabled={requestStatus !== 'connected'}
          />
          <button
            type="submit"
            disabled={requestStatus !== 'connected' || !inputMessage.trim()}
            className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        </form>
      )}
        </>
      )}
    </div>
  );
}