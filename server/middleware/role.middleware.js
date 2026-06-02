import { ApiError } from '../utils/ApiError.js';

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  if (req.user.role === 'organizer' && !req.user.isApproved && !roles.includes('admin')) {
    return next(new ApiError(403, 'Organizer account pending admin approval.'));
  }
  next();
};
