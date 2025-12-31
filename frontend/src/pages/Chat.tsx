import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Plus,
  MessageCircle,
  Trash2,
  ChevronLeft,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { chatAPI } from '../services/api';
import { Conversation, Message } from '../types';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioCallActive, setAudioCallActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioCallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioCallActiveRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        if (audioCallActiveRef.current) {
          // In audio call mode, automatically send the message
          handleVoiceMessage(transcript);
        } else {
          // In manual mode, just set the message
          setMessage(transcript);
          setIsRecording(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        if (event.error === 'no-speech') {
          console.log('No speech detected, audioCallActive:', audioCallActiveRef.current);
          if (audioCallActiveRef.current) {
            // In audio call mode, restart listening after a brief pause
            setTimeout(() => {
              if (audioCallActiveRef.current) {
                console.log('Restarting listening after no-speech...');
                startListening();
              }
            }, 1000);
          } else {
            toast.error('No speech detected. Please try again.');
          }
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable it in your browser settings.');
          setAudioCallActive(false);
          audioCallActiveRef.current = false;
        } else if (event.error !== 'aborted') {
          console.log('Speech recognition error:', event.error);
          if (!audioCallActiveRef.current) {
            toast.error('Speech recognition failed. Please try again.');
          }
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended, audioCallActive:', audioCallActiveRef.current);
        setIsRecording(false);
        
        // In audio call mode, restart listening if not speaking
        if (audioCallActiveRef.current) {
          setTimeout(() => {
            if (audioCallActiveRef.current) {
              console.log('Restarting listening after recognition end...');
              startListening();
            }
          }, 500);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (audioCallTimeoutRef.current) {
        clearTimeout(audioCallTimeoutRef.current);
      }
    };
  }, []);

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
        conversationId: currentConversation?._id || conversationId
      });

      const newConversation = res.data.conversation;
      setCurrentConversation(newConversation);
      
      // Speak the AI response
      if (newConversation.messages && newConversation.messages.length > 0) {
        const lastMessage = newConversation.messages[newConversation.messages.length - 1];
        if (lastMessage.role === 'assistant') {
          speakText(lastMessage.content);
        }
      }
      
      // Update URL if this is a new conversation
      if (!currentConversation && newConversation._id) {
        navigate(`/dashboard/chat/${newConversation._id}`, { replace: true });
      }
      
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
      // Refocus the input field after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversation(null);
    navigate('/dashboard/chat');
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await chatAPI.deleteConversation(id);
      setConversations(prev => prev.filter(c => c._id !== id));
      if (currentConversation?._id === id) {
        setCurrentConversation(null);
        navigate('/dashboard/chat');
      }
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success('Listening... Speak now');
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Failed to start recording');
        setIsRecording(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) {
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    // Try to use a female voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Google UK English Female')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      console.log('Started speaking');
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log('Finished speaking, audioCallActive:', audioCallActiveRef.current);
      setIsSpeaking(false);
      
      // In audio call mode, start listening again after speaking
      if (audioCallActiveRef.current) {
        audioCallTimeoutRef.current = setTimeout(() => {
          if (audioCallActiveRef.current && !isRecording) {
            console.log('Starting to listen after speaking...');
            startListening();
          }
        }, 1000);
      }
    };
    utterance.onerror = () => {
      console.log('Speech synthesis error');
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return false;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      return true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      return false;
    }
  };

  const handleVoiceMessage = async (transcript: string) => {
    if (!transcript.trim() || loading) return;

    const userMessage = transcript.trim();
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
        conversationId: currentConversation?._id || conversationId
      });

      const newConversation = res.data.conversation;
      setCurrentConversation(newConversation);
      
      // Speak the AI response
      if (newConversation.messages && newConversation.messages.length > 0) {
        const lastMessage = newConversation.messages[newConversation.messages.length - 1];
        if (lastMessage.role === 'assistant') {
          speakText(lastMessage.content);
        }
      }
      
      // Update URL if this is a new conversation
      if (!currentConversation && newConversation._id) {
        navigate(`/dashboard/chat/${newConversation._id}`, { replace: true });
      }
      
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

  const startAudioCall = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    setAudioCallActive(true);
    audioCallActiveRef.current = true;
    console.log('Audio call started, audioCallActiveRef set to true');
    toast.success('Audio call started! Speak now...');
    
    // Start listening immediately
    setTimeout(() => {
      if (startListening()) {
        console.log('Successfully started listening');
      } else {
        setAudioCallActive(false);
        audioCallActiveRef.current = false;
        toast.error('Failed to start audio call');
      }
    }, 500);
  };

  const endAudioCall = () => {
    console.log('Ending audio call');
    setAudioCallActive(false);
    audioCallActiveRef.current = false;
    setIsRecording(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
    }
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    if (audioCallTimeoutRef.current) {
      clearTimeout(audioCallTimeoutRef.current);
    }
    
    setIsSpeaking(false);
    toast.success('Audio call ended');
  };

  const toggleAudioCall = () => {
    if (audioCallActive) {
      endAudioCall();
    } else {
      startAudioCall();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-indigo-800/50">
      {/* Sidebar - Conversations List */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-white/10">
          <button
            onClick={handleNewConversation}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-200 w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`group p-4 rounded-xl cursor-pointer transition-all ${
                  currentConversation?._id === conv._id
                    ? 'bg-white/10 border border-purple-400/30'
                    : 'bg-white/5 hover:bg-white/8 border border-transparent'
                }`}
                onClick={() => navigate(`/dashboard/chat/${conv._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg text-red-300 hover:text-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white/50 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Solina</h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                {audioCallActive ? (isRecording ? 'Listening...' : isSpeaking ? 'Speaking...' : 'On call') : 'Online'}
              </p>
            </div>
          </div>
          
          {/* Audio Call Button */}
          <button
            onClick={toggleAudioCall}
            className={`ml-auto px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              audioCallActive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 animate-pulse' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
            }`}
          >
            {audioCallActive ? (
              <>
                <MicOff className="w-5 h-5" />
                End Call
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Audio Call
              </>
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
              title="Stop speaking"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {!currentConversation?.messages?.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Hi {user?.name?.split(' ')[0]}! 💜
              </h3>
              <p className="text-white/80 max-w-md text-lg leading-relaxed mb-8">
                I'm Solina, your emotional wellness companion. I'm here to listen, support, 
                and help you navigate your feelings. How are you feeling today?
              </p>
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                {['I need someone to talk to', 'Feeling stressed', 'Just checking in'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setMessage(prompt)}
                    className="px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white hover:bg-white/15 hover:border-white/30 transition-all duration-200"
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
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={msg.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md px-5 py-3 max-w-[80%] shadow-lg' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl rounded-tl-md px-5 py-3 max-w-[80%] shadow-lg'}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl rounded-tl-md px-5 py-3 shadow-lg">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          {audioCallActive ? (
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex items-center gap-3 text-white">
                {isRecording ? (
                  <>
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold">Listening to you...</span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="w-6 h-6 animate-pulse" />
                    <span className="text-lg font-semibold">Solina is speaking...</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold">Audio call active</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggleRecording}
                disabled={loading}
                className={`${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                } text-white font-bold p-4 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100`}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Type your message..."}
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none transition-all duration-200 text-base"
                disabled={loading || isRecording}
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold p-4 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatPage;