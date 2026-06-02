import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import TicketType from '../models/TicketType.js';

const sampleEvents = [
  { title: 'Sunset Music Festival 2026', category: 'Music', city: 'Mumbai', price: 999, seats: 500 },
  { title: 'IPL Watch Party — Finals', category: 'Sports', city: 'Bangalore', price: 499, seats: 200 },
  { title: 'Stand-Up Comedy Night', category: 'Comedy', city: 'Delhi', price: 399, seats: 150 },
  { title: 'React & Node Masterclass', category: 'Tech', city: 'Hyderabad', price: 1499, seats: 80 },
  { title: 'Street Food Carnival', category: 'Food', city: 'Mumbai', price: 0, seats: 1000 },
  { title: 'Modern Art Exhibition', category: 'Art', city: 'Pune', price: 299, seats: 120 },
  { title: 'Startup Summit India', category: 'Conference', city: 'Bangalore', price: 2499, seats: 300 },
  { title: 'Pottery Workshop', category: 'Workshop', city: 'Chennai', price: 799, seats: 30 },
  { title: 'Bollywood Night Live', category: 'Music', city: 'Delhi', price: 1299, seats: 400 },
  { title: 'Marathon 10K Run', category: 'Sports', city: 'Mumbai', price: 599, seats: 800 },
];

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Event.deleteMany(), TicketType.deleteMany()]);

  const password = 'password123';

  await User.create({
    name: 'Admin User',
    email: 'admin@evenzo.com',
    password,
    role: 'admin',
    isApproved: true,
  });

  const organizer = await User.create({
    name: 'Event Organizer',
    email: 'organizer@evenzo.com',
    password,
    role: 'organizer',
    isApproved: true,
  });

  await User.create({
    name: 'Test Attendee',
    email: 'attendee@evenzo.com',
    password,
    role: 'attendee',
    isApproved: true,
  });

  const banners = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    'https://images.unsplash.com/photo-1527225732592-f9f6c7f3e5c1?w=800',
    'https://images.unsplash.com/photo-1515187028567-6f03dad4f78c?w=800',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    'https://images.unsplash.com/photo-1460661414737-f34d21b7e0f2?w=800',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff776?w=800',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50e?w=800',
  ];

  for (let i = 0; i < sampleEvents.length; i++) {
    const s = sampleEvents[i];
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7 + i * 3);

    const event = await Event.create({
      title: s.title,
      description: `Join us for an unforgettable ${s.category.toLowerCase()} experience at ${s.title}. Book your tickets now on Evenzo — your gateway to every experience.`,
      category: s.category,
      bannerUrl: banners[i],
      date: eventDate,
      startTime: '18:00',
      endTime: '22:00',
      venueName: `${s.city} Arena`,
      address: `123 Main Street, ${s.city}`,
      city: s.city,
      mapsLink: `https://maps.google.com/?q=${s.city}`,
      status: 'published',
      tags: [s.category.toLowerCase(), s.city.toLowerCase(), 'featured'],
      organizer: organizer._id,
    });

    const general = await TicketType.create({
      name: 'General Admission',
      price: s.price,
      totalSeats: s.seats,
      bookedSeats: Math.floor(Math.random() * 20),
      event: event._id,
    });

    const vip = await TicketType.create({
      name: 'VIP',
      price: s.price === 0 ? 0 : s.price * 2,
      totalSeats: Math.floor(s.seats / 10),
      bookedSeats: 0,
      event: event._id,
    });

    event.ticketTypes = [general._id, vip._id];
    await event.save();
  }

  console.log('Seed complete!');
  console.log('Admin: admin@evenzo.com / password123');
  console.log('Organizer: organizer@evenzo.com / password123');
  console.log('Attendee: attendee@evenzo.com / password123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
