import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Setup test database before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean up database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
process.env.FIREBASE_CLIENT_EMAIL = 'test@test.com';
