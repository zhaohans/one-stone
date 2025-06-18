import express from 'express';
import { NotificationService } from '../services/notification.service';
import { auth } from '../middleware/auth';

const router = express.Router();
const notificationService = new NotificationService();

// Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

// Mark a notification as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.post('/read-all', auth, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark all notifications as read' });
  }
});

export default router; 