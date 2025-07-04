import express, { Request, Response } from 'express';
import Event from '../models/Event';

const router = express.Router();

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

export default router; 