import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import type { Event } from '../types';
import { api } from '../api';

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents();
      // Handle the API response structure: {events: [...], pagination: {...}}
      const events = response?.events || response || [];
      setEvents(Array.isArray(events) ? events : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Fallback data if API fails
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (event.currentAttendees * event.price), 0);
  const avgAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;

  const categoryData = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count
  }));

  const monthlyData = [
    { name: 'Jan', events: 12, revenue: 15000 },
    { name: 'Feb', events: 19, revenue: 22000 },
    { name: 'Mar', events: 15, revenue: 18000 },
    { name: 'Apr', events: 22, revenue: 28000 },
    { name: 'May', events: 18, revenue: 25000 },
    { name: 'Jun', events: 25, revenue: 32000 },
  ];

  const COLORS = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#EA580C', '#DB2777'];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      _id: (Date.now()).toString(),
      title: eventForm.title,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      maxAttendees: parseInt(eventForm.maxAttendees),
      currentAttendees: 0,
      price: parseFloat(eventForm.price),
      category: eventForm.category,
      image: eventForm.image || 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: eventForm.organizer,
      tags: eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    resetForm();
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

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      const updatedEvent: Event = {
        ...selectedEvent,
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
      };
      setEvents(events.map(event => event._id === selectedEvent._id ? updatedEvent : event));
      setShowEditModal(false);
      resetForm();
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
                  {pieData.map((entry, index) => (
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
                isAdmin={true}
              />
            ))}
          </div>
        </div>

        {/* Create Event Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Event"
          size="lg"
        >
          <form onSubmit={handleCreateEvent} className="space-y-4">
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
                  required
                  value={eventForm.category}
                  onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-white">Select category</option>
                  <option value="Technology" className="bg-white">Technology</option>
                  <option value="Business" className="bg-white">Business</option>
                  <option value="Marketing" className="bg-white">Marketing</option>
                  <option value="Design" className="bg-white">Design</option>
                  <option value="Education" className="bg-white">Education</option>
                  <option value="Arts" className="bg-white">Arts</option>
                </select>
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
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Event
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Event Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Event"
          size="lg"
        >
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
                  required
                  value={eventForm.category}
                  onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-white">Select category</option>
                  <option value="Technology" className="bg-white">Technology</option>
                  <option value="Business" className="bg-white">Business</option>
                  <option value="Marketing" className="bg-white">Marketing</option>
                  <option value="Design" className="bg-white">Design</option>
                  <option value="Education" className="bg-white">Education</option>
                  <option value="Arts" className="bg-white">Arts</option>
                </select>
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
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
