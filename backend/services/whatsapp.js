import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const ACCESS_TOKEN = 'EAAYpYQ9x1UQBQqleaME7AnKAQgTZC9whZA09lvwgsGsYpyjIHEnpR1ZAweMUDFCUZBZCTtLkVzZAnouaokNmZAfrEgFZCxxu8qgU02cdLyp4uoLmIBrG3SJ7WkGVZCMxQrsiBOfphqDxOSczoRKYDny1zZA3DZAJChCsh260S3XHFymWia4htNw5M4dBEKsejZAZAZB1qaRhPQU0ch9rpaRpQogQo18yU2qwmGmZAxpN7IEay4fIBH8KUIoJAhmlKEu8jWVgX8vAcDaLizk9pnOEtbecGYaVgQZD';

// Note: You'll need to get the Phone Number ID from your WhatsApp Business Account
const PHONE_NUMBER_ID = 'YOUR_PHONE_NUMBER_ID'; // Replace with actual Phone Number ID

export const sendWhatsAppNotification = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id
    };
  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

export const sendLeadsNotification = async (phoneNumber, leads, state) => {
  try {
    // Create message with top leads
    const topLeads = leads.slice(0, 5); // Send top 5 leads
    
    let message = `🔔 *New Leads Alert - ${state}*\n\n`;
    message += `Found ${leads.length} leads in your state!\n\n`;
    message += `*Top Opportunities:*\n\n`;

    topLeads.forEach((lead, index) => {
      message += `${index + 1}. *${lead.company_name}*\n`;
      message += `   Score: ${(lead.overall_score * 100).toFixed(0)}%\n`;
      message += `   ${lead.title || lead.description?.substring(0, 50) || 'Business Opportunity'}...\n\n`;
    });

    message += `\nLogin to view all leads: [Your App URL]`;

    const result = await sendWhatsAppNotification(phoneNumber, message);
    return result;
  } catch (error) {
    console.error('Send leads notification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendLoginNotification = async (phoneNumber, userName, state) => {
  const message = `👋 Welcome back, ${userName}!\n\nYou're now viewing leads for *${state}*.\n\nWe'll notify you about new high-priority opportunities in your state.`;
  
  return await sendWhatsAppNotification(phoneNumber, message);
};
