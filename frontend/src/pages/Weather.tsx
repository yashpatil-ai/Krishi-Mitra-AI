import {
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react"

import { useFarms } from "@/hooks/useFarm"
import { useFarmWeather } from "@/hooks/useWeather"
import { useTranslation } from "react-i18next"

function Weather() {
  const { t } = useTranslation()
  const { data: farms, isLoading: farmsLoading } = useFarms()
  const farm = farms?.[0]

  const {
    data: weather,
    isLoading: weatherLoading,
    error,
  } = useFarmWeather(farm?.id)

  if (farmsLoading || weatherLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("weather")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("liveWeatherInformation")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          {t("loadingWeatherInformation")}
        </div>
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("weather")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("liveWeatherInformation")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-10 text-center">
          <h2 className="font-semibold">{t("noFarmFound")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("addFarmForWeather")}
          </p>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("weather")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("liveWeatherInformation")}
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {t("weatherLoadFailed")}
        
        </div>
      </div>
    )
  }

  const current = weather.currentConditions

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("weather")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("liveWeatherFor")} {farm.name}.
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("currentConditions")}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {current.conditions}
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3">
            <CloudSun className="size-7 text-primary" />
            <div>
              <p className="text-3xl font-bold">
                {current.temp.toFixed(1)}°C
              </p>
              <p className="text-xs text-muted-foreground">
                {t("feelsLike")} {current.feelslike.toFixed(1)}°C
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <WeatherStat
            icon={Droplets}
            label={t("humidity")}
            value={`${current.humidity.toFixed(1)}%`}
          />

          <WeatherStat
            icon={CloudRain}
            label={t("rain")}
            value={`${current.precip.toFixed(1)} mm`}
          />

          <WeatherStat
            icon={Wind}
            label={t("wind")}
            value={`${current.windspeed.toFixed(1)} km/h`}
          />

          <WeatherStat
            icon={Thermometer}
            label={t("feelsLike")}
            value={`${current.feelslike.toFixed(1)}°C`}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Umbrella className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {t("fiveDayForecast")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("temperatureRainfallOutlook")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {weather.days.slice(0, 5).map((day) => (
            <div
              key={day.datetime}
              className="rounded-xl border bg-background p-4"
            >
              <p className="text-sm font-medium">
                {formatDate(day.datetime)}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Sun className="size-6 text-primary" />

                <div>
                  <p className="text-lg font-bold">
                    {day.tempmax.toFixed(1)}°C
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("low")} {day.tempmin.toFixed(1)}°C
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t("rain")}
                  </span>
                  <span className="font-medium">
                    {day.precip.toFixed(1)} mm
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {day.conditions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <Gauge className="size-5 text-primary" />
            <h2 className="font-semibold">
              {t("farmWeatherContext")}
            </h2>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("farm")}
              </span>
              <span className="font-medium">
                {farm.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("area")}
              </span>
              <span className="font-medium">
                {farm.area_acres} acres
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("irrigation")}
              </span>
              <span className="font-medium capitalize">
                {farm.irrigation_type ?? t("notSpecified")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-primary/5 p-6">
          <h2 className="font-semibold">
            {t("weatherBasedFarming")}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("weatherFarmingDescription")}
          
          </p>
        </div>
      </section>
    </div>
  )
}

interface WeatherStatProps {
  icon: typeof Droplets
  label: string
  value: string
}

function WeatherStat({
  icon: Icon,
  label,
  value,
}: WeatherStatProps) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">
          <Icon className="size-5 text-primary" />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    },
  )
}

export default Weather

















