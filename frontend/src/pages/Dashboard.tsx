import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  TrendingUp,
  BookOpen,
  Target,
  Sparkles,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { moodAPI, chatAPI } from '../services/api';
import { MoodType, Conversation } from '../types';
import toast from 'react-hot-toast';

const moodEmojis: Record<MoodType, { emoji: string; label: string; color: string }> = {
  amazing: { emoji: '🤩', label: 'Amazing', color: 'bg-green-100' },
  good: { emoji: '😊', label: 'Good', color: 'bg-emerald-100' },
  okay: { emoji: '😐', label: 'Okay', color: 'bg-yellow-100' },
  bad: { emoji: '😔', label: 'Bad', color: 'bg-orange-100' },
  terrible: { emoji: '😢', label: 'Terrible', color: 'bg-red-100' }
};

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if mood already logged today
        const todayRes = await moodAPI.getTodayMood();
        if (todayRes.data.todayMood) {
          setTodayMoodLogged(true);
          setSelectedMood(todayRes.data.todayMood.mood);
        }

        // Get recent conversations
        const convRes = await chatAPI.getConversations();
        setRecentConversations(convRes.data.conversations?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      const moodScores: Record<MoodType, number> = {
        amazing: 5,
        good: 4,
        okay: 3,
        bad: 2,
        terrible: 1
      };

      await moodAPI.logMood({
        mood: selectedMood,
        moodScore: moodScores[selectedMood],
        note: moodNote
      });

      setTodayMoodLogged(true);
      toast.success('Mood logged! 💜');
    } catch (error) {
      toast.error('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: MessageCircle, label: 'Chat with Solina', to: '/dashboard/chat', color: 'bg-solina-purple' },
    { icon: TrendingUp, label: 'View Insights', to: '/dashboard/insights', color: 'bg-solina-gold' },
    { icon: BookOpen, label: 'Write Journal', to: '/dashboard/journal', color: 'bg-solina-blue' },
    { icon: Target, label: 'Track Goals', to: '/dashboard/goals', color: 'bg-solina-mint' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-primary rounded-3xl p-8 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-white/90">
          How are you feeling today? I'm here to support you.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mood Check Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Daily Mood Check</h2>
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {todayMoodLogged ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{selectedMood && moodEmojis[selectedMood]?.emoji}</div>
                <p className="text-gray-600">You're feeling <span className="font-medium text-solina-purple">{selectedMood}</span> today</p>
                <Link to="/dashboard/insights" className="text-solina-purple hover:underline text-sm mt-2 inline-block">
                  View your mood history →
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">How are you feeling right now?</p>
                <div className="flex justify-center gap-4 mb-6">
                  {(Object.entries(moodEmojis) as [MoodType, typeof moodEmojis[MoodType]][]).map(([mood, { emoji, label, color }]) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`mood-emoji ${color} ${selectedMood === mood ? 'mood-emoji-selected scale-110' : ''}`}
                      title={label}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <textarea
                      value={moodNote}
                      onChange={(e) => setMoodNote(e.target.value)}
                      placeholder="Add a note about how you're feeling (optional)"
                      className="input-field resize-none h-20"
                    />
                    <button
                      onClick={handleMoodSubmit}
                      disabled={loading}
                      className="btn-primary w-full"
                    >
                      {loading ? 'Saving...' : 'Log My Mood'}
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className="card hover:scale-105 text-center group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{action.label}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Chat CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gradient"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Talk to Solina</h3>
                <p className="text-sm text-gray-500">I'm here to listen 💜</p>
              </div>
            </div>
            <Link to="/dashboard/chat" className="btn-primary w-full text-center block">
              Start Conversation
            </Link>
          </motion.div>

          {/* Recent Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Recent Conversations</h3>
              <Link to="/dashboard/chat" className="text-solina-purple text-sm hover:underline">
                View all
              </Link>
            </div>

            {recentConversations.length > 0 ? (
              <div className="space-y-3">
                {recentConversations.map((conv) => (
                  <Link
                    key={conv._id}
                    to={`/dashboard/chat/${conv._id}`}
                    className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 truncate flex-1">
                        {conv.title}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-solina-purple" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No conversations yet. Start chatting with Solina!
              </p>
            )}
          </motion.div>

          {/* Wellness Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-solina-mint/10"
          >
            <h3 className="font-semibold text-gray-800 mb-2">💡 Wellness Tip</h3>
            <p className="text-sm text-gray-600">
              Take a few deep breaths right now. Inhale for 4 counts, hold for 4, exhale for 4. 
              This simple exercise can help reduce stress and bring clarity.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
