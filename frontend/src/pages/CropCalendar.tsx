import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sprout,
  Tractor,
  Droplets,
  FlaskConical,
  Bug,
  Wheat,
} from "lucide-react"

import { useFarms } from "@/hooks/useFarm"
import { useCrops } from "@/hooks/useCrops"

type ActivityType =
  | "sowing"
  | "irrigation"
  | "fertilizer"
  | "monitoring"
  | "harvest"

interface CropActivity {
  id: string
  cropId: number
  cropName: string
  date: string
  title: string
  description: string
  type: ActivityType
}

const ACTIVITY_ICONS: Record<ActivityType, typeof Sprout> = {
  sowing: Sprout,
  irrigation: Droplets,
  fertilizer: FlaskConical,
  monitoring: Bug,
  harvest: Wheat,
}


const getActivityLabel = (type: ActivityType, t: (key: string) => string) => t(`activity${type.charAt(0).toUpperCase()}${type.slice(1)}`)

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const formatDate = (dateString: string) =>
  new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

function CropCalendar() {
  const { t } = useTranslation()
  const { data: farms, isLoading: farmsLoading } = useFarms()
  const farmId = farms?.[0]?.id
  const { data: crops, isLoading: cropsLoading } = useCrops(farmId)

  const today = new Date()

  const [selectedDate, setSelectedDate] = useState(getDateKey(today))
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const activities = useMemo<CropActivity[]>(() => {
    if (!crops) return []

    const generated: CropActivity[] = []

    crops
      .filter((crop) => crop.status?.toLowerCase() === "active")
      .forEach((crop) => {
        if (!crop.sowing_date) return

        const sowingDate = new Date(`${crop.sowing_date}T00:00:00`)

        generated.push({
          id: `${crop.id}-sowing`,
          cropId: crop.id,
          cropName: crop.name,
          date: getDateKey(sowingDate),
          title: t("cropSowing", { crop: crop.name }),
          description: t("cropSowingDescription", { crop: crop.name, variety: crop.variety ? ` (${crop.variety})` : "" }),
          type: "sowing",
        })

        ;[
          { days: 7, title: t("irrigationCheck"), type: "irrigation" as const },
          { days: 14, title: t("firstFertilizerCheck"), type: "fertilizer" as const },
          { days: 28, title: t("cropHealthMonitoring"), type: "monitoring" as const },
          { days: 42, title: t("irrigationCheck"), type: "irrigation" as const },
          { days: 56, title: t("pestDiseaseMonitoring"), type: "monitoring" as const },
        ].forEach((activity) => {
          const activityDate = addDays(sowingDate, activity.days)

          generated.push({
            id: `${crop.id}-${activity.days}`,
            cropId: crop.id,
            cropName: crop.name,
            date: getDateKey(activityDate),
            title: activity.title,
            description: t("recommendedActivityFor", { activity: activity.title, crop: crop.name }),
            type: activity.type,
          })
        })

        if (crop.expected_harvest_date) {
          generated.push({
            id: `${crop.id}-harvest`,
            cropId: crop.id,
            cropName: crop.name,
            date: crop.expected_harvest_date,
            title: t("cropHarvest", { crop: crop.name }),
            description: t("expectedHarvestDateFor", { crop: crop.name }),
            type: "harvest",
          })
        }
      })

    return generated.sort((a, b) => a.date.localeCompare(b.date))
  }, [crops])

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()

    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return Array.from({ length: startOffset + daysInMonth }, (_, index) => {
      if (index < startOffset) return null

      return new Date(year, month, index - startOffset + 1)
    })
  }, [visibleMonth])

  const selectedActivities = activities.filter(
    (activity) => activity.date === selectedDate,
  )

  const upcomingActivities = activities
    .filter((activity) => activity.date >= getDateKey(today))
    .slice(0, 6)

  const isLoading = farmsLoading || cropsLoading

  const previousMonth = () => {
    setVisibleMonth(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() - 1,
        1,
      ),
    )
  }

  const nextMonth = () => {
    setVisibleMonth(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        1,
      ),
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("cropCalendar")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("planTrackCropActivities")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          {t("loadingCropCalendar")}
        </div>
      </div>
    )
  }

  if (!farmId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("cropCalendar")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("planTrackCropActivities")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          {t("addFarmToPlanActivities")}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("cropCalendar")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("planTrackActiveCropActivities")}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t(`month${MONTHS[visibleMonth.getMonth()].charAt(0).toUpperCase()}${MONTHS[visibleMonth.getMonth()].slice(1)}`)}{" "}
                {visibleMonth.getFullYear()}
              </h2>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Next
            </button>
          </div>

          <div className="grid grid-cols-7 border-b pb-2 text-center text-xs font-semibold text-muted-foreground">
            {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(
              (day) => (
                <div key={day}>{t(`day${day.charAt(0).toUpperCase()}${day.slice(1)}`)}</div>
              ),
            )}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="min-h-24" />
              }

              const dateKey = getDateKey(date)
              const dayActivities = activities.filter(
                (activity) => activity.date === dateKey,
              )
              const isToday = dateKey === getDateKey(today)
              const isSelected = dateKey === selectedDate

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`min-h-24 rounded-lg border p-2 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <div
                    className={`mb-1 text-sm font-semibold ${
                      isToday ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayActivities.slice(0, 2).map((activity) => {
                      const Icon = ACTIVITY_ICONS[activity.type]

                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-1 truncate rounded bg-muted px-1 py-0.5 text-[10px]"
                        >
                          <Icon className="size-3 shrink-0" />
                          <span className="truncate">
                            {activity.title}
                          </span>
                        </div>
                      )
                    })}

                    {dayActivities.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">
                        +{dayActivities.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="size-5 text-primary" />
              <h2 className="font-semibold">{t("selectedDay")}</h2>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              {formatDate(selectedDate)}
            </p>

            {selectedActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("noPlannedActivities")}
              </p>
            ) : (
              <div className="space-y-3">
                {selectedActivities.map((activity) => {
                  const Icon = ACTIVITY_ICONS[activity.type]

                  return (
                    <div
                      key={activity.id}
                      className="rounded-lg border p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="size-4 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium">
                            {activity.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="mt-2 text-xs font-medium text-primary">
                            {getActivityLabel(activity.type, t)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <h2 className="font-semibold">{t("upcomingActivities")}</h2>
            </div>

            {upcomingActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("noUpcomingActivities")}
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingActivities.map((activity) => {
                  const Icon = ACTIVITY_ICONS[activity.type]

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.cropName} •{" "}
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Tractor className="size-5 text-primary" />
              <h2 className="font-semibold">{t("activeCrops")}</h2>
            </div>

            <div className="space-y-2">
              {(crops ?? [])
                .filter(
                  (crop) => crop.status?.toLowerCase() === "active",
                )
                .map((crop) => (
                  <div
                    key={crop.id}
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {crop.variety || t("varietyNotSpecified")}
                      </p>
                    </div>

                    <span className="text-sm font-medium">
                      {crop.area_acres} {t("acres")}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default CropCalendar
