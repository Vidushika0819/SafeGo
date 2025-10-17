const nodemailer = require('nodemailer');

// Create email transporter - configure for development/testing
// Note: createTransporter is a typo, should be createTransport, but this is for configuration placeholder
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any service
  auth: {
    user: process.env.EMAIL_USER || 'safego.notificaations@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-password'
  },
  // For development, use ethereal or mailtrap
  // For production, use actual email service
});

// Send check-in notification email to parent
async function sendCheckinEmail(parentEmail, childName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'safego.notifications@gmail.com',
      to: parentEmail,
      subject: 'SafeGo Notification: Student Checked In',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Student Check-In Notification</h2>
          <p>Dear Parent/Guardian,</p>
          <p>This is to notify you that your child <strong>${childName}</strong> has been successfully checked in for their school trip.</p>
          <p>Your child is now safely on the bus.</p>
          <p>You can monitor the trip progress in real-time from your SafeGo parent dashboard.</p>
          <p>Best regards,<br>SafeGo Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Check-in email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending check-in email:', error);
    return { success: false, error: error.message };
  }
}

// Send check-out notification email to parent
async function sendCheckoutEmail(parentEmail, childName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'safego.notifications@gmail.com',
      to: parentEmail,
      subject: 'SafeGo Notification: Student Checked Out',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Student Check-Out Notification</h2>
          <p>Dear Parent/Guardian,</p>
          <p>This is to notify you that your child <strong>${childName}</strong> has been successfully checked out after completing their school trip.</p>
          <p>Your child has safely arrived at their destination.</p>
          <p>Thank you for using SafeGo for safe transportation.</p>
          <p>Best regards,<br>SafeGo Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Check-out email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending check-out email:', error);
    return { success: false, error: error.message };
  }
}

// Create in-app notification in database (placeholder for notification model)
async function createInAppNotification(userId, title, message) {
  try {
    // Placeholder - would create notification record in database
    console.log('In-app notification created for user:', userId, title, message);
    // In real implementation, save to Notification model
    return { success: true };
  } catch (error) {
    console.error('Error creating in-app notification:', error);
    return { success: false, error: error.message };
  }
}

// Combined notification function for check-in/out
async function sendStudentStatusNotification(parentEmail, userId, childName, status) {
  try {
    let notificationTitle, notificationMessage;

    if (status === 'checked_in') {
      notificationTitle = 'Student Checked In';
      notificationMessage = `${childName} is now safely on the bus.`;
      await sendCheckinEmail(parentEmail, childName);
    } else if (status === 'dropped_off') {
      notificationTitle = 'Student Checked Out';
      notificationMessage = `${childName} has safely completed their trip and been checked out.`;
      await sendCheckoutEmail(parentEmail, childName);
    } else {
      console.log('Unknown status for notification:', status);
      return { success: false, error: 'Unknown status' };
    }

    // Create in-app notification
    await createInAppNotification(userId, notificationTitle, notificationMessage);

    console.log('Student status notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending student status notification:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendCheckinEmail,
  sendCheckoutEmail,
  createInAppNotification,
  sendStudentStatusNotification
};
