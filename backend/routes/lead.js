import express from 'express';
import { getAllLeads, getLeadById, getDashboardStats } from '../controllers/lead.js';
import { sendLeadsNotification } from '../services/whatsapp.js';

const router = express.Router();

router.get('/', getAllLeads);
router.get('/stats', getDashboardStats);
router.get('/:id', getLeadById);

// WhatsApp notification endpoint
router.post('/notify', async (req, res) => {
  try {
    const { phoneNumber, state } = req.body;

    if (!phoneNumber || !state) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and state are required'
      });
    }

    // Fetch leads for the state
    const { data: leads } = await getAllLeads({ query: { state } }, res);
    
    if (!leads || leads.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No leads found for notification'
      });
    }

    // Send WhatsApp notification
    const result = await sendLeadsNotification(phoneNumber, leads, state);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Notification sent successfully' : 'Failed to send notification',
      details: result
    });
  } catch (error) {
    console.error('Notify endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification'
    });
  }
});

export default router;
