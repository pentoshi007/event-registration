import express, { Request, Response } from 'express';
import Newsletter from '../models/Newsletter';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(200).json({ 
          success: true, 
          message: 'Email is already subscribed to our newsletter!' 
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = undefined;
        await existingSubscription.save();
        
        return res.status(200).json({ 
          success: true, 
          message: 'Welcome back! Your subscription has been reactivated.' 
        });
      }
    }

    // Create new subscription
    const newSubscription = new Newsletter({
      email: email.toLowerCase()
    });

    await newSubscription.save();

    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already subscribed' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const subscription = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found in our newsletter list' 
      });
    }

    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from newsletter' 
    });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe. Please try again later.' 
    });
  }
});

// Get newsletter statistics (admin only)
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
    const totalSubscriptions = await Newsletter.countDocuments();
    const todaySubscribers = await Newsletter.countDocuments({
      isActive: true,
      subscribedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      data: {
        totalSubscribers,
        totalSubscriptions,
        todaySubscribers
      }
    });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch newsletter statistics' 
    });
  }
});

export default router; 