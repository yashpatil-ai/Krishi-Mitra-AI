import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useFertilizerRecommendation } from "@/hooks/useFertilizerRecommendation"

interface FertilizerFormData {
  crop: string
  nitrogen: string
  phosphorus: string
  potassium: string
  ph: string
}

const initialFormData: FertilizerFormData = {
  crop: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  ph: "",
}

function Fertilizer() {
  const { t } = useTranslation()
  const recommendationMutation = useFertilizerRecommendation()

  const [formData, setFormData] =
    useState<FertilizerFormData>(initialFormData)

  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    field: keyof FertilizerFormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setError(null)

    if (
      !formData.crop.trim() ||
      !formData.nitrogen ||
      !formData.phosphorus ||
      !formData.potassium ||
      !formData.ph
    ) {
      setError(t("pleaseFillAllFields"))
      return
    }

    try {
      await recommendationMutation.mutateAsync({
        crop: formData.crop.trim(),
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        ph: Number(formData.ph),
      })
    } catch (error) {
      console.error("Failed to get fertilizer recommendation:", error)

      try {
        const parsed = JSON.parse(
          error instanceof Error ? error.message : "",
        )

        setError(parsed.detail ?? t("unableToGetRecommendation"))
      } catch {
        setError(
          t("unableToGetFertilizerRecommendation"),
        )
      }
    }
  }

  const recommendation = recommendationMutation.data

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("fertilizerRecommendation")}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Compare your soil nutrient levels with the reference
          requirements for your selected crop.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">
          {t("soilCropDetails")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("enterSoilTestValues")}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-sm font-medium">
              Crop
            </label>

            <input
              type="text"
              value={formData.crop}
              onChange={(event) =>
                handleChange("crop", event.target.value)
              }
              placeholder={t("riceExample")}
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {(
            [
              ["nitrogen", t("nitrogen")],
              ["phosphorus", t("phosphorus")],
              ["potassium", t("potassium")],
              ["ph", "Soil pH"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="text-sm font-medium">
                {label}
              </label>

              <input
                type="number"
                step="any"
                min="0"
                max={field === "ph" ? "14" : undefined}
                value={formData[field]}
                onChange={(event) =>
                  handleChange(field, event.target.value)
                }
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={recommendationMutation.isPending}
          className="mt-5 rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {recommendationMutation.isPending
            ? t("analyzing")
            : t("getRecommendation")}
        </button>
      </div>

      {recommendation && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Recommendation
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("referenceComparisonFor")} {recommendation.crop}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Nitrogen
              </p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.nitrogen_status}
              </p>
              <p className="mt-1 text-sm">
                {t("reference")}: {recommendation.nitrogen_required}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Phosphorus
              </p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.phosphorus_status}
              </p>
              <p className="mt-1 text-sm">
                {t("reference")}: {recommendation.phosphorus_required}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Potassium
              </p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.potassium_status}
              </p>
              <p className="mt-1 text-sm">
                {t("reference")}: {recommendation.potassium_required}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Soil pH
              </p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.ph_status}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="font-semibold">
              Recommendations
            </h3>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {recommendation.recommendations.map(
                (item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fertilizer
