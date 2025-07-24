export interface Event {
  _id: string; // Mongo ObjectId
  id?: string; // original string id (optional)
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  image: string;
  category: string;
  organizer: string;
  tags: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  token?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
}

export interface Registration {
  _id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketType: string;
} 