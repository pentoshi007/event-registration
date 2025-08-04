import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Firebase since it's not available in test environment
vi.mock('../firebase', () => ({
  getTokenFromFirebase: vi.fn(() => Promise.resolve('mock-token')),
  onMessageListener: vi.fn(() => Promise.resolve({})),
  messaging: {},
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock environment variables
Object.assign(process.env, {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: 'test-app-id',
  VITE_FIREBASE_VAPID_KEY: 'test-vapid-key',
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: {
    permission: 'default',
    requestPermission: vi.fn(() => Promise.resolve('granted')),
  },
  writable: true,
});

// Mock navigator.serviceWorker
Object.defineProperty(window.navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve({})),
  },
  writable: true,
});
