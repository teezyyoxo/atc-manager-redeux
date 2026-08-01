export const MOBILE_SESSION_MEDIA_QUERY =
  '(max-width: 700px), (any-pointer: coarse) and (max-width: 1366px)';

export const isMobileSession = () => {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(MOBILE_SESSION_MEDIA_QUERY).matches;
  }
  return window.innerWidth <= 700;
};
