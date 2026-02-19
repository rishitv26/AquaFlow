/**
 * Reminder System for AquaPulse
 * Handles browser notifications and reminder scheduling
 */

let remindersActive = false
let reminderInterval = null
let lastNotificationTime = 0

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (err) {
      console.error('Error requesting notification permission:', err)
      return false
    }
  }

  return false
}

/**
 * Show a hydration reminder notification
 */
export function showReminderNotification() {
  // First check if notifications are supported
  if (!('Notification' in window)) {
    console.log('❌ [Reminders] Browser does not support notifications')
    return
  }

  console.log(`📢 [Reminders] Permission status: ${Notification.permission}`)

  // If permission not granted, request it first
  if (Notification.permission !== 'granted') {
    console.log('🔔 [Reminders] Requesting notification permission...')
    requestNotificationPermission().then((granted) => {
      if (granted) {
        console.log('✅ [Reminders] Permission granted! Showing notification...')
        showNotifi()
      } else {
        console.log('❌ [Reminders] Permission denied by user')
      }
    })
    return
  }

  // Permission already granted, show notification
  showNotifi()
}

function showNotifi() {
  const now = Date.now()
  // Prevent duplicate notifications within 5 seconds
  if (now - lastNotificationTime < 5000) {
    console.log('⏸️ [Reminders] Duplicate prevented (within 5s)')
    return
  }

  lastNotificationTime = now

  try {
    try {
      // Try with full options first
      const notification = new Notification('💧 Time to Hydrate!', {
        body: 'Drink some water to stay healthy and focused',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2300d4ff"/><path d="M50 20 L55 40 L55 70 L45 70 L45 40 Z" fill="%23ffffff" opacity="0.8"/></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2300d4ff"/></svg>',
        tag: 'aquapulse-reminder',
        requireInteraction: false,
      })

      console.log('✅ [Reminders] Notification sent!')

      // Handle notification click
      notification.onclick = () => {
        console.log('👆 [Reminders] Notification clicked')
        window.focus()
        notification.close()
      }
    } catch (err) {
      console.warn('⚠️ [Reminders] Full notification failed, trying simple version:', err.message)
      // Fallback: try with minimal options
      const notification = new Notification('💧 Time to Hydrate!', {
        body: 'Time to drink some water!'
      })
      console.log('✅ [Reminders] Simple notification sent!')
    }

    // Play audio notification as backup
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a pleasant notification sound (two beeps)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)

      console.log('🔊 [Reminders] Audio notification played')
    } catch (audioErr) {
      console.log('ℹ️ [Reminders] Audio notification not available:', audioErr.message)
    }

    // Dispatch custom event for in-app notification
    window.dispatchEvent(new CustomEvent('aquapulse-reminder', {
      detail: { title: '💧 Time to Hydrate!', message: 'Drink some water to stay healthy and focused' }
    }))
    console.log('📢 [Reminders] Custom event dispatched for in-app notification')

  } catch (err) {
    console.error('❌ [Reminders] Failed to show notification:', err)
  }
}

/**
 * Start the reminder system
 * @param {number} intervalMinutes - Interval in minutes between reminders
 * @param {boolean} enabled - Whether reminders are enabled
 */
export function startReminders(intervalMinutes = 60, enabled = true) {
  // Stop existing reminders
  stopReminders()

  if (!enabled || intervalMinutes <= 0) {
    console.log('[Reminders] Reminders disabled or invalid interval')
    return
  }

  // Request permission first
  requestNotificationPermission().then((granted) => {
    if (!granted) {
      console.log('[Reminders] Notification permission not granted')
      return
    }

    remindersActive = true
    const intervalMs = intervalMinutes * 60 * 1000

    console.log(`[Reminders] Starting reminders every ${intervalMinutes} minutes`)

    // Show first reminder after 1 minute (let user settle in)
    setTimeout(() => {
      if (remindersActive) {
        showReminderNotification()
      }
    }, 60 * 1000)

    // Schedule recurring reminders
    reminderInterval = setInterval(() => {
      if (remindersActive) {
        showReminderNotification()
      }
    }, intervalMs)
  })
}

/**
 * Stop the reminder system
 */
export function stopReminders() {
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }
  remindersActive = false
  console.log('[Reminders] Reminders stopped')
}

/**
 * Check if reminders are currently active
 */
export function isRemindersActive() {
  return remindersActive
}

/**
 * Update reminders based on settings
 * Call this whenever settings change
 */
export function updateReminders(settings) {
  if (!settings) {
    stopReminders()
    return
  }

  const { reminders_enabled, reminder_interval_minutes } = settings

  if (reminders_enabled) {
    startReminders(reminder_interval_minutes || 60, true)
  } else {
    stopReminders()
  }
}

/**
 * Initialize reminders system
 * Call this when the app starts
 */
export function initializeReminders() {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('[Reminders] Browser does not support notifications')
    return
  }

  console.log('[Reminders] System initialized')
  console.log(`[Reminders] Current permission: ${Notification.permission}`)

  // Listen for visibility changes (pause/resume reminders)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[Reminders] App hidden')
    } else {
      console.log('[Reminders] App visible')
    }
  })
}
