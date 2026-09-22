const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_app_password',
  },
});

const sendWelcomeEmail = async (email) => {
  await transporter.sendMail({
    from: '"Your Brand" <' + (process.env.EMAIL_USER || 'your_email@gmail.com') + '>',
    to: email,
    subject: 'Welcome to our Newsletter!',
    html: `
      <h2>Welcome 🎉</h2>
      <p>Thanks for subscribing to our newsletter.</p>
    `,
  });
};

const sendFinanceEnquiryNotification = async (enquiryData) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
  
  const html = `
    <h2>New Finance Enquiry Received 📋</h2>
    <p>A new finance enquiry has been submitted. Here are the details:</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Customer Information</h3>
      <p><strong>Full Name:</strong> ${enquiryData.fullName}</p>
      <p><strong>Email:</strong> ${enquiryData.email}</p>
      <p><strong>Phone:</strong> ${enquiryData.phone}</p>
      
      <h3>Finance Details</h3>
      <p><strong>Borrow Amount:</strong> £${enquiryData.borrowAmount || 'N/A'}</p>
      <p><strong>Term:</strong> ${enquiryData.years || 'N/A'} years</p>
      <p><strong>Use Type:</strong> ${enquiryData.useType || 'N/A'}</p>
      
      <h3>Personal Information</h3>
      <p><strong>Employment Status:</strong> ${enquiryData.employmentStatus || 'N/A'}</p>
      <p><strong>Residency Status:</strong> ${enquiryData.residencyStatus || 'N/A'}</p>
      <p><strong>Property Owner:</strong> ${enquiryData.propertyOwner || 'N/A'}</p>
      <p><strong>Previous Finance:</strong> ${enquiryData.financeBefore || 'N/A'}</p>
      <p><strong>Credit History:</strong> ${enquiryData.creditHistory || 'N/A'}</p>
      
      ${enquiryData.message ? `<h3>Message</h3><p>${enquiryData.message}</p>` : ''}
      
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        <strong>Submitted on:</strong> ${new Date().toLocaleString()}
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      <a href="${process.env.ADMIN_DASHBOARD_URL || 'https://ukaautotrade.co.uk/dashboard/finance-enquiries'}" 
         style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
        View in Dashboard
      </a>
    </p>
  `;
  
  try {
    await transporter.sendMail({
      from: '"UKA Car Trade" <' + (process.env.EMAIL_USER || 'noreply@company.com') + '>',
      to: adminEmail,
      subject: `New Finance Enquiry from ${enquiryData.fullName}`,
      html: html,
    });
    console.log(`Finance enquiry email sent to ${adminEmail}`);
  } catch (error) {
    console.error('Error sending finance enquiry email:', error);
    // Don't throw error - enquiry should still be saved even if email fails
  }
};

module.exports = { sendWelcomeEmail, sendFinanceEnquiryNotification };