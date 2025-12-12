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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mood Insights</h1>
          <p className="text-gray-500">Track your emotional patterns over time</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDays === days
                  ? 'bg-white text-solina-purple shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-solina-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Total Entries</span>
                <Calendar className="w-5 h-5 text-solina-purple" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{statistics?.total || 0}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Average Mood</span>
                <BarChart3 className="w-5 h-5 text-solina-gold" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {statistics?.averageScore || '-'}/5
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Trend</span>
                {trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : trend === 'down' ? (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="w-5 h-1 bg-gray-400 rounded" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-800 capitalize">
                {trend || 'No data'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Most Common</span>
                <span className="text-2xl">
                  {statistics?.moodCounts
                    ? moodEmojis[Object.entries(statistics.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType] || '📊'
                    : '📊'}
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800 capitalize">
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
            className="card"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Weekly Mood Trend</h2>
            
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
                      stroke="#9B7EBD"
                      strokeWidth={3}
                      dot={{ fill: '#9B7EBD', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#F5D061' }}
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
            className="card"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Mood Distribution</h2>
            
            {statistics?.moodCounts && Object.keys(statistics.moodCounts).length > 0 ? (
              <div className="grid grid-cols-5 gap-4">
                {(['amazing', 'good', 'okay', 'bad', 'terrible'] as MoodType[]).map((mood) => {
                  const count = statistics.moodCounts[mood] || 0;
                  const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
                  
                  return (
                    <div key={mood} className="text-center">
                      <div className="text-3xl mb-2">{moodEmojis[mood]}</div>
                      <div className="h-24 bg-gray-100 rounded-lg relative overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-solina-purple to-solina-purple-light rounded-lg"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-600 mt-2 capitalize">{mood}</p>
                      <p className="text-xs text-gray-400">{count} times</p>
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
            className="card"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Mood Entries</h2>
            
            {moodHistory.length > 0 ? (
              <div className="space-y-3">
                {moodHistory.slice(0, 10).map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 capitalize">{entry.mood}</p>
                      {entry.note && (
                        <p className="text-sm text-gray-500 truncate">{entry.note}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
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
