"use client"

import { useEffect, useState, useMemo } from "react";
import { dashboardData as mockData } from "@/lib/mock-data";
import { motion, Variants } from "framer-motion"
import { DashboardData } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { ChartsSection } from "@/components/charts-section"
import { CampaignTable } from "@/components/campaign-table"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        setData((prevData) => {
          if (!prevData) return null;
          const newMetrics = prevData.keyMetrics.map(metric => {
            if (metric.title === 'Users') {
              const currentValue = parseInt(metric.value.replace(/,/g, ''));
              const newValue = currentValue + Math.floor(Math.random() * 15) - 5;
              return { ...metric, value: newValue.toLocaleString() };
            }
            return metric;
          });
          return { ...prevData, keyMetrics: newMetrics };
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [data]);

  const filteredCampaigns = useMemo(() => {
    if (!data) return [];
    if (!dateRange?.from || !dateRange?.to) return data.campaignPerformance;

    return data.campaignPerformance.filter(campaign => {
      const campaignDate = new Date(campaign.date);
      const from = new Date(dateRange.from!);
      from.setHours(0,0,0,0);
      const to = new Date(dateRange.to!);
      to.setHours(23,59,59,999);
      return campaignDate >= from && campaignDate <= to;
    });
  }, [data, dateRange]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants}>
            <MetricsOverview metrics={data.keyMetrics} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ChartsSection />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {/* THE FINAL FIX: Changed prop names to 'date' and 'onSelect' */}
            <DateRangePicker date={dateRange} onSelect={setDateRange} />
            <CampaignTable data={filteredCampaigns} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}