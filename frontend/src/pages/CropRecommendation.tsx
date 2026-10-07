import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useFarms } from "@/hooks/useFarm"
import {
  useCreateCrop,
  useCrops,
  useDeleteCrop,
  useUpdateCrop,
} from "@/hooks/useCrops"
import { useCropRecommendation } from "@/hooks/useCropRecommendation"

// const FARM_ID = 1

interface CropFormData {
  name: string
  variety: string
  area_acres: string
  sowing_date: string
  expected_harvest_date: string
  season: string
}

interface RecommendationFormData {
  nitrogen: string
  phosphorus: string
  potassium: string
  temperature: string
  humidity: string
  ph: string
  rainfall: string
}

const initialFormData: CropFormData = {
  name: "",
  variety: "",
  area_acres: "",
  sowing_date: "",
  expected_harvest_date: "",
  season: "",
}

const initialRecommendationData: RecommendationFormData = {
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
}

function CropRecommendation() {
  const { t } = useTranslation()

  const { data: farms = [] } = useFarms()
  const farm = farms[0]
  const FARM_ID = farm?.id
  const {
    data: crops,
    isLoading,
    isError,
  } = useCrops(FARM_ID)

  const createCropMutation = useCreateCrop()
  const deleteCropMutation = useDeleteCrop()
  const updateCropMutation = useUpdateCrop()
  const recommendationMutation = useCropRecommendation()

  const [formData, setFormData] =
    useState<CropFormData>(initialFormData)

  const [recommendationData, setRecommendationData] =
    useState<RecommendationFormData>(initialRecommendationData)

  const [recommendation, setRecommendation] =
    useState<string | null>(null)

  const [recommendationError, setRecommendationError] =
    useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)
  const [editingCropId, setEditingCropId] = useState<number | null>(null)

  const handleChange = (
    field: keyof CropFormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleRecommendationChange = (
    field: keyof RecommendationFormData,
    value: string,
  ) => {
    setRecommendationData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleGetRecommendation = async () => {
    setRecommendation(null)
    setRecommendationError(null)

    try {
      const result = await recommendationMutation.mutateAsync({
        nitrogen: Number(recommendationData.nitrogen),
        phosphorus: Number(recommendationData.phosphorus),
        potassium: Number(recommendationData.potassium),
        temperature: Number(recommendationData.temperature),
        humidity: Number(recommendationData.humidity),
        ph: Number(recommendationData.ph),
        rainfall: Number(recommendationData.rainfall),
      })

      setRecommendation(result.recommended_crop)
    } catch (error) {
      console.error("Failed to get crop recommendation:", error)
      setRecommendationError(
        t("unableToGetRecommendation"),
      )
    }
  }

  const handleAddCrop = async () => {
    if (!formData.name.trim() || !formData.area_acres) {
      return
    }

    try {
      const cropData = {
        name: formData.name.trim(),
        variety: formData.variety.trim() || undefined,
        area_acres: Number(formData.area_acres),
        sowing_date: formData.sowing_date || undefined,
        expected_harvest_date:
          formData.expected_harvest_date || undefined,
        season: formData.season || undefined,
      }

      if (editingCropId !== null) {
        await updateCropMutation.mutateAsync({
          farmId: FARM_ID,
          cropId: editingCropId,
          data: cropData,
        })
      } else {
        await createCropMutation.mutateAsync({
          farmId: FARM_ID,
          data: cropData,
        })
      }

      setFormData(initialFormData)
      setIsAdding(false)
      setEditingCropId(null)
    } catch (error) {
      console.error("Failed to save crop:", error)
    }
  }

  const handleEditCrop = (cropId: number) => {
    const crop = crops?.find((item) => item.id === cropId)

    if (!crop) {
      return
    }

    setFormData({
      name: crop.name,
      variety: crop.variety ?? "",
      area_acres: String(crop.area_acres),
      sowing_date: crop.sowing_date ?? "",
      expected_harvest_date:
        crop.expected_harvest_date ?? "",
      season: crop.season ?? "",
    })

    setEditingCropId(cropId)
    setIsAdding(false)
  }

  const handleDeleteCrop = async (cropId: number) => {
    try {
      await deleteCropMutation.mutateAsync({
        farmId: FARM_ID,
        cropId,
      })
    } catch (error) {
      console.error("Failed to delete crop:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl py-10 text-center">
        <p className="text-muted-foreground">
          {t("loadingCrops")}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl py-10 text-center">
        <p className="text-destructive">
          {t("unableToLoadCrops")}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("cropRecommendation")}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {t("manageCropsAndRecommendations")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding((current) => !current)
            setEditingCropId(null)
            setFormData(initialFormData)
          }}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
        >
          {isAdding ? t("cancel") : `+ ${t("addCrop")}`}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">
          {t("aiCropRecommendation")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("enterSoilWeatherValues")}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["nitrogen", t("nitrogen")],
              ["phosphorus", t("phosphorus")],
              ["potassium", t("potassium")],
              ["temperature", t("temperatureC")],
              ["humidity", `${t("humidity")} (%)`],
              ["ph", t("soilPh")],
              ["rainfall", `${t("rainfall")} (mm)`],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="text-sm font-medium">
                {label}
              </label>

              <input
                type="number"
                step="any"
                value={recommendationData[field]}
                onChange={(event) =>
                  handleRecommendationChange(
                    field,
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleGetRecommendation}
            disabled={
              recommendationMutation.isPending ||
              Object.values(recommendationData).some(
                (value) => !value,
              )
            }
            className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recommendationMutation.isPending
              ? t("analyzing")
              : t("getRecommendation")}
          </button>

          {recommendation && (
            <div className="rounded-lg border bg-muted px-5 py-3">
              <span className="text-sm text-muted-foreground">
                {t("recommendedCrop")}
              </span>

              <p className="text-xl font-bold capitalize">
                {recommendation}
              </p>
            </div>
          )}

          {recommendationError && (
            <p className="text-sm text-destructive">
              {recommendationError}
            </p>
          )}
        </div>
      </div>

      {(isAdding || editingCropId !== null) && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            {editingCropId !== null ? t("editCrop") : t("addCrop")}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                {t("cropNameRequired")}
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                placeholder={t("enterCropNameExample")}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Variety
              </label>

              <input
                type="text"
                value={formData.variety}
                onChange={(event) =>
                  handleChange("variety", event.target.value)
                }
                placeholder={t("enterVarietyExample")}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                {t("areaAcresRequired")}
              </label>

              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.area_acres}
                onChange={(event) =>
                  handleChange(
                    "area_acres",
                    event.target.value,
                  )
                }
                placeholder={t("enterAreaExample")}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Season
              </label>

              <select
                value={formData.season}
                onChange={(event) =>
                  handleChange("season", event.target.value)
                }
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t("selectSeason")}</option>
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Sowing Date
              </label>

              <input
                type="date"
                value={formData.sowing_date}
                onChange={(event) =>
                  handleChange(
                    "sowing_date",
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Expected Harvest Date
              </label>

              <input
                type="date"
                value={formData.expected_harvest_date}
                onChange={(event) =>
                  handleChange(
                    "expected_harvest_date",
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleAddCrop}
              disabled={
                createCropMutation.isPending ||
                updateCropMutation.isPending ||
                !formData.name.trim() ||
                !formData.area_acres
              }
              className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createCropMutation.isPending ||
              updateCropMutation.isPending
                ? t("saving")
                : editingCropId !== null
                  ? t("updateCrop")
                  : t("saveCrop")}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">
          {t("currentCrops")}
        </h2>

        {crops && crops.length > 0 ? (
          <div className="mt-4 space-y-3">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {crop.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {crop.variety ||
                        t("noVarietySpecified")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditCrop(crop.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      {t("edit")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCrop(crop.id)}
                      disabled={deleteCropMutation.isPending}
                      className="text-sm text-destructive hover:underline"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <p>
                    <span className="text-muted-foreground">
                      {t("cropsArea")}
                    </span>{" "}
                    {crop.area_acres} {t("acresLabel")}
                  </p>

                  <p>
                    <span className="text-muted-foreground">
                      {t("cropsSeason")}
                    </span>{" "}
                    {crop.season || "—"}
                  </p>

                  <p>
                    <span className="text-muted-foreground">
                      {t("cropsSowing")}
                    </span>{" "}
                    {crop.sowing_date || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            {t("noCropsAdded")}
          </p>
        )}
      </div>
    </div>
  )
}

export default CropRecommendation
