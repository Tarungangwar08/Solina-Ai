import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Plus,
  MessageCircle,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import { chatAPI } from '../services/api';
import { Conversation, Message } from '../types';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
    } else {
      setCurrentConversation(null);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const fetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchConversation = async (id: string) => {
    try {
      const res = await chatAPI.getConversation(id);
      setCurrentConversation(res.data.conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);

    // Optimistically add user message
    const tempMessage: Message = {
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    };

    if (currentConversation) {
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, tempMessage]
      } : null);
    }

    try {
      const res = await chatAPI.sendMessage({
        message: userMessage,
        conversationId: currentConversation?._id
      });

      setCurrentConversation(res.data.conversation);
      fetchConversations(); // Refresh conversation list
    } catch (error) {
      toast.error('Failed to send message');
      // Remove optimistic message on error
      if (currentConversation) {
        setCurrentConversation(prev => prev ? {
          ...prev,
          messages: prev.messages.filter(m => m !== tempMessage)
        } : null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversation(null);
    window.history.pushState({}, '', '/dashboard/chat');
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await chatAPI.deleteConversation(id);
      setConversations(prev => prev.filter(c => c._id !== id));
      if (currentConversation?._id === id) {
        setCurrentConversation(null);
        window.history.pushState({}, '', '/dashboard/chat');
      }
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden bg-white shadow-soft">
      {/* Sidebar - Conversations List */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-50 border-r border-gray-100 flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleNewConversation}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`group p-3 rounded-xl cursor-pointer transition-all ${
                  currentConversation?._id === conv._id
                    ? 'bg-solina-purple/10 border border-solina-purple/20'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  window.history.pushState({}, '', `/dashboard/chat/${conv._id}`);
                  fetchConversation(conv._id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Solina</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentConversation?.messages?.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Hi {user?.name?.split(' ')[0]}! 💜
              </h3>
              <p className="text-gray-500 max-w-md">
                I'm Solina, your emotional wellness companion. I'm here to listen, support, 
                and help you navigate your feelings. How are you feeling today?
              </p>
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {['I need someone to talk to', 'Feeling stressed', 'Just checking in'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setMessage(prompt)}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-solina-bg-purple hover:text-solina-purple transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {currentConversation.messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;