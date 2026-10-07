import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "@/i18n"
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Info,
  Settings2,
} from "lucide-react"

interface AppSettings {
  notificationBadge: boolean
  schemeUpdates: boolean
  calendarReminders: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  notificationBadge: true,
  schemeUpdates: true,
  calendarReminders: true,
}

const SETTINGS_KEY = "krishimitra_settings"

function Settings() {
  const { t } = useTranslation()
  const [settings, setSettings] =
    useState<AppSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        })
      }
    } catch {
      setSettings(DEFAULT_SETTINGS)
    }
  }, [])

  const updateSetting = (
    key: keyof AppSettings,
    value: boolean,
  ) => {
    setSettings((current) => {
      const updated = {
        ...current,
        [key]: value,
      }

      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(updated),
      )

      return updated
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("settings")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("managePreferences")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Settings2 className="size-5 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {t("applicationPreferences")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("choosePreferences")}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{t("language")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("chooseLanguage")}
                </p>
              </div>

              <select
                value={i18n.language}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                aria-label={t("language")}
              >
                <option value="en">{t("english")}</option>
                <option value="hi">{t("hindi")}</option>
                <option value="mr">{t("marathi")}</option>
              </select>
            </div>
          </div>
          <div className="divide-y">
            <SettingRow
              icon={Bell}
              title={t("notificationBadge")}
              description={t("notificationBadgeDescription")}
              enabled={settings.notificationBadge}
              onChange={(value) =>
                updateSetting("notificationBadge", value)
              }
            />

            <SettingRow
              icon={Info}
              title={t("schemeUpdates")}
              description={t("schemeUpdatesDescription")}
              enabled={settings.schemeUpdates}
              onChange={(value) =>
                updateSetting("schemeUpdates", value)
              }
            />

            <SettingRow
              icon={CalendarDays}
              title={t("calendarReminders")}
              description={t("calendarRemindersDescription")}
              enabled={settings.calendarReminders}
              onChange={(value) =>
                updateSetting("calendarReminders", value)
              }
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CheckCircle2 className="size-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">
                  {t("preferencesSaved")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your settings are automatically saved in this
                  browser.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">
              {t("aboutKrishiMitra")}
            </h2>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>{t("platform")}</span>
                <span className="font-medium text-foreground">
                  KrishiMitra AI
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t("version")}</span>
                <span className="font-medium text-foreground">
                  1.0.0
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t("mode")}</span>
                <span className="font-medium text-foreground">
                  {t("smartFarming")}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

interface SettingRowProps {
  icon: typeof Bell
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-muted p-2">
          <Icon className="size-5" />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  )
}

export default Settings




