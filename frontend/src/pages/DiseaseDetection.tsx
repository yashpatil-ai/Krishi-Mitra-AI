import { useState } from "react"
import { useTranslation } from "react-i18next"
import { detectDisease, type DiseaseDetectionResponse } from "@/services/diseaseDetectionApi"

function formatDiseaseName(disease: string) {
  const names: Record<string, string> = {
    "Apple___Apple_scab": "Apple Scab",
    "Orange___Haunglongbing_(Citrus_greening)": "Citrus Greening (Huanglongbing)",
  }

  return names[disease] ?? disease.replaceAll("___", " - ").replaceAll("_", " ")
}

function DiseaseDetection() {
  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<DiseaseDetectionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setError(t("selectImageFile"))
      return
    }

    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  async function handleDetect() {
    if (!selectedImage) {
      setError(t("selectLeafImageFirst"))
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const prediction = await detectDisease(selectedImage)
      setResult(prediction)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("diseaseDetectionFailed"),
      )
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setSelectedImage(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("diseaseDetection")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("uploadLeafImage")}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="leaf-image"
              className="mb-2 block text-sm font-medium"
            >
              Leaf Image
            </label>

            <input
              id="leaf-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-lg border p-3 text-sm"
            />
          </div>

          {previewUrl && (
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt={t("selectedCropLeaf")}
                className="max-h-80 rounded-xl border object-contain"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDetect}
              disabled={!selectedImage || loading}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t("analyzing") : t("detectDisease")}
            </button>

            {selectedImage && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border px-5 py-2.5 text-sm font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-xl border bg-muted/30 p-5">
              <p className="text-sm text-muted-foreground">
                {t("aiDetectionResult")}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {formatDiseaseName(result.disease)}
              </h2>

              <p className="mt-2 text-sm">
                {t("confidence")}{" "}
                <span className="font-semibold">
                  {(result.confidence * 100).toFixed(2)}%
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiseaseDetection
