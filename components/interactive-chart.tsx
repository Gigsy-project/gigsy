"use client"

import { useState, useMemo } from "react"
import { cn, formatCurrency as formatGlobalCurrency } from "@/lib/utils" // Import global formatCurrency

interface ChartData {
  month: string
  shortMonth: string
  amount: number
  services: number
  avgRating: number
}

interface InteractiveChartProps {
  data: ChartData[]
}

export function InteractiveChart({ data }: InteractiveChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(data[0]?.shortMonth || "may") // Default to first month or fallback
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)

  const maxAmount = useMemo(() => {
    if (data.length === 0) return 0
    return Math.max(...data.map((d) => d.amount))
  }, [data])

  const selectedData = useMemo(() => {
    return data.find((d) => d.shortMonth === selectedMonth) || data[0] // Fallback to first item if not found
  }, [data, selectedMonth])

  const getBarHeight = (amount: number) => {
    if (maxAmount === 0) return 0 // Avoid division by zero
    return (amount / maxAmount) * 300 // 300px max height
  }

  const getBarColor = (monthShort: string) => {
    if (monthShort === selectedMonth) {
      return "bg-primary"
    }
    if (monthShort === hoveredMonth) {
      return "bg-primary/80"
    }
    return "bg-muted-foreground/20"
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{selectedData?.month || "N/A"}</h2>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground">Pagado</span>
          <span className="font-semibold text-lg">
            {selectedData ? formatGlobalCurrency(selectedData.amount) : "$0 CLP"}
          </span>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-[300px] flex flex-col justify-between text-xs text-muted-foreground">
          <span>{formatGlobalCurrency(maxAmount > 0 ? maxAmount * 1.0 : 150000)}</span>
          <span>{formatGlobalCurrency(maxAmount > 0 ? maxAmount * 0.66 : 100000)}</span>
          <span>{formatGlobalCurrency(maxAmount > 0 ? maxAmount * 0.33 : 50000)}</span>
          <span>{formatGlobalCurrency(0)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-20 relative">
          {" "}
          {/* Adjusted margin for Y-axis labels */}
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-t border-muted-foreground/10 h-0"></div>
            ))}
            <div className="border-t border-muted-foreground/10 h-0 absolute bottom-0 w-full"></div>{" "}
            {/* Ensure bottom line */}
          </div>
          {/* Bars */}
          <div className="flex items-end justify-between h-[300px] px-4">
            {data.map((item) => (
              <div
                key={item.shortMonth}
                className="flex flex-col items-center cursor-pointer group relative"
                onClick={() => setSelectedMonth(item.shortMonth)}
                onMouseEnter={() => setHoveredMonth(item.shortMonth)}
                onMouseLeave={() => setHoveredMonth(null)}
                role="button"
                tabIndex={0}
                aria-label={`Ver datos de ${item.month}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedMonth(item.shortMonth)
                }}
              >
                {/* Tooltip */}
                {hoveredMonth === item.shortMonth && (
                  <div className="absolute bottom-full mb-2 bg-background border rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                    <div className="text-sm font-medium">{item.month}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>Ingresos: {formatGlobalCurrency(item.amount)}</div>
                      <div>Servicios: {item.services}</div>
                      <div>Calificación: {item.avgRating}/5</div>
                    </div>
                  </div>
                )}

                {/* Bar */}
                <div
                  className={cn(
                    "w-12 rounded-t-md transition-all duration-200 group-hover:scale-105",
                    getBarColor(item.shortMonth),
                  )}
                  style={{ height: `${getBarHeight(item.amount)}px` }}
                  aria-hidden="true"
                />

                {/* Month label */}
                <div className="mt-3 relative">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full transition-all duration-200",
                      item.shortMonth === selectedMonth
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.shortMonth.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Servicios completados</div>
          <div className="text-3xl font-bold">{selectedData?.services || 0}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Calificación promedio</div>
          <div className="text-3xl font-bold">{selectedData?.avgRating || 0}</div>
        </div>
      </div>
    </div>
  )
}
