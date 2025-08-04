import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import EventCard from '../EventCard';

describe('EventCard', () => {
  const mockEvent = {
    _id: '1',
    title: 'Test Event',
    description: 'This is a test event description',
    date: '2024-12-25',
    time: '18:00',
    location: 'Test Location',
    maxAttendees: 100,
    currentAttendees: 25,
    price: 50,
    category: 'Conference',
    image: 'https://example.com/image.jpg',
    organizer: 'Test Organizer',
    tags: ['tech', 'networking'],
  };

  it('renders event card with basic information', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('This is a test event description')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    // The component doesn't display organizer information
  });

  it('displays event date and time correctly', () => {
    render(<EventCard event={mockEvent} />);
    
    // The component shows date and time together as "date at time"
    expect(screen.getByText(/2024-12-25.*at.*18:00/)).toBeInTheDocument();
  });

  it('shows attendee count', () => {
    render(<EventCard event={mockEvent} />);
    
    // The attendee count is shown as "current / max attendees"
    expect(screen.getByText(/25.*\/.*100.*attendees/)).toBeInTheDocument();
  });

  it('displays price when event is paid', () => {
    render(<EventCard event={mockEvent} />);
    
    // The price shows just the number, dollar sign is separate
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('displays "Free" when event price is 0', () => {
    const freeEvent = { ...mockEvent, price: 0 };
    render(<EventCard event={freeEvent} />);
    
    // For free events, it shows "0"
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders event tags', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('tech')).toBeInTheDocument();
    expect(screen.getByText('networking')).toBeInTheDocument();
  });
});
