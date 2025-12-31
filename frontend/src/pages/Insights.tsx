import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { moodAPI } from '../services/api';
import { MoodStatistics, MoodType, EmotionLog } from '../types';

const moodEmojis: Record<MoodType, string> = {
  amazing: '🤩',
  good: '😊',
  okay: '😐',
  bad: '😔',
  terrible: '😢'
};

const InsightsPage: React.FC = () => {
  const [moodHistory, setMoodHistory] = useState<EmotionLog[]>([]);
  const [statistics, setStatistics] = useState<MoodStatistics | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, [selectedDays]);

  const fetchMoodData = async () => {
    setLoading(true);
    try {
      const res = await moodAPI.getMoodHistory(selectedDays);
      setMoodHistory(res.data.moodHistory || []);
      setStatistics(res.data.statistics || null);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodTrend = () => {
    if (!statistics?.weeklyData || statistics.weeklyData.length < 2) return null;
    
    const recent = statistics.weeklyData.slice(-3);
    const earlier = statistics.weeklyData.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b.score, 0) / earlier.length;
    
    return recentAvg > earlierAvg ? 'up' : recentAvg < earlierAvg ? 'down' : 'stable';
  };

  const trend = getMoodTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Mood Insights
          </h1>
          <p className="text-gray-600 mt-1">Track your emotional patterns over time</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-1.5">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedDays === days
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Total Entries</span>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{statistics?.total || 0}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Average Mood</span>
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">
                {statistics?.averageScore ? statistics.averageScore.toFixed(1) : '-'}/5
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Trend</span>
                {trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : trend === 'down' ? (
                  <TrendingDown className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-5 h-1 bg-white/50 rounded" />
                )}
              </div>
              <p className="text-2xl font-bold text-white capitalize">
                {trend || 'No data'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Most Common</span>
                <span className="text-3xl">
                  {statistics?.moodCounts
                    ? moodEmojis[Object.entries(statistics.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType] || '📊'
                    : '📊'}
                </span>
              </div>
              <p className="text-xl font-bold text-white capitalize">
                {statistics?.moodCounts
                  ? Object.entries(statistics.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
                  : '-'}
              </p>
            </motion.div>
          </div>

          {/* Weekly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Weekly Mood Trend</h2>
            
            {statistics?.weeklyData && statistics.weeklyData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statistics.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#9333ea"
                      strokeWidth={3}
                      dot={{ fill: '#9333ea', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, fill: '#c026d3', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">
                <p>No mood data available for the selected period</p>
              </div>
            )}
          </motion.div>

          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mood Distribution</h2>
            
            {statistics?.moodCounts && Object.keys(statistics.moodCounts).length > 0 ? (
              <div className="grid grid-cols-5 gap-4">
                {(['amazing', 'good', 'okay', 'bad', 'terrible'] as MoodType[]).map((mood) => {
                  const count = statistics.moodCounts[mood] || 0;
                  const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
                  
                  return (
                    <div key={mood} className="text-center">
                      <div className="text-4xl mb-3">{moodEmojis[mood]}</div>
                      <div className="h-32 bg-gradient-to-b from-purple-100 to-indigo-100 rounded-xl relative overflow-hidden border border-purple-200">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-xl"
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mt-3 capitalize">{mood}</p>
                      <p className="text-xs text-gray-500">{count} times ({percentage.toFixed(0)}%)</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No mood data available</p>
              </div>
            )}
          </motion.div>

          {/* Recent Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Mood Entries</h2>
            
            {moodHistory.length > 0 ? (
              <div className="space-y-2">
                {moodHistory.slice(0, 10).map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-all"
                  >
                    <span className="text-3xl">{moodEmojis[entry.mood]}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 capitalize">{entry.mood}</p>
                      {entry.note && (
                        <p className="text-sm text-gray-600 truncate">{entry.note}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No mood entries yet. Start tracking your mood!</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default InsightsPage;
