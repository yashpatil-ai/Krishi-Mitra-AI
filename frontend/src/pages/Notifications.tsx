import { useEffect, useState } from "react"
import { Bell, Check, CheckCheck, Clock, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/services/notificationApi"

function Notifications() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [schemeUpdatesEnabled, setSchemeUpdatesEnabled] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("krishimitra_settings")

      if (stored) {
        const settings = JSON.parse(stored)
        setSchemeUpdatesEnabled(settings.schemeUpdates !== false)
      }
    } catch {
      setSchemeUpdatesEnabled(true)
    }
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("failedToLoadNotifications"),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const visibleNotifications = notifications.filter(
    (notification) =>
      schemeUpdatesEnabled ||
      notification.notification_type !== "scheme_update",
  )

  const unreadCount = visibleNotifications.filter(
    (notification) => !notification.is_read,
  ).length

  const handleRead = async (notification: Notification) => {
    if (notification.is_read) return

    try {
      const updated = await markNotificationRead(notification.id)

      setNotifications((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      )
    } catch {
      setError(t("failedToMarkNotificationRead"))
    }
  }

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead()

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      )
    } catch {
      setError(t("failedToMarkNotificationsRead"))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("notifications")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("notificationDescription")}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleReadAll}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <CheckCheck className="h-4 w-4" />
            {t("markAllAsRead")}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold">{t("yourUpdates")}</h2>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                  : t("allCaughtUp")}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {t("loadingNotifications")}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 font-semibold">{t("noNotificationsYet")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("notificationEmptyDescription")}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {visibleNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleRead(notification)}
                className={`flex w-full gap-4 p-5 text-left transition-colors hover:bg-muted/50 ${
                  notification.is_read ? "" : "bg-primary/5"
                }`}
              >
                <div
                  className={`mt-1 rounded-lg p-2 ${
                    notification.is_read
                      ? "bg-muted"
                      : "bg-primary/10"
                  }`}
                >
                  {notification.scheme_id ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <Bell className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {notification.title}
                    </h3>

                    {!notification.is_read && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {t("new")}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {notification.message}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(notification.created_at).toLocaleString(
                      "en-IN",
                    )}
                  </div>
                </div>

                {!notification.is_read && (
                  <Check className="mt-2 h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications