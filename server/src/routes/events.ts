import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Event from '../models/Event';
import User from '../models/User';

const router = express.Router();

// JWT Secret (should match auth.ts)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token (same as in auth.ts)
const authenticateToken = async (req: any, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Handle demo tokens for testing
    if (token.startsWith('demo-token-')) {
      const userId = token.split('-')[2];
      const mockUsers = [
        {
          _id: '1',
          name: 'Admin User',
          email: 'admin@eventinity.com',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1-555-0001',
          dateOfBirth: '1990-01-01',
          location: 'San Francisco, CA'
        },
        {
          _id: '2',
          name: 'Demo User',
          email: 'user@eventinity.com',
          role: 'user',
          avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1-555-0002',
          dateOfBirth: '1995-05-15',
          location: 'New York, NY'
        }
      ];

      const user = mockUsers.find(u => u._id === userId);
      if (user) {
        req.user = user;
        return next();
      }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req: any, res: Response, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// GET /api/events - Get all events with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, category, search } = req.query;

    const limitNum = Math.min(parseInt(limit as string) || 10, 50); // Max 50 items per request
    const offsetNum = parseInt(offset as string) || 0;

    // Build query
    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Get events with pagination
    const events = await Event.find(query)
      .sort({ date: 1 }) // Sort by date ascending
      .skip(offsetNum)
      .limit(limitNum);

    // Get total count for pagination info
    const totalEvents = await Event.countDocuments(query);
    const hasMore = (offsetNum + limitNum) < totalEvents;

    res.json({
      events,
      pagination: {
        total: totalEvents,
        limit: limitNum,
        offset: offsetNum,
        hasMore,
        nextOffset: hasMore ? offsetNum + limitNum : null
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/categories - Get all available categories (must come before /:id route)
router.get('/categories', async (req: Request, res: Response) => {
  try {
    // Get distinct categories from all events
    const categories = await Event.distinct('category');

    // Filter out empty/null categories and sort alphabetically
    const validCategories = categories
      .filter(category => category && category.trim())
      .sort();

    res.json({
      success: true,
      categories: validCategories
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events - Create new event (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      maxAttendees,
      price,
      category,
      image,
      organizer,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !maxAttendees || !category || !organizer) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create new event
    const newEvent = new Event({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      maxAttendees: parseInt(maxAttendees),
      currentAttendees: 0,
      price: parseFloat(price) || 0,
      category: category.trim(),
      image: image || 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: organizer.trim(),
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : []
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });

  } catch (error: any) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

// PUT /api/events/:id - Update event (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      maxAttendees,
      price,
      category,
      image,
      organizer,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !maxAttendees || !category || !organizer) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        location: location.trim(),
        maxAttendees: parseInt(maxAttendees),
        price: parseFloat(price) || 0,
        category: category.trim(),
        image: image || 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800',
        organizer: organizer.trim(),
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : []
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });

  } catch (error: any) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

// DELETE /api/events/:id - Delete event (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

export default router; 