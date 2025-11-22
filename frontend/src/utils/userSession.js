// User Session Management - Setiap user punya ID unik yang persistent

const USER_ID_KEY = 'accstorage_user_id';

/**
 * Get atau create user ID yang persistent di localStorage
 * Setiap user akan punya ID unik sendiri
 */
export const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate unique user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
};

/**
 * Clear user session (untuk testing atau logout)
 */
export const clearUserSession = () => {
  localStorage.removeItem(USER_ID_KEY);
};

/**
 * Get session ID untuk chat session saat ini
 */
export const getSessionId = () => {
  const SESSION_ID_KEY = 'accstorage_session_id';
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};
