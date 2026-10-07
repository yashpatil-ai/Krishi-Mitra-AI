import { useEffect, useMemo, useState } from "react"
import {
  ExternalLink,
  FileText,
  Search,
  SlidersHorizontal,
  Sprout,
  Tractor,
  Droplets,
  Wheat,
  Users,
  ShieldCheck,
} from "lucide-react"

import { useTranslation } from "react-i18next"

import { getSchemes, type Scheme } from "@/services/schemeApi"

const iconMap: Record<string, typeof Sprout> = {
  "Income Support": Sprout,
  "Crop Insurance": ShieldCheck,
  Irrigation: Droplets,
  "Farm Mechanization": Tractor,
  "Crop Development": Wheat,
  "Farmer Development": Users,
}

function Schemes() {
  const { t } = useTranslation()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadSchemes = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getSchemes({
        search: search.trim() || undefined,
        category: category || undefined,
        level: level || undefined,
        state: "Maharashtra",
        active_only: true,
      })

      setSchemes(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("failedToLoadSchemes"),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadSchemes()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search, category, level])

  const categories = useMemo(
    () =>
      Array.from(new Set(schemes.map((scheme) => scheme.category))).sort(),
    [schemes],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("governmentSchemes")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find agricultural schemes, eligibility information and official
          application resources.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">{t("findScheme")}</h2>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchSchemes")}
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("allLevels")}</option>
            <option value="central">{t("central")}</option>
            <option value="state">{t("maharashtra")}</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          {t("loadingGovernmentSchemes")}
        </div>
      ) : schemes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">{t("noSchemesFound")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("tryAnotherSearch")}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{schemes.length}</span>{" "}
              active schemes
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {schemes.map((scheme) => {
              const Icon = iconMap[scheme.category] ?? FileText

              return (
                <div
                  key={scheme.id}
                  className="flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {scheme.level === "state" ? t("maharashtra") : t("central")}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {scheme.name}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {scheme.description}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        {t("category")}:
                      </span>{" "}
                      {scheme.category}
                    </p>

                    {scheme.target_beneficiaries && (
                      <p>
                        <span className="font-medium text-foreground">
                          {t("for")}:
                        </span>{" "}
                        {scheme.target_beneficiaries}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <p className="mb-3 text-xs text-muted-foreground">
                      {t("source")}: {scheme.source_name ?? t("governmentPortal")}
                    </p>

                    {scheme.official_url && (
                      <a
                        href={scheme.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        {t("visitOfficialPortal")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default Schemes
