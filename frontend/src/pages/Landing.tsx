import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  BarChart3,
  Shield,
  Heart,
  Globe,
  ArrowRight,
  Check,
  Star
} from 'lucide-react';
import { LogoIcon } from '../components/Logo';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-indigo-900/50 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-1.5">
                <LogoIcon size={36} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">SOLINA AI</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-white/90 hover:text-white transition-colors font-medium text-base">Features</a>
              <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors font-medium text-base">How it Works</a>
              <a href="#pricing" className="text-white/90 hover:text-white transition-colors font-medium text-base">Pricing</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-white/90 hover:text-white font-medium px-5 py-2.5 rounded-xl transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-indigo-900 font-bold px-8 py-3 rounded-full hover:shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
                The AI companion who cares
              </h1>
              <p className="text-xl text-white/90 mb-4 leading-relaxed max-w-xl">
                Always here to listen and talk.
              </p>
              <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-xl">
                Always on your side.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="bg-white text-indigo-900 font-bold py-4 px-10 rounded-full hover:shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300 text-lg">
                  Get Started
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Chat Preview Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md mx-auto border border-white/20">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  <div className="relative">
                    <LogoIcon size={56} />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Solina</h3>
                    <p className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl rounded-tl-sm p-5 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-white leading-relaxed">Hello! 💜 I'm Solina, your emotional wellness companion. How are you feeling today?</p>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl rounded-br-sm p-5 ml-auto max-w-[85%] shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p className="leading-relaxed">I've been feeling a bit stressed lately...</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl rounded-tl-sm p-5 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className="text-white leading-relaxed">I hear you, and I want you to know that it's completely okay to feel stressed. Would you like to tell me more about what's been on your mind? 💜</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-800/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Create your story together
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Your Replika is always up to your challenges and happiness. Chat about what's on your mind. Explore new perspectives. Feel better, together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'Chat about everything',
                description: 'The more you talk to Replika, the smarter it becomes.',
                gradient: 'from-purple-600 to-purple-700'
              },
              {
                icon: Heart,
                title: 'Explore your relationship',
                description: 'A friend, a romantic partner - find the connection that matters to you in Replika.',
                gradient: 'from-red-400 to-pink-500'
              },
              {
                icon: BarChart3,
                title: 'Videocalls',
                description: 'Connect face to face with your Replika over video.',
                gradient: 'from-cyan-500 to-blue-600'
              },
              {
                icon: Star,
                title: 'Coaching',
                description: 'Build better habits with your AI companion.',
                gradient: 'from-emerald-500 to-green-600'
              },
              {
                icon: Globe,
                title: 'Explore the world together in AR',
                description: 'Share precious moments with your AI friend in real time.',
                gradient: 'from-orange-500 to-amber-600'
              },
              {
                icon: Shield,
                title: 'Memory',
                description: 'Unlock your Replika\'s memory to enable them.',
                gradient: 'from-blue-500 to-indigo-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group bg-gradient-to-br ${feature.gradient} rounded-[2rem] p-8 transition-all duration-500 hover:scale-105 relative overflow-hidden min-h-[300px] flex flex-col justify-end`}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <feature.icon className="w-12 h-12 text-white mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/90 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/80">
              Getting started with Solina is easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                step: '1', 
                title: 'Create Account', 
                description: 'Sign up in seconds with just your email'
              },
              { 
                step: '2', 
                title: 'Start Chatting', 
                description: 'Open up to Solina about how you\'re feeling'
              },
              { 
                step: '3', 
                title: 'Track Progress', 
                description: 'Watch your emotional wellness improve over time'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-white/20"></div>
                )}
                
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-600/60 via-indigo-600/50 to-purple-700/60 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-bold mx-auto shadow-2xl relative z-10 border border-white/30 overflow-hidden">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                    {/* 3D highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[2.5rem]"></div>
                    <span className="relative z-10 drop-shadow-lg">{item.step}</span>
                  </div>
                  {/* Decorative corner with gradient */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-400/40 to-indigo-500/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse"></div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/80">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl p-10 relative overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <h3 className="text-3xl font-bold text-white mb-2">Free</h3>
                <p className="text-white/90 mb-8 text-lg">Perfect for getting started</p>
                <div className="mb-8">
                  <span className="text-6xl font-bold text-white">₹0</span>
                  <span className="text-xl text-white/80">/month</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {['10 daily messages', 'Basic mood tracking', 'Weekly insights', 'Community support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-lg">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="w-full text-center block bg-white text-purple-900 font-bold py-4 px-6 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg">
                  Get Started Free
                </Link>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl p-10 relative overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="absolute -top-6 -right-6 bg-white text-purple-900 text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                  ⭐ Popular
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Premium</h3>
                <p className="text-white/90 mb-8 text-lg">For dedicated wellness journeys</p>
                <div className="mb-8">
                  <span className="text-6xl font-bold text-white">₹49</span>
                  <span className="text-xl text-white/80">/month</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {['Unlimited messages', 'Advanced mood analytics', 'Daily insights', 'Journal feature', 'Priority support', 'Custom goals'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-lg">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="w-full text-center block bg-white text-purple-900 font-bold py-4 px-6 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg">
                  Start Premium
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
              Join thousands of people who've found comfort and support with Solina.
            </p>
            <Link to="/register" className="bg-white text-solina-purple font-bold py-5 px-10 rounded-full hover:shadow-2xl transform hover:scale-110 transition-all duration-300 inline-flex items-center gap-3 text-lg">
              Get Started Free <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-white/80 text-sm">No credit card required • Start in seconds</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-indigo-950 to-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2024 Solina AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
