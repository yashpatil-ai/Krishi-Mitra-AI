import { apiClient } from "@/services/apiClient"

export interface Notification {
  id: number
  user_id: number
  scheme_id: number | null
  notification_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function getNotifications(
  unreadOnly = false,
  token?: string,
) {
  const query = unreadOnly ? "?unread_only=true" : ""

  return apiClient.get<Notification[]>(
    `/notifications${query}`,
    token,
  )
}

export function getUnreadNotificationCount(token?: string) {
  return apiClient.get<{ count: number }>(
    "/notifications/unread-count",
    token,
  )
}

export function markNotificationRead(
  notificationId: number,
  token?: string,
) {
  return apiClient.patch<Notification>(
    `/notifications/${notificationId}/read`,
    undefined,
    token,
  )
}

export function markAllNotificationsRead(token?: string) {
  return apiClient.patch<{ message: string }>(
    "/notifications/read-all",
    undefined,
    token,
  )
}
