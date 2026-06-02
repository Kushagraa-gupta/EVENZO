import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { getZodMessage } from '../utils/zodError.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['attendee', 'organizer']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ password: z.string().min(6) });

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isApproved: user.isApproved,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

export const register = async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new ApiError(400, getZodMessage(parsed.error)));
  }

  const { name, email, password, role } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) return next(new ApiError(400, 'Email already registered'));

  const userRole = role === 'organizer' ? 'organizer' : 'attendee';
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    isApproved: userRole === 'attendee',
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  setAuthCookies(res, accessToken, refreshToken);

  sendWelcomeEmail(user).catch(console.error);

  res.status(201).json({
    success: true,
    message: userRole === 'organizer'
      ? 'Registered! Awaiting admin approval to create events.'
      : 'Welcome to Evenzo!',
    user: sanitizeUser(user),
  });
};

export const login = async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new ApiError(400, 'Invalid email or password'));
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, 'Invalid email or password'));
  }
  if (!user.isActive) {
    return next(new ApiError(403, 'Account has been deactivated.'));
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  setAuthCookies(res, accessToken, refreshToken);

  res.json({ success: true, user: sanitizeUser(user) });
};

export const logout = async (req, res) => {
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return next(new ApiError(401, 'Refresh token missing'));

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return next(new ApiError(401, 'Invalid refresh token'));

    const accessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    setAuthCookies(res, accessToken, newRefreshToken);

    res.json({ success: true, user: sanitizeUser(user) });
  } catch {
    next(new ApiError(401, 'Invalid refresh token'));
  }
};

export const forgotPassword = async (req, res, next) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(400, 'Valid email required'));

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user, resetUrl);

  res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
};

export const resetPassword = async (req, res, next) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(400, 'Password must be at least 6 characters'));

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) return next(new ApiError(400, 'Invalid or expired reset token'));

  user.password = parsed.data.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  setAuthCookies(res, accessToken, refreshToken);

  res.json({ success: true, message: 'Password reset successful', user: sanitizeUser(user) });
};

export const updateProfile = async (req, res, next) => {
  const schema = z.object({
    name: z.string().min(2).optional(),
    avatar: z.string().min(1).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(400, 'Invalid profile data'));

  const user = await User.findByIdAndUpdate(req.user._id, parsed.data, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, user: sanitizeUser(user) });
};
