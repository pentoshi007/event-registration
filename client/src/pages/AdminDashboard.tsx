import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import type { Event } from '../types';
import { api } from '../api';

// AdminDashboard component provides admin event management and analytics UI
const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [analytics, setAnalytics] = useState<{
    totals: {
      events: number;
      registrations: number;
      revenue: number;
      avgAttendance: number;
    };
    monthlyData: Array<{
      name: string;
      events: number;
      revenue: number;
      registrations: number;
    }>;
    categoryData: Array<{
      name: string;
      value: number;
    }>;
  } | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    price: '',
    category: '',
    image: '',
    organizer: '',
    tags: ''
  });

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  // Load categories from API
  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to basic categories if API fails
      setCategories(['Technology', 'Business', 'Marketing', 'Design', 'Education', 'Arts']);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // Load both events and analytics data
      const [eventsResponse, analyticsResponse] = await Promise.all([
        api.getEvents(),
        api.getAnalytics()
      ]);

      // Handle events
      const events = eventsResponse?.events || eventsResponse || [];
      setEvents(Array.isArray(events) ? events : []);

      // Handle analytics
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.analytics);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Use analytics data if available, otherwise calculate from events
  const totalEvents = analytics?.totals.events || events.length;
  const totalAttendees = analytics?.totals.registrations || events.reduce((sum, event) => sum + event.currentAttendees, 0);
  const totalRevenue = analytics?.totals.revenue || events.reduce((sum, event) => sum + (event.currentAttendees * event.price), 0);
  const avgAttendance = analytics?.totals.avgAttendance || (totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0);

  // Use analytics category data if available, otherwise calculate from events
  const pieData = analytics?.categoryData || Object.entries(
    events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    name: category,
    value: count
  }));

  // Use analytics monthly data if available, otherwise use fallback
  const monthlyData = analytics?.monthlyData || [
    { name: 'Jan', events: 0, revenue: 0, registrations: 0 },
    { name: 'Feb', events: 0, revenue: 0, registrations: 0 },
    { name: 'Mar', events: 0, revenue: 0, registrations: 0 },
    { name: 'Apr', events: 0, revenue: 0, registrations: 0 },
    { name: 'May', events: 0, revenue: 0, registrations: 0 },
    { name: 'Jun', events: 0, revenue: 0, registrations: 0 },
    { name: 'Jul', events: 0, revenue: 0, registrations: 0 },
    { name: 'Aug', events: 0, revenue: 0, registrations: 0 },
    { name: 'Sep', events: 0, revenue: 0, registrations: 0 },
    { name: 'Oct', events: 0, revenue: 0, registrations: 0 },
    { name: 'Nov', events: 0, revenue: 0, registrations: 0 },
    { name: 'Dec', events: 0, revenue: 0, registrations: 0 },
  ];

  const COLORS = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#EA580C', '#DB2777'];

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call API to create the event
      const response = await api.createEvent({
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        maxAttendees: parseInt(eventForm.maxAttendees),
        price: parseFloat(eventForm.price),
        category: eventForm.category,
        image: eventForm.image || 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800',
        organizer: eventForm.organizer,
        tags: eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      if (response.success && response.event) {
        setEvents([...events, response.event]);
        setShowCreateModal(false);
        resetForm();
        // Refresh analytics data and categories
        loadData();
        loadCategories();
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleEditEvent = (eventId: string) => {
    const event = events.find(e => e._id === eventId);
    if (event) {
      setSelectedEvent(event);
      setEventForm({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        maxAttendees: event.maxAttendees.toString(),
        price: event.price.toString(),
        category: event.category,
        image: event.image,
        organizer: event.organizer,
        tags: event.tags.join(', ')
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      try {
        // Call API to update the event
        const response = await api.updateEvent(selectedEvent._id, {
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          maxAttendees: parseInt(eventForm.maxAttendees),
          price: parseFloat(eventForm.price),
          category: eventForm.category,
          image: eventForm.image,
          organizer: eventForm.organizer,
          tags: eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        });

        if (response.success && response.event) {
          setEvents(events.map(event => event._id === selectedEvent._id ? response.event! : event));
          setShowEditModal(false);
          resetForm();
          // Refresh analytics data and categories
          loadData();
          loadCategories();
        }
      } catch (error) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxAttendees: '',
      price: '',
      category: '',
      image: '',
      organizer: '',
      tags: ''
    });
    setSelectedEvent(null);
    setShowCustomCategory(false);
    setCustomCategory('');
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'ADD_NEW_CATEGORY') {
      setShowCustomCategory(true);
      setEventForm(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setEventForm(prev => ({ ...prev, category: value }));
    }
  };

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value);
    setEventForm(prev => ({ ...prev, category: value }));
  };

  // Add the delete handler function
  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Call API to delete the event
      const response = await api.deleteEvent(eventId);

      if (response.success) {
        setEvents(events.filter(event => event._id !== eventId));
        // Refresh analytics data
        loadData();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(https://cdn.slidemodel.com/wp-content/uploads/13081-01-gradient-designs-powerpoint-backgrounds-16x9-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    // --- OUTERMOST DASHBOARD BG: Matches EditProfile/ChangePassword gradient BG ---
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: 'url(https://cdn.slidemodel.com/wp-content/uploads/13081-01-gradient-designs-powerpoint-backgrounds-16x9-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          {/* --- ADMIN DASHBOARD TITLE: White BG, rounded, shadowed --- */}
          <div className="bg-white px-6 py-2 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          {/* --- CREATE EVENT BUTTON: Green gradient style --- */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Custom Stats Blocks Section */}
        <section className="flex justify-center items-center mt-2 mb-8 animate-on-scroll">
          <div className="relative w-full max-w-2xl px-2 md:px-0">
            {/* Subtle Blue gradient background bar */}
            <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 opacity-70 blur-[1px]" style={{ zIndex: 0 }}></div>
            <div className="relative flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 p-3 sm:p-4" style={{ zIndex: 1 }}>
              <div className="bg-white/95 rounded-lg border border-blue-100 shadow flex flex-col items-center justify-center w-full sm:w-40 h-20 text-center px-2 py-2">
                <Calendar className="h-6 w-6 text-blue-600 mb-1" />
                <div className="text-lg font-bold text-blue-700 leading-tight">{totalEvents}</div>
                <div className="text-gray-500 text-xs">Events Hosted</div>
              </div>
              <div className="bg-white/95 rounded-lg border border-green-100 shadow flex flex-col items-center justify-center w-full sm:w-40 h-20 text-center px-2 py-2">
                <Users className="h-6 w-6 text-green-600 mb-1" />
                <div className="text-lg font-bold text-green-700 leading-tight">{totalAttendees}</div>
                <div className="text-gray-500 text-xs">Total Attendees</div>
              </div>
              <div className="bg-white/95 rounded-lg border border-yellow-100 shadow flex flex-col items-center justify-center w-full sm:w-40 h-20 text-center px-2 py-2">
                <DollarSign className="h-6 w-6 text-yellow-500 mb-1" />
                <div className="text-lg font-bold text-yellow-600 leading-tight">${totalRevenue.toLocaleString()}</div>
                <div className="text-gray-500 text-xs">Total Revenue</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Events"
            value={totalEvents}
            icon={Calendar}
            change={{ value: 12, type: 'increase' }}
            color="blue"
          />
          <StatsCard
            title="Total Attendees"
            value={totalAttendees}
            icon={Users}
            change={{ value: 8, type: 'increase' }}
            color="green"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={{ value: 15, type: 'increase' }}
            color="purple"
          />
          <StatsCard
            title="Avg. Attendance"
            value={avgAttendance}
            icon={TrendingUp}
            change={{ value: 5, type: 'increase' }}
            color="yellow"
          />
        </div>

        {/* Charts */}
        {/* --- MONTHLY OVERVIEW CHART: Horizontally scrollable, shows Jan-Dec --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Overview</h3>
            {/* Chart is now horizontally scrollable for all months */}
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: 900 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData} width={900}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backdropFilter: 'blur(16px)',
                        color: '#374151'
                      }}
                    />
                    <Bar dataKey="events" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Events by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backdropFilter: 'blur(16px)',
                    color: '#374151'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events Management */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Manage Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={() => handleEditEvent(event._id)}
                onDelete={() => handleDeleteEvent(event._id)}
                isAdmin={true}
              />
            ))}
          </div>
        </div>

        {/* Create Event Modal */}
        {/* --- CREATE EVENT MODAL: Stylish, glassy, gradient, blue header, green form bg, blue gradient button, image preview --- */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title=""
          size="lg"
        >
          {/* Main form card with soft green gradient bg */}
          <div className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 rounded-2xl shadow-2xl p-0 md:p-1">
            {/* Header with blue gradient and icon */}
            <div className="flex flex-col items-center justify-center rounded-t-2xl bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 p-6 mb-4">
              <div className="flex items-center gap-3">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-white drop-shadow-lg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">Create Event</h2>
              </div>
              <p className="text-white/90 text-sm mt-2">Fill the details below to add a new event</p>
            </div>
            {/* Form fields with glassy/gradient, focus/hover, and image preview */}
            <form onSubmit={handleCreateEvent} className="space-y-4 px-4 md:px-8 pb-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                  <select
                    required={!showCustomCategory}
                    value={showCustomCategory ? 'ADD_NEW_CATEGORY' : eventForm.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="" className="bg-white">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-white">
                        {category}
                      </option>
                    ))}
                    <option value="ADD_NEW_CATEGORY" className="bg-blue-50 text-blue-600 font-medium">
                      ➕ Add New Category
                    </option>
                  </select>
                  {showCustomCategory && (
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => handleCustomCategoryChange(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-green-200 rounded-lg text-gray-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent mt-2 transition-all duration-200 shadow-sm hover:shadow-md"
                      placeholder="Enter new category name"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-24 resize-none transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    required
                    value={eventForm.time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Max Attendees</label>
                  <input
                    type="number"
                    required
                    value={eventForm.maxAttendees}
                    onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={eventForm.price}
                    onChange={(e) => setEventForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="99.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Organizer</label>
                  <input
                    type="text"
                    required
                    value={eventForm.organizer}
                    onChange={(e) => setEventForm(prev => ({ ...prev, organizer: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Organization name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={eventForm.tags}
                  onChange={(e) => setEventForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Technology, AI, Innovation"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) => setEventForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="https://example.com/image.jpg"
                />
                {/* Live image preview if URL is present */}
                {eventForm.image && (
                  <div className="flex justify-center mt-2">
                    <img src={eventForm.image} alt="Preview" className="max-h-32 rounded-xl shadow-lg border border-blue-200 object-cover" />
                  </div>
                )}
              </div>

              {/* Buttons: Cancel and blue gradient Create Event */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg transition-all text-lg tracking-wide"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Edit Event Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Event"
          size="md"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md mx-auto p-6">
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                  <select
                    required={!showCustomCategory}
                    value={showCustomCategory ? 'ADD_NEW_CATEGORY' : eventForm.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" className="bg-white">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-white">
                        {category}
                      </option>
                    ))}
                    <option value="ADD_NEW_CATEGORY" className="bg-blue-50 text-blue-600 font-medium">
                      ➕ Add New Category
                    </option>
                  </select>
                  {showCustomCategory && (
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => handleCustomCategoryChange(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg text-gray-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent mt-2"
                      placeholder="Enter new category name"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    required
                    value={eventForm.time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Max Attendees</label>
                  <input
                    type="number"
                    required
                    value={eventForm.maxAttendees}
                    onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={eventForm.price}
                    onChange={(e) => setEventForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="99.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Organizer</label>
                  <input
                    type="text"
                    required
                    value={eventForm.organizer}
                    onChange={(e) => setEventForm(prev => ({ ...prev, organizer: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Organization name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={eventForm.tags}
                  onChange={(e) => setEventForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Technology, AI, Innovation"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) => setEventForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
