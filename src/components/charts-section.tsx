"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const performanceData = [
  { month: "Jan", value: 2400 },
  { month: "Feb", value: 1398 },
  { month: "Mar", value: 9800 },
  { month: "Apr", value: 3908 },
  { month: "May", value: 4800 },
  { month: "Jun", value: 3800 },
  { month: "Jul", value: 4300 },
]

const trafficData = [
  { source: "Organic", visitors: 4000 },
  { source: "Direct", visitors: 3000 },
  { source: "Social", visitors: 2000 },
  { source: "Email", visitors: 2780 },
  { source: "Referral", visitors: 1890 },
]

// REVERTED: The 'color' property has been removed to use your original color logic.
const deviceData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 20 },
]

const chartConfig = {
  value: {
    label: "Performance",
    color: "hsl(var(--primary))",
  },
  visitors: {
    label: "Visitors",
    color: "hsl(var(--primary))",
  },
}

export function ChartsSection() {
  return (
    <div className="space-y-6">
      {/* Performance Over Time - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Monthly performance metrics for the current year</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickMargin={16}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, opacity: 0.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "var(--chart-dot)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "var(--chart-dot)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Traffic Sources and Device Breakdown - Split Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Visitor breakdown by traffic source</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                  <XAxis
                    dataKey="source"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--chart-bar-${(index % 5) + 1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>User sessions by device type</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {/* REVERTED: Using your original color logic */}
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--chart-bar-${(index % 5) + 1})`} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center flex-wrap gap-4 mt-4">
              {deviceData.map((entry, index) => (
                // THE BUILD ERROR FIX REMAINS HERE
                <div key={entry.name} className="flex items-center space-x-2">
                  {/* REVERTED: Using your original color logic */}
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--chart-bar-${(index % 5) + 1})` }} />
                  <span className="text-sm text-muted-foreground">
                    {/* FIX: Use 'name' and 'value' which exist in the data */}
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}