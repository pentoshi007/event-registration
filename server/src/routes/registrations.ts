import express, { Request, Response } from 'express';
import Registration from '../models/Registration';
import Event from '../models/Event';

const router = express.Router();

// POST /api/registrations - Create a new registration
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, attendeeName, attendeeEmail, attendeePhone, ticketType = 'Standard' } = req.body;

    // Validate required fields
    if (!eventId || !attendeeName || !attendeeEmail || !attendeePhone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: eventId, attendeeName, attendeeEmail, attendeePhone'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user already registered for this event
    const existingRegistration = await Registration.findOne({
      eventId,
      $or: [
        { attendeeEmail: attendeeEmail.toLowerCase() },
        { attendeePhone }
      ]
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event is full
    const currentRegistrations = await Registration.countDocuments({
      eventId,
      status: { $ne: 'cancelled' }
    });

    if (currentRegistrations >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      });
    }

    // Create registration
    const registration = new Registration({
      eventId,
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.toLowerCase().trim(),
      attendeePhone: attendeePhone.trim(),
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      ticketType
    });

    await registration.save();

    // Update event current attendees count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentAttendees: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      registration: registration.toObject()
    });
  } catch (error: any) {
    console.error('Registration creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create registration. Please try again.'
    });
  }
});

// GET /api/registrations/user/:identifier - Get registrations by email or phone
router.get('/user/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { type } = req.query; // 'email' or 'phone'

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'User identifier is required'
      });
    }

    // Build query based on identifier type
    let query: any;
    if (type === 'phone') {
      query = { attendeePhone: identifier };
    } else {
      // Default to email, also check if identifier looks like email
      query = { attendeeEmail: identifier.toLowerCase() };
    }

    const registrations = await Registration.find(query)
      .populate('eventId')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      registrations
    });
  } catch (error: any) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

// GET /api/registrations/match/:email - Find registrations that match user email/phone
router.get('/match/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find registrations by email
    const registrations = await Registration.find({
      attendeeEmail: email.toLowerCase()
    }).populate('eventId');

    res.json({
      success: true,
      registrations,
      count: registrations.length
    });
  } catch (error: any) {
    console.error('Error matching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to match registrations'
    });
  }
});

// PUT /api/registrations/:id/status - Update registration status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'pending', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: confirmed, pending, or cancelled'
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('eventId');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Update event attendee count based on status change
    if (status === 'cancelled') {
      await Event.findByIdAndUpdate(registration.eventId, {
        $inc: { currentAttendees: -1 }
      });
    }

    res.json({
      success: true,
      message: 'Registration status updated',
      registration
    });
  } catch (error: any) {
    console.error('Error updating registration status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration status'
    });
  }
});

// GET /api/registrations/event/:eventId - Get all registrations for an event
router.get('/event/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    let query: any = { eventId };
    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      registrations,
      count: registrations.length
    });
  } catch (error: any) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event registrations'
    });
  }
});

// GET /api/registrations/analytics - Get analytics data for admin dashboard
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    // Get all registrations with event data
    const registrations = await Registration.find({ status: { $ne: 'cancelled' } })
      .populate('eventId')
      .sort({ registrationDate: -1 });

    // Get all events
    const events = await Event.find();

    // Calculate monthly data based on registration dates
    const monthlyStats: { [key: string]: { events: Set<string>, revenue: number, registrations: number } } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize all months
    monthNames.forEach(month => {
      monthlyStats[month] = { events: new Set(), revenue: 0, registrations: 0 };
    });

    // Process registrations
    registrations.forEach(registration => {
      if (registration.eventId && typeof registration.eventId === 'object') {
        const event = registration.eventId as any;
        const regDate = new Date(registration.registrationDate);
        const monthName = monthNames[regDate.getMonth()];

        if (monthlyStats[monthName]) {
          monthlyStats[monthName].events.add(event._id.toString());
          monthlyStats[monthName].revenue += event.price || 0;
          monthlyStats[monthName].registrations += 1;
        }
      }
    });

    // Convert to array format for charts
    const monthlyData = monthNames.map(month => ({
      name: month,
      events: monthlyStats[month].events.size,
      revenue: monthlyStats[month].revenue,
      registrations: monthlyStats[month].registrations
    }));

    // Calculate category distribution
    const categoryStats: { [key: string]: number } = {};
    events.forEach(event => {
      categoryStats[event.category] = (categoryStats[event.category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryStats).map(([category, count]) => ({
      name: category,
      value: count
    }));

    // Calculate totals
    const totalEvents = events.length;
    const totalRegistrations = registrations.length;
    const totalRevenue = registrations.reduce((sum, reg) => {
      if (reg.eventId && typeof reg.eventId === 'object') {
        const event = reg.eventId as any;
        return sum + (event.price || 0);
      }
      return sum;
    }, 0);
    const avgAttendance = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;

    res.json({
      success: true,
      analytics: {
        totals: {
          events: totalEvents,
          registrations: totalRegistrations,
          revenue: totalRevenue,
          avgAttendance
        },
        monthlyData,
        categoryData
      }
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

export default router; 