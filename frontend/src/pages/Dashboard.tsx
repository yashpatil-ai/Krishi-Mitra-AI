import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getIrrigations, type Irrigation } from "@/services/irrigationApi"
import {
  AlertTriangle,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  Sprout,
  TrendingUp,
  Wheat,
} from "lucide-react"
import { useFarms } from "@/hooks/useFarm"
import { useQuery } from "@tanstack/react-query"
import { useCrops } from "@/hooks/useCrops"
import { useFarmWeather } from "@/hooks/useWeather"

const quickActions = [
  {
    title: "cropRecommendation",
    description: "findSuitableCrops",
    icon: Sprout,
    to: "/crops",
  },
  {
    title: "diseaseDetection",
    description: "analyzeCropDisease",
    icon: AlertTriangle,
    to: "/disease",
  },
  {
    title: "irrigationAdvisory",
    description: "getIrrigationRecommendations",
    icon: Droplets,
    to: "/irrigation",
  },
  {
    title: "marketPrices",
    description: "checkMarketInformation",
    icon: TrendingUp,
    to: "/market",
  },
]

function Dashboard() {
  const { t } = useTranslation()
  const { data: farms, isLoading: farmsLoading } = useFarms()
  const farm = farms?.[0]

  const { data: crops, isLoading: cropsLoading } = useCrops(farm?.id)
  const { data: weather, isLoading: weatherLoading } = useFarmWeather(farm?.id)
  const { data: irrigationRecords = [], isLoading: irrigationLoading } = useQuery({
    queryKey: ["irrigations", farm?.id],
    queryFn: () => getIrrigations(farm!.id),
    enabled: Boolean(farm?.id),
  })
  const activeCrops =
    crops?.filter((crop) => crop.status.toLowerCase() === "active") ?? []

  const farmArea = farm?.area_acres ?? 0
  const cropCount = activeCrops.length
  const latestIrrigation = irrigationRecords[0]

  const irrigation = latestIrrigation
    ? latestIrrigation.status
    : "Not configured"

  const location = [farm?.village, farm?.district, farm?.state]
    .filter(Boolean)
    .join(", ")

  const currentWeather = weather?.currentConditions
  const forecast = weather?.days?.slice(0, 5) ?? []

  const farmStats = [
    {
      label: t("farmArea"),
      value: farmsLoading ? "..." : String(farmArea),
      unit: t("acresUnit"),
      icon: Wheat,
    },
    {
      label: t("activeCrops"),
      value: cropsLoading ? "..." : String(cropCount),
      unit: t("cropsUnit"),
      icon: Sprout,
    },
    {
      label: t("irrigation"),
      value: farmsLoading ? "..." : irrigation,
      unit: t("status"),
      icon: Droplets,
    },
    {
      label: t("farmHealth"),
      value: farm ? t("good") : "—",
      unit: t("overall"),
      icon: Leaf,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section>
        <p className="text-sm font-medium text-primary">
          {t("agriculturalIntelligence")}
        </p>

        <div className="mt-1 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("goodMorningFarmer")}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {t("farmOverviewToday")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>{location || t("farmLocationNotConfigured")}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {farmStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.unit}
                    </span>
                  </div>
                </div>

                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CloudSun className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">{t("weatherOverview")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("weatherIntelligence")}
              </p>
            </div>
          </div>

          {weatherLoading ? (
            <div className="mt-6 rounded-lg bg-muted/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("loadingWeather")}
              </p>
            </div>
          ) : currentWeather ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-muted/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-4xl font-bold">
                      {currentWeather.temp}°C
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentWeather.conditions}
                    </p>
                  </div>

                  <CloudSun className="size-12 text-primary" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("humidity")}</p>
                    <p className="font-semibold">
                      {currentWeather.humidity}%
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">{t("rain")}</p>
                    <p className="font-semibold">
                      {currentWeather.precip} mm
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">{t("wind")}</p>
                    <p className="font-semibold">
                      {currentWeather.windspeed} km/h
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">{t("fiveDayForecast")}</p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {forecast.map((day) => (
                    <div
                      key={day.datetime}
                      className="rounded-lg border p-3 text-center"
                    >
                      <p className="text-xs text-muted-foreground">
                        {day.datetime.slice(5)}
                      </p>

                      <p className="mt-2 font-semibold">
                        {day.tempmax}° / {day.tempmin}°
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {day.precip} mm
                      </p>

                      <p className="mt-1 truncate text-xs">
                        {day.conditions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-lg bg-muted/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("weatherUnavailable")}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Leaf className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">{t("aiInsights")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("personalizedRecommendations")}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("askFarmAdvice")}
            </p>

            <Link
              to="/ai-assistant"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {t("openAiAssistant")}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-xl font-semibold">{t("quickActions")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("accessIntelligenceTools")}
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={t(action.title)}
                to={action.to}
                className="group rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-4 font-semibold">{t(action.title)}</h3>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {t(action.description)}
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Dashboard











