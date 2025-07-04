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

export default router; 