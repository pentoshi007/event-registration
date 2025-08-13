import type { Event, Registration, User } from './types';

// Resolve API base URL for both local dev and Vercel production
const ENV_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_BASE_URL = (ENV_BASE && ENV_BASE.trim() !== '')
  ? ENV_BASE
  : (import.meta.env.DEV ? '/api' : 'https://13.232.120.38.sslip.io/api');

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

  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const errorJson = JSON.parse(text);
        throw new Error(errorJson.message || `API error ${response.status}`);
      } catch {
        // fallthrough to text error
      }
    }
    throw new Error(text || `API call failed: ${response.status} ${response.statusText}`);
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error('Failed to parse JSON response');
    }
  }

  // Attempt to parse JSON even if header is wrong, else throw
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || 'Unexpected non-JSON response');
  }
}

export const api = {
  // Auth
  authLogin: (email: string, password: string): Promise<ApiResponse> =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  authRegister: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    location: string;
  }): Promise<ApiResponse> =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

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