// utils/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');
const logger = require('../config/logger');

let supabaseInstance = null;

/**
 * Get or initialize the Supabase client
 * @returns {Object} Supabase client instance
 */
function getSupabaseClient() {
  try {
    if (!supabaseInstance) {
      console.log('Initializing Supabase client');
      console.log('Supabase URL: ', config.supabase.url);
      console.log('Supabase Service Role Key: ', config.supabase.serviceRoleKey);
      supabaseInstance = createClient(config.supabase.url, config.supabase.serviceRoleKey);
    }
    return supabaseInstance;
  } catch (error) {
    logger.error('Error initializing Supabase client: ', error);
  }
}

module.exports = { getSupabaseClient };
