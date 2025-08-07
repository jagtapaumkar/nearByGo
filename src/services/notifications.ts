import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Notification = Database['public']['Tables']['notifications']['Row']

export interface CreateNotificationData {
  user_id: string
  type: Notification['type']
  title: string
  message: string
  metadata?: any
}

export interface NotificationFilters {
  type?: Notification['type']
  read?: boolean
  limit?: number
  offset?: number
}

class NotificationService {
  // Get user notifications
  async getNotifications(userId: string, filters: NotificationFilters = {}) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.read !== undefined) {
        query = query.eq('read', filters.read)
      }

      query = query.order('created_at', { ascending: false })

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return { data: count || 0, error: null }
    } catch (error) {
      return { data: 0, error }
    }
  }

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete notification
  async deleteNotification(userId: string, notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Create notification (admin/system use)
  async createNotification(notificationData: CreateNotificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()
  }

  // Send push notification (placeholder for future implementation)
  async sendPushNotification(userId: string, title: string, message: string, data?: any) {
    // This would integrate with a push notification service like Firebase Cloud Messaging
    // For now, just create a database notification
    return await this.createNotification({
      user_id: userId,
      type: 'system',
      title,
      message,
      metadata: data
    })
  }
}

export const notificationService = new NotificationService()