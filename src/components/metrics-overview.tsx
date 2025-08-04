"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Target, TrendingUp, LucideIcon } from "lucide-react"

// CHANGE 1: Import the 'KeyMetric' type from your central types file.
import { KeyMetric } from "@/lib/types";

// A mapping to dynamically select an icon component based on the string from your data
const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  User: Users, // Added 'User' as a possible key
  Users,
  ShoppingCart: Target, // Mapped ShoppingCart to Target icon
  Target,
  TrendingUp,
};

// CHANGE 2: Define a dedicated interface for the component's props for clarity.
interface MetricsOverviewProps {
  metrics: KeyMetric[];
}

// CHANGE 3: Use the new interface to type the props, replacing 'any[]'.
export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        // The 'metric' object is now correctly typed as 'KeyMetric'.
        const Icon = iconMap[metric.icon] || DollarSign;
        return (
          <motion.div
            key={metric.id} // Using the unique 'id' is the best practice for the key.
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}