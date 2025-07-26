import type { Event, Registration, User } from './types';

const API_BASE_URL = '/api';

export interface PaginationResponse<T> {
  events?: T[];
  data?: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number | null;
  };
}

export interface RegistrationData {
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketType?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User; // For profile updates and auth responses
  event?: Event; // For event creation/update responses
  registration?: Registration;
  registrations?: Registration[];
  count?: number;
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API call failed: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Get events with pagination
  getEvents: (params?: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
  }): Promise<PaginationResponse<Event>> => {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    return apiCall(`/events${query ? `?${query}` : ''}`);
  },

  // Get single event
  getEvent: (id: string) =>
    apiCall(`/events/${id}`),

  // Newsletter subscription
  subscribeNewsletter: (email: string) =>
    apiCall('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Registration APIs
  // Create a new registration
  createRegistration: (data: RegistrationData): Promise<ApiResponse> =>
    apiCall('/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get registrations by user email
  getUserRegistrations: (email: string): Promise<ApiResponse> =>
    apiCall(`/registrations/user/${encodeURIComponent(email)}?type=email`),

  // Get registrations by user phone
  getUserRegistrationsByPhone: (phone: string): Promise<ApiResponse> =>
    apiCall(`/registrations/user/${encodeURIComponent(phone)}?type=phone`),

  // Find registrations that match user email
  matchUserRegistrations: (email: string): Promise<ApiResponse> =>
    apiCall(`/registrations/match/${encodeURIComponent(email)}`),

  // Update registration status
  updateRegistrationStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled'): Promise<ApiResponse> =>
    apiCall(`/registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Get all registrations for an event (admin only)
  getEventRegistrations: (eventId: string, status?: string): Promise<ApiResponse> => {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    const query = searchParams.toString();
    return apiCall(`/registrations/event/${eventId}${query ? `?${query}` : ''}`);
  },

  // Get analytics data for admin dashboard
  getAnalytics: (): Promise<{
    success: boolean;
    analytics: {
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
    };
  }> => apiCall('/registrations/analytics'),

  // User profile management
  updateProfile: (data: {
    name: string;
    phone?: string;
    location?: string;
    dateOfBirth?: string;
    avatar?: string;
  }): Promise<ApiResponse> =>
    apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Change password
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> =>
    apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Admin event management
  createEvent: (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    maxAttendees: number;
    price: number;
    category: string;
    image: string;
    organizer: string;
    tags: string[];
  }): Promise<ApiResponse> =>
    apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  updateEvent: (id: string, eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    maxAttendees: number;
    price: number;
    category: string;
    image: string;
    organizer: string;
    tags: string[];
  }): Promise<ApiResponse> =>
    apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (id: string): Promise<ApiResponse> =>
    apiCall(`/events/${id}`, {
      method: 'DELETE',
    }),

  // Get available event categories
  getCategories: (): Promise<{
    success: boolean;
    categories: string[];
  }> => apiCall('/events/categories'),
}; 