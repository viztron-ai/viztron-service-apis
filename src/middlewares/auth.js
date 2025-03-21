const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { getSupabaseClient } = require('../supabase/supabase');
const logger = require('../config/logger');

/**
 * Authentication middleware for Supabase
 * @param {...string} requiredRights - The required permissions to access the route
 * @returns {Function} Express middleware
 */
const auth = () => {
  return async (req, res, next) => {
    try {
      const supabase = getSupabaseClient();

      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
      }

      const token = authHeader.split(' ')[1];

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
      }

      const {
        data: { location },
      } = await supabase.from('auth_management_locations').select('*').eq('user_id', user.id);
      req.user = { user, location };
      next();
    } catch (error) {
      logger.error('Error in auth middleware: ', error);
      next(error);
    }
  };
};

module.exports = auth;
