import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Mail, Phone, Tag, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import type { Registration, Event } from '../types';

interface PopulatedRegistration extends Omit<Registration, 'eventId'> {
  eventId: Event;
}

// MyEventsPage component shows the events registered by the current user
const MyEventsPage: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<PopulatedRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    if (user?.email) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchUserRegistrations = async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      // Get registrations that match user's email
      const response = await api.matchUserRegistrations(user.email);
      
      if (response.success) {
        setRegistrations(response.registrations || []);
        setMatchedCount(response.count || 0);
      }
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setError(err.message || 'Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Please sign in to view your events</div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundImage: 'url(https://cdn.slidemodel.com/wp-content/uploads/13081-01-gradient-designs-powerpoint-backgrounds-16x9-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
          <p className="text-gray-200">
            Events you've registered for{matchedCount > 0 && ` (${matchedCount} registration${matchedCount > 1 ? 's' : ''} found)`}
          </p>
        </div>

        {/* User Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900">
                Welcome, {user.name || user.email}!
              </h3>
              <p className="text-blue-700 text-sm">
                We automatically matched your registrations using your email address: {user.email}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Events List */}
        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-lg mb-4">No events found</div>
            <p className="text-gray-300 mb-6">
              You haven't registered for any events yet, or no registrations match your email address.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {registrations.map((registration) => (
              <div
                key={registration._id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md ${
                  isEventPast(registration.eventId.date) ? 'opacity-75' : ''
                }`}
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-48 md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:h-full md:w-48"
                      src={registration.eventId.image}
                      alt={registration.eventId.title}
                    />
                  </div>

                  {/* Event Details */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {registration.eventId.title}
                          </h3>
                          {isEventPast(registration.eventId.date) && (
                            <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                              Past Event
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {registration.eventId.description}
                        </p>

                        {/* Event Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(registration.eventId.date)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              {registration.eventId.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {registration.eventId.location}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              {registration.attendeeName}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {registration.attendeeEmail}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {registration.attendeePhone}
                            </div>
                          </div>
                        </div>

                        {/* Tags and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{registration.ticketType}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              ${registration.eventId.price}
                            </span>
                          </div>

                          {/* Registration Status */}
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(registration.status)}`}>
                            {getStatusIcon(registration.status)}
                            <span className="capitalize">{registration.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration Date */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Registered on {new Date(registration.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage; 