import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { LogoIcon } from '../../components/Logo';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      toast.success('Welcome to Solina! 💜');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const token = credentialResponse?.credential;
      if (!token) {
        toast.error('Google sign-up failed');
        return;
      }
      if (googleLogin) {
        await googleLogin(token);
        toast.success('Welcome to Solina! 🎉');
        navigate('/dashboard');
      } else {
        toast.error('Google sign-up is not configured');
      }
    } catch (err: any) {
      toast.error('Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-8">
      {/* Register Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-1.5">
              <LogoIcon size={36} />
            </div>
            <span className="text-2xl font-bold text-white">SOLINA AI</span>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70 mb-8 text-lg">Start your wellness journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none transition-all duration-300"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none transition-all duration-300"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none transition-all duration-300"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-sm text-white/70">
                I agree to the{' '}
                <a href="#" className="text-purple-300 hover:text-purple-200 underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-300 hover:text-purple-200 underline">Privacy Policy</a>
              </span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-full hover:shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60">or</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-white rounded-lg">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google sign-up failed')}
                />
              </div>
            </div>
          </form>

          <p className="mt-8 text-center text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-300 font-semibold hover:text-purple-200">
              Sign in
            </Link>
          </p>
        </motion.div>
    </div>
  );
};

export default RegisterPage;