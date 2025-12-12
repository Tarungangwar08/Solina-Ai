import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  X,
  Save,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { goalsAPI } from '../services/api';
import { Goal, GoalCategory, StressLevel } from '../types';
import toast from 'react-hot-toast';

const categoryIcons: Record<GoalCategory, string> = {
  health: '🏃',
  work: '💼',
  personal: '🌟',
  relationships: '❤️',
  learning: '📚',
  finance: '💰',
  other: '🎯'
};

const stressColors: Record<StressLevel, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  extreme: 'bg-red-500'
};

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('personal');
  const [stressLevel, setStressLevel] = useState<StressLevel>('low');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await goalsAPI.getGoals();
      setGoals(res.data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (goal?: Goal) => {
    if (goal) {
      setSelectedGoal(goal);
      setTitle(goal.title);
      setDescription(goal.description || '');
      setCategory(goal.category);
      setStressLevel(goal.stressLevel);
      setDueDate(goal.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : '');
    } else {
      setSelectedGoal(null);
      setTitle('');
      setDescription('');
      setCategory('personal');
      setStressLevel('low');
      setDueDate('');
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setSelectedGoal(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    setSaving(true);
    try {
      const goalData = {
        title,
        description,
        category,
        stressLevel,
        dueDate: dueDate || undefined
      };

      if (selectedGoal) {
        await goalsAPI.updateGoal(selectedGoal._id, goalData);
        toast.success('Goal updated successfully');
      } else {
        await goalsAPI.createGoal(goalData);
        toast.success('Goal created successfully');
      }
      fetchGoals();
      closeEditor();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await goalsAPI.deleteGoal(id);
      setGoals(goals.filter(g => g._id !== id));
      toast.success('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleToggleComplete = async (goal: Goal) => {
    try {
      await goalsAPI.updateGoal(goal._id, { completed: !goal.completed });
      setGoals(goals.map(g => 
        g._id === goal._id ? { ...g, completed: !g.completed } : g
      ));
      toast.success(goal.completed ? 'Goal marked as active' : 'Goal completed! 🎉');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleUpdateProgress = async (goal: Goal, progress: number) => {
    try {
      await goalsAPI.updateGoal(goal._id, { progress });
      setGoals(goals.map(g => 
        g._id === goal._id ? { ...g, progress } : g
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const avgStress = activeGoals.length > 0 
    ? activeGoals.reduce((acc, g) => {
        const stressValues = { low: 1, medium: 2, high: 3, extreme: 4 };
        return acc + stressValues[g.stressLevel];
      }, 0) / activeGoals.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Goals & Stress Tracker</h1>
          <p className="text-gray-500">Manage your goals and monitor stress levels</p>
        </div>

        <button
          onClick={() => openEditor()}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Goals</span>
            <Target className="w-5 h-5 text-solina-purple" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{goals.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Active</span>
            <Circle className="w-5 h-5 text-solina-gold" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{activeGoals.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{completedGoals.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Avg Stress</span>
            <AlertTriangle className={`w-5 h-5 ${
              avgStress < 2 ? 'text-green-500' : avgStress < 3 ? 'text-yellow-500' : 'text-red-500'
            }`} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {avgStress.toFixed(1)}/4
          </p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-white text-solina-purple shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-solina-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
          </h3>
          <p className="text-gray-500 mb-6">
            Setting goals helps you stay focused and motivated
          </p>
          {filter === 'all' && (
            <button onClick={() => openEditor()} className="btn-primary">
              Create Your First Goal
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card ${goal.completed ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(goal)}
                  className={`mt-1 transition-colors ${
                    goal.completed ? 'text-green-500' : 'text-gray-300 hover:text-solina-purple'
                  }`}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{categoryIcons[goal.category]}</span>
                    <h3 className={`text-lg font-semibold ${
                      goal.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}>
                      {goal.title}
                    </h3>
                    <span className={`w-3 h-3 rounded-full ${stressColors[goal.stressLevel]}`} 
                          title={`${goal.stressLevel} stress`} />
                  </div>

                  {goal.description && (
                    <p className={`mb-3 ${goal.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  {!goal.completed && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-solina-purple">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          className="h-full bg-gradient-to-r from-solina-purple to-solina-gold rounded-full"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleUpdateProgress(goal, parseInt(e.target.value))}
                        className="w-full mt-2 accent-solina-purple"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg capitalize">
                      {goal.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg capitalize ${
                      goal.stressLevel === 'low' ? 'bg-green-100 text-green-700' :
                      goal.stressLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      goal.stressLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {goal.stressLevel} stress
                    </span>
                    {goal.dueDate && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditor(goal)}
                    className="p-2 text-gray-400 hover:text-solina-purple hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <TrendingUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeEditor}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedGoal ? 'Edit Goal' : 'New Goal'}
                  </h2>
                  <button
                    onClick={closeEditor}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you want to achieve?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50 resize-none"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(categoryIcons) as GoalCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          category === cat
                            ? 'bg-solina-purple text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-xl">{categoryIcons[cat]}</span>
                        <p className="text-xs mt-1 capitalize">{cat}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stress Level */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'extreme'] as StressLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setStressLevel(level)}
                        className={`p-3 rounded-xl text-center transition-all capitalize ${
                          stressLevel === level
                            ? level === 'low' ? 'bg-green-500 text-white' :
                              level === 'medium' ? 'bg-yellow-500 text-white' :
                              level === 'high' ? 'bg-orange-500 text-white' :
                              'bg-red-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={closeEditor}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Goal
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoalsPage;
