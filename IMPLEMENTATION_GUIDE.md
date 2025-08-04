# Push Notifications & Testing Implementation Guide

## 🔔 Push Notifications (Firebase Integration)

### Overview

Push notifications have been integrated using Firebase Cloud Messaging (FCM) to keep users informed about:

- Event registration confirmations
- New event announcements
- Admin notifications to specific users or groups

### Setup Instructions

#### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Cloud Messaging
4. Generate Web App credentials
5. Download service account key for server

#### 2. Environment Configuration

**Client (.env)**

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

**Server (.env)**

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
CLIENT_URL=http://localhost:5173
```

#### 3. Features Implemented

**Client-Side:**

- `NotificationManager` component for permission handling
- Firebase service worker for background notifications
- Foreground notification display
- Auto-subscription on user login

**Server-Side:**

- Notification API endpoints
- Automatic notifications for:
  - Event registration confirmation
  - New event announcements
- Admin panel for sending targeted notifications

**API Endpoints:**

- `POST /api/notifications/subscribe` - Subscribe to notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe from notifications
- `POST /api/notifications/send-to-user` - Send to specific user (admin only)
- `POST /api/notifications/send-to-all` - Send to all users (admin only)
- `POST /api/notifications/send-to-event-participants` - Send to event participants (admin only)

#### 4. Usage Examples

**Send notification to all users:**

```bash
curl -X POST http://localhost:5000/api/notifications/send-to-all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "New Event Alert",
    "body": "Check out our latest tech conference!",
    "data": {"eventId": "event123"}
  }'
```

## 🧪 Automated Testing Suite

### Overview

Comprehensive testing setup covering unit tests, integration tests, and E2E tests.

### Testing Stack

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest + MongoDB Memory Server
- **E2E**: Playwright
- **Coverage**: Built-in coverage reporting

### Test Structure

```
client/
├── src/
│   ├── components/__tests__/
│   ├── utils/__tests__/
│   └── test/
│       ├── setup.ts
│       └── test-utils.tsx
├── vitest.config.ts
└── package.json

server/
├── src/
│   ├── routes/__tests__/
│   ├── models/__tests__/
│   └── test/
│       └── setup.ts
├── jest.config.js
└── package.json

e2e/
├── homepage.spec.ts
├── auth.spec.ts
└── playwright.config.ts
```

### Running Tests

**All Tests:**

```bash
npm run test:all
```

**Frontend Tests:**

```bash
cd client
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
npm run test:ui       # UI mode
```

**Backend Tests:**

```bash
cd server
npm test              # Single run
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

**E2E Tests:**

```bash
npm run test:e2e      # Headless mode
npm run test:e2e:ui   # UI mode
```

### Test Categories

#### 1. Unit Tests

- Component rendering and behavior
- Utility function logic
- Model validation
- Service functions

#### 2. Integration Tests

- API endpoint testing
- Database operations
- Authentication flows
- Firebase integration (mocked)

#### 3. E2E Tests

- User workflows
- Cross-browser compatibility
- Mobile responsiveness
- Authentication flows
- Admin functionality

### Test Examples

**Component Test:**

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import EventCard from "../EventCard";

describe("EventCard", () => {
  it("renders event information correctly", () => {
    const mockEvent = {
      /* event data */
    };
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });
});
```

**API Test:**

```typescript
import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  it("should register new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "password" })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

**E2E Test:**

```typescript
import { test, expect } from "@playwright/test";

test("user can register for event", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-testid="event-card"]:first-child .register-button');
  // ... test registration flow
});
```

### Coverage Reports

- Generated in `coverage/` directories
- HTML reports available after running coverage commands
- Aims for >80% coverage across all modules

### CI/CD Integration

Tests are configured to run in CI environments with:

- Parallel execution
- Retries on failure
- Multiple browser testing
- Coverage reporting
- Artifact collection

## 🚀 Development Workflow

### Getting Started

1. **Install dependencies:**

   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**

   - Copy `.env.example` files in both client and server
   - Fill in your Firebase credentials

3. **Start development servers:**

   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm run test:all
   ```

### Pre-commit Checklist

- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Environment variables configured
- [ ] Firebase project setup (for notifications)
- [ ] Coverage requirements met

### Deployment Notes

- Set up Firebase service account in production
- Configure environment variables on hosting platform
- Enable HTTPS for service worker (required for notifications)
- Set up monitoring for notification delivery rates

## 📝 Additional Notes

### Security Considerations

- FCM tokens are stored securely in user documents
- Admin-only endpoints are properly protected
- Environment variables contain sensitive data
- Service worker validates notification origins

### Performance

- Notifications are sent in batches to avoid rate limits
- Database queries are optimized with proper indexing
- Tests run in parallel for faster feedback
- Memory server used for test isolation

### Browser Support

- Modern browsers supporting Service Workers
- Progressive enhancement for older browsers
- Mobile browser compatibility tested
- Cross-platform notification support

This implementation provides a solid foundation for both push notifications and comprehensive testing, making your hobby project production-ready while maintaining code quality and user experience.
