import React from 'react';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  isAdmin?: boolean;
  showRegisterButton?: boolean;
}

// EventCard component displays a single event's information
const EventCard: React.FC<EventCardProps> = ({ event, onRegister, onEdit, onDelete, isAdmin, showRegisterButton = true }) => {
  const isSoldOut = event.currentAttendees >= event.maxAttendees;
  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] group h-[560px] flex flex-col">
      {/* Balanced Image Container */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={event.image}
          alt={event.title}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            {event.category}
          </span>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Content Container - Well Balanced */}
      <div className="p-4 pb-4 flex flex-col flex-1 justify-between">
        {/* Top Content Section */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
            </div>
          </div>

          {/* Attendance Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Attendance</span>
              <span>{Math.round(attendancePercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${attendancePercentage >= 90 ? 'bg-red-500' :
                  attendancePercentage >= 70 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Price and Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-xl font-bold text-gray-900">{event.price}</span>
            </div>

            {isAdmin ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onEdit?.(event._id)}
                  className="bg-blue-600 text-white font-bold py-2 px-3 rounded w-24 text-xs hover:bg-blue-700 transition-colors duration-200"
                >
                  Edit Event
                </button>
                <button
                  onClick={() => onDelete?.(event._id)}
                  className="bg-red-600 text-white font-bold py-2 px-3 rounded w-24 text-xs hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Event
                </button>
              </div>
            ) : (
              showRegisterButton && (
                <button
                  onClick={() => onRegister?.(event._id)}
                  disabled={isSoldOut}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 text-sm ${isSoldOut
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                    }`}
                >
                  {isSoldOut ? 'Sold Out' : 'Register'}
                </button>
              )
            )}
          </div>

          {/* Event Tags - At Bottom */}
          <div className="border-t border-gray-100 pt-3 pb-0">
            {event.tags && event.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors duration-200 truncate"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="h-5 flex items-center">
                <span className="text-gray-400 text-xs">No tags available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 