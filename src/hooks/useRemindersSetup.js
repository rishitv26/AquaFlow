/**
 * Hook for managing reminders based on settings
 * Automatically starts/stops reminders when settings change
 */

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { initializeReminders, updateReminders } from '@/services/reminders'
import client from '@/api/client'

export function useRemindersSetup() {
  // Fetch user settings
  const { data: settings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const response = await client.get('/user-settings')
      return response.data[0] || {
        reminders_enabled: true,
        reminder_interval_minutes: 60,
      }
    },
  })

  // Initialize on mount
  useEffect(() => {
    initializeReminders()
  }, [])

  // Update reminders when settings change
  useEffect(() => {
    if (settings) {
      updateReminders(settings)
    }
  }, [settings?.reminders_enabled, settings?.reminder_interval_minutes])

  return { settings }
}
