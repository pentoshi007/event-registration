import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import User from './models/User.js';
import Registration from './models/Registration.js';

dotenv.config();

// Exact bolt project mock events
const mockEvents = [
  {
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
  },
  {
    title: 'Digital Marketing Masterclass',
    description: 'Master the art of digital marketing with expert insights, practical strategies, and real-world case studies. Learn from industry professionals and boost your marketing ROI.',
    date: '2024-03-22',
    time: '14:00',
    location: 'New York Business Hub',
    maxAttendees: 200,
    currentAttendees: 156,
    price: 199,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Marketing',
    organizer: 'Marketing Pro Academy',
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics']
  },
  {
    title: 'Sustainable Business Conference',
    description: 'Explore sustainable business practices and learn how to build an eco-friendly, profitable enterprise. Connect with green business leaders and sustainability experts.',
    date: '2024-04-05',
    time: '10:00',
    location: 'Chicago Green Center',
    maxAttendees: 300,
    currentAttendees: 89,
    price: 149,
    image: 'https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Business',
    organizer: 'EcoVision Corp',
    tags: ['Sustainability', 'Business', 'Green Tech', 'Environment']
  },
  {
    title: 'Creative Design Workshop',
    description: 'Unleash your creativity in this hands-on design workshop. Learn advanced techniques in graphic design, UI/UX, and brand identity creation.',
    date: '2024-04-12',
    time: '13:00',
    location: 'Los Angeles Creative Space',
    maxAttendees: 150,
    currentAttendees: 78,
    price: 179,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Design',
    organizer: 'Design Academy',
    tags: ['Design', 'Creative', 'UI/UX', 'Branding']
  },
  {
    title: 'Data Science Bootcamp',
    description: 'Intensive 3-day bootcamp covering machine learning, data analysis, and visualization. Perfect for beginners and intermediate practitioners.',
    date: '2024-04-20',
    time: '09:00',
    location: 'Boston Tech Campus',
    maxAttendees: 100,
    currentAttendees: 67,
    price: 399,
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology',
    organizer: 'DataScience Pro',
    tags: ['Data Science', 'Machine Learning', 'Analytics', 'Python']
  },
  {
    title: 'Leadership Excellence Summit',
    description: 'Develop your leadership skills with renowned speakers and interactive workshops. Network with executives and emerging leaders.',
    date: '2024-05-03',
    time: '08:30',
    location: 'Miami Convention Center',
    maxAttendees: 400,
    currentAttendees: 203,
    price: 249,
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Business',
    organizer: 'Leadership Institute',
    tags: ['Leadership', 'Management', 'Networking', 'Business']
  },
  {
    title: 'Cybersecurity Workshop 2024',
    description: 'Learn essential cybersecurity practices and protect your organization from digital threats. Hands-on sessions with security experts and ethical hackers.',
    date: '2024-05-15',
    time: '10:30',
    location: 'Seattle Tech Hub',
    maxAttendees: 150,
    currentAttendees: 92,
    price: 219,
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology',
    organizer: 'SecureNet Solutions',
    tags: ['Cybersecurity', 'Technology', 'Privacy', 'Enterprise']
  },
  {
    title: 'E-commerce Growth Strategies',
    description: 'Scale your online business with proven e-commerce strategies. Learn about conversion optimization, customer retention, and digital sales funnels.',
    date: '2024-05-28',
    time: '11:00',
    location: 'Austin Business Center',
    maxAttendees: 250,
    currentAttendees: 134,
    price: 189,
    image: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Business',
    organizer: 'E-commerce Masters',
    tags: ['E-commerce', 'Online Business', 'Marketing', 'Sales']
  },
  {
    title: 'AI & Machine Learning Conference',
    description: 'Dive deep into artificial intelligence and machine learning applications. Featuring keynotes from leading AI researchers and hands-on ML workshops.',
    date: '2024-06-10',
    time: '09:30',
    location: 'Denver Innovation Center',
    maxAttendees: 350,
    currentAttendees: 198,
    price: 329,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology',
    organizer: 'AI Research Institute',
    tags: ['AI', 'Machine Learning', 'Research', 'Innovation']
  }
];

// Exact bolt project mock users
const mockUsers = [
  {
    name: 'Admin User',
    email: 'admin@evently.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+1-555-0001',
    dateOfBirth: '1990-01-01',
    location: 'San Francisco, CA'
  },
  {
    name: 'Regular User',
    email: 'user@evently.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+1-555-0002',
    dateOfBirth: '1995-05-15',
    location: 'New York, NY'
  }
];

