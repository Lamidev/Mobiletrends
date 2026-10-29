'use client';
import safeLocalStorage from "@/lib/safe-storage";

export const getOrCreateSessionId = () => {
  let sessionId = safeLocalStorage.getItem('guestSessionId');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15);
    safeLocalStorage.setItem('guestSessionId', sessionId);
  }
  return sessionId;
};

export const clearSessionId = () => {
  safeLocalStorage.removeItem('guestSessionId');
};

export const getSessionId = () => {
  return safeLocalStorage.getItem('guestSessionId');
};
