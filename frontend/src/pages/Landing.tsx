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
    <div className="min-h-screen bg-solina-bg-light">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <LogoIcon size={36} />
              <span className="text-xl font-semibold tracking-wide text-gray-600">SOLINA AI</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-solina-purple transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-solina-purple transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-solina-purple transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                Your AI Companion for{' '}
                <span className="gradient-text">Emotional Wellness</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Meet Solina — a warm, empathetic AI that listens without judgment, 
                helps you track your emotions, and supports your mental wellness journey 
                24/7.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                  Start Free Today <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="btn-secondary">
                  Learn More
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-solina-purple" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-solina-coral" />
                  <span>Evidence-Based</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-solina-blue" />
                  <span>Multi-Language</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Chat Preview Card */}
              <div className="bg-white rounded-3xl shadow-large p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <LogoIcon size={48} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Solina</h3>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="chat-bubble-ai">
                    <p>Hello! 💜 I'm Solina, your emotional wellness companion. How are you feeling today?</p>
                  </div>
                  <div className="chat-bubble-user">
                    <p>I've been feeling a bit stressed lately...</p>
                  </div>
                  <div className="chat-bubble-ai">
                    <p>I hear you, and I want you to know that it's completely okay to feel stressed. Would you like to tell me more about what's been on your mind? 💜</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-solina-gold/20 rounded-full animate-float" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-solina-purple/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need for{' '}
              <span className="gradient-text">Emotional Wellness</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solina combines AI-powered conversations with proven wellness techniques
              to support your mental health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: '24/7 AI Companion',
                description: 'Talk to Solina anytime, anywhere. She\'s always here to listen without judgment and provide support.',
                color: 'bg-solina-purple/10 text-solina-purple'
              },
              {
                icon: BarChart3,
                title: 'Mood Tracking',
                description: 'Track your emotions daily and visualize your emotional patterns with beautiful insights.',
                color: 'bg-solina-gold/10 text-solina-gold'
              },
              {
                icon: Heart,
                title: 'Personalized Support',
                description: 'Solina remembers your conversations and provides personalized coping strategies.',
                color: 'bg-solina-coral/10 text-solina-coral'
              },
              {
                icon: Shield,
                title: '100% Private',
                description: 'Your conversations are encrypted and never shared. Your privacy is our top priority.',
                color: 'bg-solina-mint/10 text-solina-mint'
              },
              {
                icon: Star,
                title: 'Daily Check-ins',
                description: 'Build healthy habits with gentle daily check-ins and mood logging reminders.',
                color: 'bg-solina-blue/10 text-solina-blue'
              },
              {
                icon: Globe,
                title: 'Multi-Language',
                description: 'Communicate in your preferred language. Solina supports multiple languages.',
                color: 'bg-solina-purple-light/10 text-solina-purple'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Getting started with Solina is easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Account', description: 'Sign up in seconds with just your email' },
              { step: '2', title: 'Start Chatting', description: 'Open up to Solina about how you\'re feeling' },
              { step: '3', title: 'Track Progress', description: 'Watch your emotional wellness improve over time' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="card border-2 border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
              <p className="text-gray-500 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-gray-800 mb-6">
                $0<span className="text-lg text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['10 daily messages', 'Basic mood tracking', 'Weekly insights', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-solina-mint" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-secondary w-full text-center block">
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="card border-2 border-solina-purple bg-gradient-soft relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-primary text-white text-sm px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium</h3>
              <p className="text-gray-500 mb-6">For dedicated wellness journeys</p>
              <div className="text-4xl font-bold text-gray-800 mb-6">
                $9.99<span className="text-lg text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited messages', 'Advanced mood analytics', 'Daily insights', 'Journal feature', 'Priority support', 'Custom goals'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-solina-purple" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary w-full text-center block">
                Start Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of people who've found comfort and support with Solina.
          </p>
          <Link to="/register" className="bg-white text-solina-purple font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LogoIcon size={32} />
                <span className="text-xl font-bold">Solina AI</span>
              </div>
              <p className="text-gray-400">
                Your AI companion for emotional wellness.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Solina AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
