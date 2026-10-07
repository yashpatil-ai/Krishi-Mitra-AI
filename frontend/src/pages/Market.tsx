import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { getMarketPrices, type MarketPrice } from "@/services/marketApi"


function Market() {
  const { t } = useTranslation()
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [commodity, setCommodity] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPrices = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getMarketPrices(
        commodity ? { commodity } : undefined,
      )

      setPrices(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load market prices",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrices()
  }, [])

  const commodities = useMemo(
    () => Array.from(new Set(prices.map((price) => price.commodity))).sort(),
    [prices],
  )

  const filteredPrices = commodity
    ? prices.filter(
        (price) => price.commodity.toLowerCase() === commodity.toLowerCase(),
      )
    : prices

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("market")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("marketDescription")}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{t("liveMandiPrices")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("latestWholesalePrices")}
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={commodity}
              onChange={(event) => setCommodity(event.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option value="">{t("allCommodities")}</option>
              {commodities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadPrices}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t("loadingMarketPrices")}
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t("noMarketPrices")}
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 font-medium">{t("commodity")}</th>
                  <th className="px-4 py-3 font-medium">{t("marketName")}</th>
                  <th className="px-4 py-3 font-medium">District</th>
                  <th className="px-4 py-3 font-medium">{t("minPrice")}</th>
                  <th className="px-4 py-3 font-medium">{t("maxPrice")}</th>
                  <th className="px-4 py-3 font-medium">{t("modalPrice")}</th>
                  <th className="px-4 py-3 font-medium">{t("arrivalDate")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredPrices.map((price) => (
                  <tr key={price.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-semibold">
                      {price.commodity}
                    </td>

                    <td className="px-4 py-3">
                      {price.market?.trim() || "—"}
                    </td>

                    <td className="px-4 py-3">
                      {price.district?.trim() || "—"}
                    </td>

                    <td className="px-4 py-3">
                      {price.min_price?.toLocaleString("en-IN") ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      {price.max_price?.toLocaleString("en-IN") ?? "—"}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {price.modal_price?.toLocaleString("en-IN") ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      {price.arrival_date
                        ? new Date(price.arrival_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
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

export default Market








