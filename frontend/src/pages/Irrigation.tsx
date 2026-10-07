import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { getIrrigations, recommendIrrigation, type Irrigation as IrrigationRecord } from "@/services/irrigationApi"
import { useFarms } from "@/hooks/useFarm"
import { useCrops } from "@/hooks/useCrops"

function Irrigation() {
  const { t } = useTranslation()
  const { data: farms, isLoading: farmsLoading } = useFarms()
  const farm = farms?.[0]
  const farmId = farm?.id

  const { data: crops, isLoading: cropsLoading } = useCrops(farmId)
  const activeCrop = crops?.find((crop) => crop.status?.toLowerCase() === "active") ?? crops?.[0]

  const [records, setRecords] = useState<IrrigationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadIrrigations = async () => {
    if (!farmId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getIrrigations(farmId)
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedLoadIrrigation"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIrrigations()
  }, [farmId])

  const handleRecommendation = async () => {
    if (!farmId || !activeCrop) return

    try {
      setRecommendationLoading(true)
      setError(null)

      await recommendIrrigation(farmId, activeCrop.id)
      await loadIrrigations()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("failedGenerateIrrigation"),
      )
    } finally {
      setRecommendationLoading(false)
    }
  }

  const latest = records[0]

  if (farmsLoading || cropsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("irrigation")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("manageIrrigationRecommendations")}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">
          {t("loadingIrrigationData")}
        </div>
      </div>
    )
  }

  if (!farmId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("irrigation")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("manageIrrigationRecommendations")}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">{t("noFarmFoundIrrigation")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("addFarmForIrrigation")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("irrigation")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("irrigationDescription")}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{t("farm")}</p>
          <p className="mt-2 text-xl font-semibold">{farm?.name ?? t("farm")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {farm?.area_acres ?? "-"} acres
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{t("activeCrop")}</p>
          <p className="mt-2 text-xl font-semibold capitalize">
            {activeCrop?.name ?? t("noActiveCrop")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCrop?.area_acres ?? "-"} acres
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{t("latestWaterRequirement")}</p>
          <p className="mt-2 text-xl font-semibold">
            {latest ? `${latest.water_required_liters.toFixed(2)} L` : "�"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {latest?.status ?? t("noRecommendationYet")}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{t("aiIrrigationRecommendation")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("generateRecommendationDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRecommendation}
            disabled={!activeCrop || recommendationLoading}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recommendationLoading ? t("generating") : t("generateRecommendation")}
          </button>
        </div>

        {latest && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">{t("waterRequired")}</p>
              <p className="mt-1 text-lg font-semibold">
                {latest.water_required_liters.toFixed(2)} L
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">{t("irrigationDate")}</p>
              <p className="mt-1 text-lg font-semibold">
                {new Date(latest.irrigation_date).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">{t("method")}</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {latest.method ?? farm?.irrigation_type ?? t("recommended")}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">{t("source")}</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {latest.source}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{t("irrigationHistory")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("previousIrrigationRecords")}
            </p>
          </div>

          {loading && (
            <span className="text-sm text-muted-foreground">{t("refreshing")}</span>
          )}
        </div>

        {records.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t("noIrrigationRecords")}
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 font-medium">{t("date")}</th>
                  <th className="px-4 py-3 font-medium">{t("water")}</th>
                  <th className="px-4 py-3 font-medium">{t("duration")}</th>
                  <th className="px-4 py-3 font-medium">{t("method")}</th>
                  <th className="px-4 py-3 font-medium">{t("status")}</th>
                  <th className="px-4 py-3 font-medium">{t("source")}</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {new Date(record.irrigation_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {record.water_required_liters.toFixed(2)} L
                    </td>
                    <td className="px-4 py-3">
                      {record.duration_minutes
                        ? `${record.duration_minutes} min`
                        : "�"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {record.method ?? "�"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {record.status}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {record.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Irrigation
