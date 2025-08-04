import Event from '../../models/Event';
import User from '../../models/User';

describe('Event Model', () => {
  it('should create an event with required fields', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      date: '2024-12-25',
      time: '18:00',
      location: 'Test Location',
      maxAttendees: 100,
      currentAttendees: 0,
      price: 50,
      category: 'Conference',
      organizer: 'Test Organizer',
      tags: ['tech', 'networking'],
      image: 'https://example.com/test-image.jpg'
    };

    const event = new Event(eventData);
    const savedEvent = await event.save();

    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.title).toBe(eventData.title);
    expect(savedEvent.description).toBe(eventData.description);
    expect(savedEvent.maxAttendees).toBe(eventData.maxAttendees);
    expect(savedEvent.currentAttendees).toBe(0);
    expect(savedEvent.price).toBe(eventData.price);
    expect(savedEvent.tags).toEqual(eventData.tags);
  });

  it('should require title field', async () => {
    const eventData = {
      description: 'This is a test event',
      date: '2024-12-25',
      time: '18:00',
      location: 'Test Location',
      maxAttendees: 100,
      price: 50,
      category: 'Conference',
      organizer: 'Test Organizer'
    };

    const event = new Event(eventData);
    
    await expect(event.save()).rejects.toThrow();
  });

  it('should set default currentAttendees to 0', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      date: '2024-12-25',
      time: '18:00',
      location: 'Test Location',
      maxAttendees: 100,
      price: 50,
      category: 'Conference',
      organizer: 'Test Organizer',
      image: 'https://example.com/test-image.jpg'
    };

    const event = new Event(eventData);
    const savedEvent = await event.save();

    expect(savedEvent.currentAttendees).toBe(0);
  });
});

describe('User Model', () => {
  it('should create a user with required fields', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@test.com',
      password: 'hashedpassword123',
      role: 'user'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe('user');
  });

  it('should require unique email', async () => {
    const userData1 = {
      name: 'John Doe',
      email: 'john@test.com',
      password: 'hashedpassword123',
      role: 'user'
    };

    const userData2 = {
      name: 'Jane Doe',
      email: 'john@test.com', // same email
      password: 'anotherpassword123',
      role: 'user'
    };

    const user1 = new User(userData1);
    await user1.save();

    const user2 = new User(userData2);
    await expect(user2.save()).rejects.toThrow();
  });

  it('should default role to user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@test.com',
      password: 'hashedpassword123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.role).toBe('user');
  });

  it('should allow admin role', async () => {
    const userData = {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'hashedpassword123',
      role: 'admin'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.role).toBe('admin');
  });
});
