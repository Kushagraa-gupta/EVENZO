import cron from 'node-cron';
import Booking from '../models/Booking.js';
import { sendEventReminderEmail } from '../services/email.service.js';

const isTomorrow = (date) => {
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return eventDate.getTime() === tomorrow.getTime();
};

export const startReminderJob = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Running event reminder job...');
    try {
      const bookings = await Booking.find({ status: 'confirmed' })
        .populate('user', 'name email')
        .populate('event');

      let sent = 0;
      for (const booking of bookings) {
        if (booking.event && isTomorrow(booking.event.date)) {
          await sendEventReminderEmail(
            booking.user,
            booking,
            booking.event,
            booking.qrCode
          );
          sent += 1;
        }
      }
      console.log(`[Cron] Sent ${sent} reminder email(s)`);
    } catch (error) {
      console.error('[Cron] Reminder job failed:', error.message);
    }
  });
  console.log('[Cron] Event reminder scheduled (daily 9:00 AM)');
};
