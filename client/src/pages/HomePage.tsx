import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, Users, MapPin, Star, ChevronDown } from 'lucide-react';
import EventCard from '../components/EventCard';
import type { Event } from '../types';
import { api, PaginationResponse } from '../api';
import Modal from '../components/Modal';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);

  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  // Responsive pagination sizes - Safe window access
  const getInitialLimit = () => {
    if (typeof window === 'undefined') return 7; // Default for SSR
    return window.innerWidth >= 768 ? 7 : 4; // Desktop: 7 (1+6), Mobile: 4 (1+3)
  };

  const getLoadMoreLimit = () => {
    return 3; // Always load 3 more
  };

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatches
    setIsClient(true);
    loadInitialEvents();
  }, []);

  useEffect(() => {
    // Setup animations only after content is loaded and client is ready
    if (isClient && !loading && events.length > 0 && !animationsReady) {
      const timer = setTimeout(() => {
        setAnimationsReady(true);
        triggerScrollAnimations();
      }, 100); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [isClient, loading, events.length, animationsReady]);

  useEffect(() => {
    // Reload events when search or category changes
    if (isClient) {
      setAnimationsReady(false); // Reset animations for new content
      loadInitialEvents();
    }
  }, [searchTerm, selectedCategory, isClient]);

  const triggerScrollAnimations = () => {
    if (typeof window === 'undefined') return;

    // Use intersection observer if available, otherwise trigger immediately
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      // Observe all animation elements
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
      });

      // Cleanup function
      return () => observer.disconnect();
    } else {
      // Fallback: trigger all animations immediately
      document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-fade-in-up');
        }, index * 100);
      });
    }
  };

  const loadInitialEvents = async () => {
    try {
      setLoading(true);
      const initialLimit = getInitialLimit();
      
      const params: {
        limit: number;
        offset: number;
        category?: string;
        search?: string;
      } = {
        limit: initialLimit,
        offset: 0,
      };

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response: PaginationResponse<Event> = await api.getEvents(params);
      setEvents(response.events || []);
      setHasMore(response.pagination.hasMore);
      setNextOffset(response.pagination.nextOffset);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Use fallback mock data
      const mockEvents = [
        {
          _id: '1',
          title: 'Tech Innovation Summit 2024',
          description: 'Join industry leaders and innovators for a day of cutting-edge technology discussions, networking, and hands-on workshops. Discover the latest trends in AI, blockchain, and sustainable tech.',
          date: '2024-03-15',
          time: '09:00',
          location: 'San Francisco Convention Center',
          maxAttendees: 500,
          currentAttendees: 342,
          price: 299,
          image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Technology',
          organizer: 'TechVision Inc.',
          tags: ['AI', 'Innovation', 'Networking', 'Workshop']
        }
        // Add other mock events as needed
      ];
      setEvents(mockEvents);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreEvents = async () => {
    if (!hasMore || nextOffset === null || loadingMore) return;

    try {
      setLoadingMore(true);
      const loadMoreLimit = getLoadMoreLimit();
      
      const params: {
        limit: number;
        offset: number;
        category?: string;
        search?: string;
      } = {
        limit: loadMoreLimit,
        offset: nextOffset,
      };

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response: PaginationResponse<Event> = await api.getEvents(params);
      const newEvents = response.events || [];
      
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      setHasMore(response.pagination.hasMore);
      setNextOffset(response.pagination.nextOffset);

      // Trigger animations for new events
      setTimeout(() => {
        const newEventCards = document.querySelectorAll('.event-card:not(.animate-fade-in-up)');
        newEventCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate-fade-in-up');
          }, index * 100);
        });
      }, 100);
    } catch (error) {
      console.error('Failed to load more events:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const categories = ['All', 'Technology', 'Business', 'Marketing', 'Design'];

  const handleRegister = (eventId: string) => {
    const event = events.find(e => e._id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowRegisterModal(true);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsRegistering(true);
    setRegistrationMessage(null);

    try {
      const response = await api.createRegistration({
        eventId: selectedEvent._id,
        attendeeName: registrationForm.name,
        attendeeEmail: registrationForm.email,
        attendeePhone: registrationForm.phone,
        ticketType: 'Standard'
      });

      if (response.success) {
        // Update local events state to reflect the new registration
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === selectedEvent._id
              ? { ...event, currentAttendees: event.currentAttendees + 1 }
              : event
          )
        );

        setRegistrationMessage({
          type: 'success',
          text: 'Registration successful! You will receive a confirmation email shortly.'
        });

        // Reset form and close modal after a delay
        setTimeout(() => {
          setShowRegisterModal(false);
          setRegistrationForm({ name: '', email: '', phone: '' });
          setSelectedEvent(null);
          setRegistrationMessage(null);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegistrationMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const featuredEvent = events[0]; // First event as featured

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Blur overlay when modal is open */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-all duration-300"></div>
      )}
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div ref={heroRef} className="pt-20 pb-12 text-center animate-on-scroll">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Discover Amazing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Events</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
              Join thousands of professionals and enthusiasts in transformative events that inspire, educate, and connect.
            </p>
            
            {/* Search and Filter */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6 mb-8 animate-on-scroll">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/80 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[150px]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-on-scroll">
              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">10,000+</div>
                <div className="text-gray-600">Events Hosted</div>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Happy Attendees</div>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <div className="max-w-7xl mx-auto px-4 mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Event</h2>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-2/5 h-64 lg:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${featuredEvent.image})` }}>
                  <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="flex-1 p-6 lg:p-8 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-2">{featuredEvent.title}</h3>
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {featuredEvent.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">${featuredEvent.price}</div>
                    </div>
                  </div>
                  
                  <p className="text-blue-100 mb-6 leading-relaxed">{featuredEvent.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-blue-100">
                      <Calendar className="h-5 w-5 mr-3" />
                      <span>{featuredEvent.date} at {featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center text-blue-100">
                      <MapPin className="h-5 w-5 mr-3" />
                      <span>{featuredEvent.location}</span>
                    </div>
                    <div className="flex items-center text-blue-100">
                      <Users className="h-5 w-5 mr-3" />
                      <span>{featuredEvent.currentAttendees} / {featuredEvent.maxAttendees} attendees</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-blue-100 mb-2">
                      <span>Registration Progress</span>
                      <span>{Math.round((featuredEvent.currentAttendees / featuredEvent.maxAttendees) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(featuredEvent.currentAttendees / featuredEvent.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(featuredEvent._id)}
                    disabled={featuredEvent.currentAttendees >= featuredEvent.maxAttendees}
                    className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-colors ${
                      featuredEvent.currentAttendees >= featuredEvent.maxAttendees
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {featuredEvent.currentAttendees >= featuredEvent.maxAttendees ? 'Sold Out' : 'Register Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div ref={eventsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-on-scroll">Upcoming Events</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {events.slice(1).map((event, index) => (
                  <div
                    key={event._id}
                    className={`event-card animate-on-scroll transition-all duration-300`}
                    style={{
                      animationDelay: `${(index % 6) * 100}ms`
                    }}
                  >
                    <EventCard
                      event={event}
                      onRegister={() => handleRegister(event._id)}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center animate-on-scroll">
                  <button
                    onClick={loadMoreEvents}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-5 w-5" />
                        Load More Events
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Registration Modal */}
        {showRegisterModal && selectedEvent && (
          <Modal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            title={`Register for ${selectedEvent.title}`}
            size="md"
          >
            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <div className="animate-slideDown" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="animate-slideDown" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="animate-slideDown" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={registrationForm.phone}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
              
              {selectedEvent && (
                <div className="animate-slideDown bg-gray-50 rounded-lg p-4 border border-gray-200" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <h4 className="text-gray-900 font-semibold mb-2">Event Details</h4>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedEvent.date} at {selectedEvent.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedEvent.location}
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold">Price: ${selectedEvent.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Message */}
              {registrationMessage && (
                <div className={`animate-scaleUp p-4 rounded-lg border ${
                  registrationMessage.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {registrationMessage.type === 'success' ? (
                      <div className="flex-shrink-0 mr-3">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 mr-3">
                        <svg className="h-5 w-5 text-red-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm font-medium">{registrationMessage.text}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  disabled={isRegistering}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
};

export default HomePage; 