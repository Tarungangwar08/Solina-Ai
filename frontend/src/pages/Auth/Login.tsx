import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { LogoIcon } from '../../components/Logo';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! 💜');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const token = credentialResponse?.credential;
      if (!token) {
        toast.error('Google login failed');
        return;
      }
      if (googleLogin) {
        await googleLogin(token);
        toast.success('Signed in with Google 🎉');
        navigate('/dashboard');
      } else {
        // fallback: try to call login if it accepts token (not typical)
        toast.error('Google login is not configured');
      }
    } catch (err: any) {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-8">
      {/* Login Form */}
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

          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70 mb-8 text-lg">Sign in to continue your wellness journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full px-4 py-3.5 pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-300"
                  placeholder="Tarun Gangwar"
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
                  className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500" />
                <span className="ml-2 text-sm text-white/70">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-300 hover:text-purple-200">
                Forgot password?
              </a>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-full hover:shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
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
                  onError={() => toast.error('Google sign-in failed')}
                />
              </div>
            </div>
          </form>

          <p className="mt-8 text-center text-white/70">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-300 font-semibold hover:text-purple-200">
              Sign up for free
            </Link>
          </p>
        </motion.div>
    </div>
  );
};

export default LoginPage;