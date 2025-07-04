import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Heart,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

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
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border-t border-blue-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Stay in the Loop</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get notified about the hottest events and exclusive early-bird discounts.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubscribing}
                required
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscriptionStatus === 'success' && (
              <p className="mt-3 text-green-600 text-sm">Thanks for subscribing! 🎉</p>
            )}
            {subscriptionStatus === 'error' && (
              <p className="mt-3 text-red-600 text-sm">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-gray-50/90 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      clipRule="evenodd" 
                      d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" 
                      fill="currentColor" 
                      fillRule="evenodd"
                      className="text-blue-600"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-600">Evently</h2>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md mb-4">
                Discover amazing events, connect with like-minded people, and create unforgettable memories. 
                Your gateway to the best experiences in your city and beyond.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>10,000+ Events</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>50K+ Users</span>
                </div>
              </div>
            </div>

            {/* Quick Links & Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 mb-6">
                <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Events</a></li>
                <li><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
              </ul>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-600/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 border border-blue-600/20"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-600/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 border border-blue-600/20"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-600/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 border border-blue-600/20"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">by the Evently Team</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
                <span>© 2024 Evently. All rights reserved.</span>
                <div className="flex gap-4">
                  <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                  <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
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