import { useEffect, useState } from "react"
import {
  Droplets,
  Edit3,
  LandPlot,
  MapPin,
  Save,
  Sprout,
  Tractor,
  Waves,
} from "lucide-react"
import { useFarms, useCreateFarm, useUpdateFarm } from "@/hooks/useFarm"
import { useTranslation } from "react-i18next"
import { useCrops } from "@/hooks/useCrops"



function MyFarm() {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    areaAcres: "",
    soilType: "",
    irrigationType: "",
    waterSource: "",
    village: "",
    taluka: "",
    district: "",
    state: "",
  })

  const {
    data: farms = [],
    isLoading,
    isError,
  } = useFarms()

  const farm = farms[0]
  const FARM_ID = farm?.id

  const updateFarmMutation = useUpdateFarm()
  const createFarmMutation = useCreateFarm()
  const { data: crops = [] } = useCrops(FARM_ID)
  const activeCrops = crops.filter((crop) => crop.status === "active")

  useEffect(() => {
    if (!farm) {
      setFormData({
        name: "",
        areaAcres: "",
        soilType: "",
        irrigationType: "",
        waterSource: "",
        village: "",
        taluka: "",
        district: "",
        state: "",
      })
      return
    }

    setFormData({
      name: farm.name,
      areaAcres: String(farm.area_acres),
      soilType: farm.soil_type ?? "",
      irrigationType: farm.irrigation_type ?? "",
      waterSource: farm.water_source ?? "",
      village: farm.village,
      taluka: farm.taluka,
      district: farm.district,
      state: farm.state,
    })
  }, [farm])

  const handleCreateFarm = async () => {
    try {
      await createFarmMutation.mutateAsync({
        name: formData.name,
        area_acres: Number(formData.areaAcres),
        village: formData.village,
        taluka: formData.taluka,
        district: formData.district,
        state: formData.state,
        soil_type: formData.soilType || undefined,
        irrigation_type: formData.irrigationType || undefined,
        water_source: formData.waterSource || undefined,
      })
    } catch (error) {
      console.error("Failed to create farm:", error)
    }
  }

  const handleSave = async () => {
    try {
      const updatedFarm = await updateFarmMutation.mutateAsync({
        farmId: FARM_ID,
        data: {
          name: formData.name,
          area_acres: Number(formData.areaAcres),
          village: formData.village,
          taluka: formData.taluka,
          district: formData.district,
          state: formData.state,
          soil_type: formData.soilType || undefined,
          irrigation_type: formData.irrigationType || undefined,
          water_source: formData.waterSource || undefined,
        },
      })

      setFormData({
        name: updatedFarm.name,
        areaAcres: String(updatedFarm.area_acres),
        soilType: updatedFarm.soil_type ?? "",
        irrigationType: updatedFarm.irrigation_type ?? "",
        waterSource: updatedFarm.water_source ?? "",
        village: updatedFarm.village,
        taluka: updatedFarm.taluka,
        district: updatedFarm.district,
        state: updatedFarm.state,
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update farm:", error)
    }
  }
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl py-10 text-center">
        <p className="text-muted-foreground">{t("loadingFarmInformation")}</p>
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <p className="text-sm font-medium text-primary">
            {t("farmManagement")}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {t("myFarm")}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create your farm profile to get personalized recommendations.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Create Your Farm</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Farm name"
              value={formData.name}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />

            <input
              type="number"
              placeholder="Area in acres"
              value={formData.areaAcres}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  areaAcres: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />

            <input
              type="text"
              placeholder="Village"
              value={formData.village}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  village: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />

            <input
              type="text"
              placeholder="Taluka"
              value={formData.taluka}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  taluka: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />

            <input
              type="text"
              placeholder="District"
              value={formData.district}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  district: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />

            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  state: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleCreateFarm}
            disabled={createFarmMutation.isPending}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {createFarmMutation.isPending ? "Creating..." : "Create Farm"}
          </button>
        </section>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl py-10 text-center">
        <p className="text-destructive">
          {t("unableToLoadFarmInformation")}
        </p>
      </div>
    )
  }



  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            {t("farmManagement")}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("myFarm")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("manageFarmInformation")}
          </p>
        </div>

        <button
          type="button"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {isEditing ? (
            <>
              <Save className="size-4" />
              {t("saveChanges")}
            </>
          ) : (
            <>
              <Edit3 className="size-4" />
              {t("editFarm")}
            </>
          )}
        </button>
      </section>

      {/* Farm overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("farmArea")}</p>
              <p className="mt-2 text-2xl font-bold">
                {farm?.area_acres ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">{t("acres")}</p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LandPlot className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("activeCrops")}</p>
              <p className="mt-2 text-2xl font-bold">{activeCrops.length}</p>
              <p className="text-sm text-muted-foreground">{t("crops")}</p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sprout className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("irrigation")}</p>
              <p className="mt-2 text-2xl font-bold">
                {farm?.irrigation_type ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">{t("type")}</p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Droplets className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("waterSource")}</p>
              <p className="mt-2 text-2xl font-bold">
                {farm?.water_source ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">{t("source")}</p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Waves className="size-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Farm details */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Basic information */}
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tractor className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">{t("farmInformation")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("basicFarmDetails")}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">{t("farmName")}</label>
              <input
                type="text"
                placeholder={t("enterFarmName")}
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("farmArea")}</label>
              <div className="relative mt-2">
                <input
                  type="number"
                  placeholder={t("enterArea")}
                  disabled={!isEditing}
                  value={formData.areaAcres}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      areaAcres: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 pr-16 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  acres
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t("soilType")}</label>
              <select
                disabled={!isEditing}
                value={formData.soilType}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    soilType: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  {t("selectSoilType")}
                </option>
                <option value="black">{t("blackSoil")}</option>
                <option value="alluvial">{t("alluvialSoil")}</option>
                <option value="red">{t("redSoil")}</option>
                <option value="laterite">{t("lateriteSoil")}</option>
                <option value="sandy">{t("sandySoil")}</option>
                <option value="loamy">{t("loamySoil")}</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">{t("irrigationType")}</label>
              <select
                disabled={!isEditing}
                value={formData.irrigationType}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    irrigationType: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  {t("selectIrrigationType")}
                </option>
                <option value="drip">{t("dripIrrigation")}</option>
                <option value="sprinkler">{t("sprinkler")}</option>
                <option value="flood">{t("floodIrrigation")}</option>
                <option value="rainfed">{t("rainfed")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">{t("farmLocation")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("locationUsedForIntelligence")}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">{t("village")}</label>
              <input
                type="text"
                placeholder={t("enterVillage")}
                disabled={!isEditing}
                value={formData.village}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    village: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("taluka")}</label>
              <input
                type="text"
                placeholder={t("enterTaluka")}
                disabled={!isEditing}
                value={formData.taluka}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    taluka: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("district")}</label>
              <input
                type="text"
                placeholder={t("enterDistrict")}
                disabled={!isEditing}
                value={formData.district}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    district: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("state")}</label>
              <input
                type="text"
                placeholder={t("enterState")}
                disabled={!isEditing}
                value={formData.state}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    state: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("waterSource")}</label>
              <select
                disabled={!isEditing}
                value={formData.waterSource}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    waterSource: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  {t("selectWaterSource")}
                </option>
                <option value="well">{t("well")}</option>
                <option value="borewell">{t("borewell")}</option>
                <option value="canal">{t("canal")}</option>
                <option value="river">{t("river")}</option>
                <option value="rainwater">{t("rainwater")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence connection */}
      <section className="rounded-xl border bg-primary/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="size-6" />
          </div>

          <div>
            <h2 className="font-semibold">{t("whyFarmProfileMatters")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {t("farmProfilePersonalization")}
              will be used to personalize weather alerts, crop
              recommendations, irrigation advice, fertilizer guidance,
              market insights, and AI recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyFarm

















