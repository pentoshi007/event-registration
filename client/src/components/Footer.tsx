import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Heart,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import logo from '../logo.png';

// Footer component provides the main footer with links and newsletter
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 3000);
    }
  };

  return (
    <>
      {/* Newsletter Signup - Above Footer */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 backdrop-blur-sm border-t border-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Stay in the Loop</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow-md text-lg">
              Get notified about the hottest events and exclusive early-bird discounts.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/95 text-gray-900 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 shadow-lg"
                disabled={isSubscribing}
                required
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-white hover:bg-blue-50 disabled:bg-gray-300 text-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscriptionStatus === 'success' && (
              <p className="mt-3 text-green-300 text-sm font-semibold drop-shadow-md">Thanks for subscribing! 🎉</p>
            )}
            {subscriptionStatus === 'error' && (
              <p className="mt-3 text-red-300 text-sm font-semibold drop-shadow-md">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 backdrop-blur-sm border-t border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white rounded-lg p-2 shadow-lg">
                  <img src={logo} alt="Eventinity Logo" className="object-contain" style={{ height: '66.49px', width: 'auto' }} />
                </div>
              </div>
              <p className="text-blue-100 leading-relaxed max-w-md mb-4 drop-shadow-md text-lg">
                Discover amazing events, connect with like-minded people, and create unforgettable memories. 
                Your gateway to the best experiences in your city and beyond.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Calendar className="h-4 w-4" />
                  <span className="text-white font-semibold">10,000+ Events</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Users className="h-4 w-4" />
                  <span className="text-white font-semibold">50K+ Users</span>
                </div>
              </div>
            </div>

            {/* Quick Links & Contact */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Quick Links</h3>
              <ul className="space-y-3 mb-6">
                <li><a href="/" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium">Browse Events</a></li>
                <li><a href="/about" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium">About Us</a></li>
                <li><a href="/contact" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium">Contact</a></li>
                <li><a href="/help" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium">Help Center</a></li>
              </ul>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 border border-white/30"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 border border-white/30"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 border border-white/30"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-600 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-blue-200">
                <span className="text-sm">Made with</span>
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-sm">by the Eventinity Team</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-blue-200">
                <span>© 2025 Eventinity. All rights reserved.</span>
                <div className="flex gap-4">
                  <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                  <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 