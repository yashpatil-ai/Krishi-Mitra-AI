import { useEffect, useState } from "react"
import {
  Bell,
  Bot,
  LogOut,
  CalendarDays,
  CloudSun,
  Droplets,
  FlaskConical,
  Home,
  Leaf,
  LineChart,
  Menu,
  Settings,
  Sprout,
  UserRound,
  Wheat,
} from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/context/AuthContext"
import { getUnreadNotificationCount } from "@/services/notificationApi"

const navigation = [
  { label: "dashboard", icon: Home, to: "/dashboard" },
  { label: "myFarm", icon: Sprout, to: "/farm" },
  { label: "weather", icon: CloudSun, to: "/weather" },
  { label: "crops", icon: Wheat, to: "/crops" },
  { label: "diseaseDetection", icon: FlaskConical, to: "/disease" },
  { label: "fertilizer", icon: Leaf, to: "/fertilizer" },
  { label: "irrigation", icon: Droplets, to: "/irrigation" },
  { label: "market", icon: LineChart, to: "/market" },
  { label: "schemes", icon: Leaf, to: "/schemes" },
  { label: "cropCalendar", icon: CalendarDays, to: "/calendar" },
  { label: "aiAssistant", icon: Bot, to: "/ai-assistant" },
]

function AppLayout() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const [notificationBadgeEnabled, setNotificationBadgeEnabled] = useState(true)

  useEffect(() => {
    const loadNotificationPreference = () => {
      try {
        const stored = localStorage.getItem("krishimitra_settings")

        if (stored) {
          const settings = JSON.parse(stored)
          setNotificationBadgeEnabled(settings.notificationBadge !== false)
        }
      } catch {
        setNotificationBadgeEnabled(true)
      }
    }

    loadNotificationPreference()
    window.addEventListener("storage", loadNotificationPreference)

    return () => {
      window.removeEventListener("storage", loadNotificationPreference)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadUnreadCount = async () => {
      try {
        const result = await getUnreadNotificationCount()
        if (mounted) setUnreadNotifications(result.count)
      } catch {
        if (mounted) setUnreadNotifications(0)
      }
    }

    loadUnreadCount()
    const interval = window.setInterval(loadUnreadCount, 60000)

    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="size-5" />
          </div>

          <div>
            <p className="font-semibold leading-none">KrishiMitra AI</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("smartFarming")}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="size-4" />
                {t(item.label)}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")
            }
          >
            <Settings className="size-4" />
            {t("settings")}
          </NavLink>
        </div>
      </aside>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card lg:hidden">
            <div className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sprout className="size-5" />
                </div>

                <div>
                  <p className="font-semibold leading-none">KrishiMitra AI</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("smartFarming")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg p-2 hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={t("closeNavigation")}
              >
                ×
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    <Icon className="size-4" />
                    {t(item.label)}
                  </NavLink>
                )
              })}
            </nav>

            <div className="border-t p-4">
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Settings className="size-4" />
                {t("settings")}
              </NavLink>
            </div>
          </aside>
        </>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:ml-64 lg:px-6">
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
          aria-label={t("openNavigation")}
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">
            {t("agriculturalIntelligence")}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NavLink
            to="/notifications"
            className="rounded-lg p-2 hover:bg-muted"
            aria-label={t("notifications")}
          >
            <span className="relative">
              <Bell className="size-5" />
              {notificationBadgeEnabled && unreadNotifications > 0 && (
                <span className="absolute -right-2 -top-2 flex min-w-4 h-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </span>
          </NavLink>

          <NavLink
            to="/profile"
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted"
            aria-label={t("profile")}
          >
            <UserRound className="size-5" />

            <span className="hidden text-sm font-medium sm:inline">
              {user?.full_name ?? t("farmer")}
            </span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={t("logout")}
            title={t("logout")}
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <main className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout





