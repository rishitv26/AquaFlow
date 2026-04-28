/**
 * Utility functions for AquaFlow
 */

/**
 * Create a page URL from a page name
 * @param {string} pageName - The name of the page (e.g., 'Home', 'Settings', 'Leaderboard')
 * @returns {string} The URL path for the page
 */
export function createPageUrl(pageName) {
  // Convert page name to lowercase route
  const route = pageName.toLowerCase();
  
  // Special cases
  if (route === 'home') return '/';
  if (route === 'electrolyteguide') return '/electrolyte-guide';
  
  return `/${route}`;
}

/**
 * Format ML to liters
 * @param {number} ml - Milliliters
 * @returns {string} Formatted liters (e.g., "2.5L")
 */
export function mlToLiters(ml) {
  return `${(ml / 1000).toFixed(2)}L`;
}

/**
 * Get time ago string
 * @param {Date|string} date - The date to compare
 * @returns {string} Time ago string (e.g., "5m ago", "2h ago")
 */
export function getTimeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  
  return Math.floor(seconds) + 's ago';
}
