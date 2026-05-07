import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  X,
  Save,
  Book
} from 'lucide-react';
import { journalAPI } from '../services/api';
import { JournalEntry, MoodType } from '../types';
import toast from 'react-hot-toast';

const moodEmojis: Record<MoodType, string> = {
  amazing: '🤩',
  good: '😊',
  okay: '😐',
  bad: '😔',
  terrible: '😢'
};

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('okay');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await journalAPI.getEntries();
      setEntries(res.data.entries || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (entry?: JournalEntry) => {
    if (entry) {
      setSelectedEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood || 'okay');
      setTags(entry.tags || []);
    } else {
      setSelectedEntry(null);
      setTitle('');
      setContent('');
      setMood('okay');
      setTags([]);
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setSelectedEntry(null);
    setTitle('');
    setContent('');
    setMood('okay');
    setTags([]);
    setTagInput('');
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setSaving(true);
    try {
      if (selectedEntry) {
        await journalAPI.updateEntry(selectedEntry._id, { title, content, mood, tags });
        toast.success('Entry updated successfully');
      } else {
        await journalAPI.createEntry({ title, content, mood, tags });
        toast.success('Entry created successfully');
      }
      fetchEntries();
      closeEditor();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await journalAPI.deleteEntry(id);
      setEntries(entries.filter(e => e._id !== id));
      toast.success('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Journal</h1>
          <p className="text-gray-500">Express your thoughts and feelings</p>
        </div>

        <button
          onClick={() => openEditor()}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50"
        />
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-solina-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery ? 'No entries found' : 'Start Your Journal'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try a different search term'
              : 'Writing helps you process emotions and gain clarity'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => openEditor()}
              className="btn-primary"
            >
              Write First Entry
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openEditor(entry)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{moodEmojis[entry.mood || 'okay']}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-3">{entry.content}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                    {entry.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-solina-purple/10 text-solina-purple text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(entry);
                    }}
                    className="p-2 text-gray-400 hover:text-solina-purple hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry._id);
                    }}
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
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedEntry ? 'Edit Entry' : 'New Journal Entry'}
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50"
                  />
                </div>

                {/* Mood */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling?
                  </label>
                  <div className="flex gap-2">
                    {(['amazing', 'good', 'okay', 'bad', 'terrible'] as MoodType[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`flex-1 py-3 rounded-xl text-2xl transition-all ${
                          mood === m
                            ? 'bg-solina-purple text-white ring-2 ring-solina-purple ring-offset-2'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {moodEmojis[m]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50 resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-solina-purple/10 text-solina-purple rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solina-purple/50"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Tag className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
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
                        Save Entry
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

export default JournalPage;
