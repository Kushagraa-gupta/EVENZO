import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseStyles = `
  body { font-family: 'Inter', Arial, sans-serif; background: #0F0F0F; color: #fff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
  .card { background: #1A1A2E; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.08); }
  h1 { font-family: 'Poppins', sans-serif; color: #6C63FF; margin: 0 0 16px; }
  p { color: #A0A0B0; line-height: 1.6; }
  .btn { display: inline-block; background: linear-gradient(135deg, #6C63FF, #FF6584); color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; margin-top: 16px; }
  .logo { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #6C63FF, #FF6584); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
`;

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER) {
    console.log(`[Email skipped] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@evenzo.com',
    to,
    subject,
    html,
  });
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>Welcome to Evenzo! 🎉</h1>
      <p>Hi ${user.name},</p>
      <p>Your gateway to every experience starts here. Discover concerts, workshops, sports, and more — book in seconds with your digital QR ticket.</p>
      <a href="${process.env.CLIENT_URL}/events" class="btn">Explore Events</a>
      <p style="margin-top:24px;font-size:12px;">Your gateway to every experience</p>
    </div></div></body></html>`;
  await sendEmail({ to: user.email, subject: 'Welcome to Evenzo! 🎉', html });
};

export const sendBookingConfirmationEmail = async (user, booking, event, qrCode) => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>Your ticket for ${event.title} is confirmed!</h1>
      <p>Hi ${user.name}, your booking is confirmed.</p>
      <p><strong>Event:</strong> ${event.title}<br/>
      <strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-IN')}<br/>
      <strong>Venue:</strong> ${event.venueName}, ${event.city}<br/>
      <strong>Quantity:</strong> ${booking.quantity}<br/>
      <strong>Total:</strong> ₹${booking.totalAmount}</p>
      ${qrCode ? `<img src="${qrCode}" alt="QR Ticket" style="max-width:200px;margin:16px 0;border-radius:12px;" />` : ''}
      <a href="${process.env.CLIENT_URL}/dashboard/attendee/tickets" class="btn">View My Tickets</a>
    </div></div></body></html>`;
  await sendEmail({
    to: user.email,
    subject: `Your ticket for ${event.title} is confirmed!`,
    html,
  });
};

export const sendEventReminderEmail = async (user, booking, event, qrCode) => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>Your event is tomorrow! 🎪</h1>
      <p>Hi ${user.name}, don't forget about <strong>${event.title}</strong> tomorrow!</p>
      <p><strong>Time:</strong> ${event.startTime || 'TBA'}<br/>
      <strong>Venue:</strong> ${event.venueName}, ${event.city}</p>
      ${qrCode ? `<img src="${qrCode}" alt="QR Ticket" style="max-width:200px;margin:16px 0;" />` : ''}
      <p>Bring your QR code for quick check-in.</p>
    </div></div></body></html>`;
  await sendEmail({
    to: user.email,
    subject: 'Your event is tomorrow! 🎪',
    html,
  });
};

export const sendBookingCancellationEmail = async (user, booking, event) => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>Booking cancelled — Refund initiated</h1>
      <p>Hi ${user.name}, your booking for <strong>${event.title}</strong> has been cancelled.</p>
      <p>Refund amount: <strong>₹${booking.totalAmount}</strong></p>
      <p>Refunds typically appear within 5–7 business days.</p>
    </div></div></body></html>`;
  await sendEmail({
    to: user.email,
    subject: 'Booking cancelled — Refund initiated',
    html,
  });
};

export const sendOrganizerApprovedEmail = async (user) => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>You're approved as an Organizer on Evenzo!</h1>
      <p>Hi ${user.name}, your organizer application has been approved. You can now create and manage events.</p>
      <a href="${process.env.CLIENT_URL}/dashboard/organizer/create" class="btn">Create Your First Event</a>
    </div></div></body></html>`;
  await sendEmail({
    to: user.email,
    subject: "You're approved as an Organizer on Evenzo!",
    html,
  });
};

export const sendOrganizerRejectedEmail = async (user, reason = '') => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>Organizer application update</h1>
      <p>Hi ${user.name}, unfortunately your organizer application was not approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>You may contact support or reapply later.</p>
    </div></div></body></html>`;
  await sendEmail({
    to: user.email,
    subject: 'Organizer application update',
    html,
  });
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
    <div class="container"><div class="card">
      <div class="logo">Evenzo</div>
      <h1>Reset your password</h1>
      <p>Hi ${user.name}, click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div></div></body></html>`;
  await sendEmail({ to: user.email, subject: 'Reset your Evenzo password', html });
};