// Exact bolt project mock registrations
const mockRegistrations = [
  {
    attendeeName: 'John Smith',
    attendeeEmail: 'john.smith@example.com',
    attendeePhone: '+1-555-0123',
    registrationDate: '2024-02-15',
    status: 'confirmed',
    ticketType: 'Standard'
  },
  {
    attendeeName: 'Sarah Johnson',
    attendeeEmail: 'sarah.johnson@example.com',
    attendeePhone: '+1-555-0124',
    registrationDate: '2024-02-16',
    status: 'confirmed',
    ticketType: 'VIP'
  },
  {
    attendeeName: 'Michael Brown',
    attendeeEmail: 'michael.brown@example.com',
    attendeePhone: '+1-555-0125',
    registrationDate: '2024-02-17',
    status: 'pending',
    ticketType: 'Standard'
  },
  {
    attendeeName: 'Emily Davis',
    attendeeEmail: 'emily.davis@example.com',
    attendeePhone: '+1-555-0126',
    registrationDate: '2024-02-18',
    status: 'confirmed',
    ticketType: 'Standard'
  },
  {
    attendeeName: 'David Wilson',
    attendeeEmail: 'david.wilson@example.com',
    attendeePhone: '+1-555-0127',
    registrationDate: '2024-02-19',
    status: 'confirmed',
    ticketType: 'Standard'
  }
];

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://aniket00736:ak802135@cluster0.h8lwxvz.mongodb.net/evently?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function seedEvents() {
  try {
    console.log('Seeding events...');

    for (const eventData of mockEvents) {
      await Event.findOneAndUpdate(
        { title: eventData.title }, // Find by title
        eventData, // Update with this data
        {
          upsert: true, // Create if doesn't exist
          new: true, // Return the updated document
          setDefaultsOnInsert: true // Set default values on insert
        }
      );
    }

    console.log(`✅ Seeded ${mockEvents.length} events successfully`);
  } catch (error) {
    console.error('Error seeding events:', error);
  }
}

async function seedUsers() {
  try {
    console.log('Seeding users...');

    for (const userData of mockUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userToSave = {
          ...userData,
          password: hashedPassword
        };

        await User.create(userToSave);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }

    console.log(`✅ Seeded ${mockUsers.length} users successfully`);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

async function seedRegistrations() {
  try {
    console.log('Seeding registrations...');

    // Get event IDs to associate registrations
    const events = await Event.find({});

    for (let i = 0; i < mockRegistrations.length && i < events.length; i++) {
      const registrationData = {
        ...mockRegistrations[i],
        eventId: events[i % events.length]._id // Cycle through events
      };

      await Registration.findOneAndUpdate(
        {
          attendeeEmail: registrationData.attendeeEmail,
          eventId: registrationData.eventId
        }, // Find by email and event
        registrationData, // Update with this data
        {
          upsert: true, // Create if doesn't exist
          new: true, // Return the updated document
          setDefaultsOnInsert: true // Set default values on insert
        }
      );
    }

    console.log(`✅ Seeded ${mockRegistrations.length} registrations successfully`);
  } catch (error) {
    console.error('Error seeding registrations:', error);
  }
}

async function seedDatabase() {
  try {
    await connectDB();

    await seedEvents();
    await seedUsers();
    await seedRegistrations();

    console.log('🎉 Database seeded successfully with bolt project data!');

    // Show stats
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    const registrationCount = await Registration.countDocuments();

    console.log(`📊 Database Stats:`);
    console.log(`   Events: ${eventCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Registrations: ${registrationCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Check if database needs seeding (is empty)
export async function needsSeeding() {
  try {
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();

    // If both events and users collections are empty, we need seeding
    return eventCount === 0 && userCount === 0;
  } catch (error) {
    console.error('Error checking if database needs seeding:', error);
    return false;
  }
}

// Auto-seed function that only seeds if database is empty
export async function autoSeed() {
  try {
    if (await needsSeeding()) {
      console.log('🌱 Database is empty, auto-seeding...');

      await seedEvents();
      await seedUsers();
      await seedRegistrations();

      console.log('🎉 Auto-seeding completed successfully!');

      // Show stats
      const eventCount = await Event.countDocuments();
      const userCount = await User.countDocuments();
      const registrationCount = await Registration.countDocuments();

      console.log(`📊 Database Stats:`);
      console.log(`   Events: ${eventCount}`);
      console.log(`   Users: ${userCount}`);
      console.log(`   Registrations: ${registrationCount}`);
    } else {
      console.log('✅ Database already has data, skipping auto-seed');
    }
  } catch (error) {
    console.error('❌ Error during auto-seeding:', error);
  }
}

// Manual seed function for development
async function manualSeedDatabase() {
  try {
    await connectDB();

    await seedEvents();
    await seedUsers();
    await seedRegistrations();

    console.log('🎉 Manual seeding completed successfully!');

    // Show stats
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    const registrationCount = await Registration.countDocuments();

    console.log(`📊 Database Stats:`);
    console.log(`   Events: ${eventCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Registrations: ${registrationCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the seed function if this file is executed directly (CommonJS-friendly)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof require !== 'undefined' && require.main === module) {
  void manualSeedDatabase();
}

export { seedEvents, seedUsers, seedRegistrations };
export default manualSeedDatabase; 