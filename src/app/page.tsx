"use client"

import { useEffect, useState, useMemo } from "react";
import { dashboardData as mockData } from "@/lib/mock-data";

// Import your master data type from your types file
import { DashboardData } from "@/lib/types";

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { ChartsSection } from "@/components/charts-section"
import { CampaignTable } from "@/components/campaign-table"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { DateRangePicker } from "@/components/date-range-picker";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
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
  // THE FIX: Explicitly type the state to allow 'DashboardData' or 'null'
  const [data, setData] = useState<DashboardData | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  // Using 'undefined' is often safer for date pickers
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });

  useEffect(() => {
    const timer = setTimeout(() => {
      // This is now allowed because we typed the state correctly
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
    if (!dateRange.from || !dateRange.to) return data.campaignPerformance;

    return data.campaignPerformance.filter(campaign => {
      const campaignDate = new Date(campaign.date);
      const from = new Date(dateRange.from!);
      from.setHours(0,0,0,0);
      const to = new Date(dateRange.to!);
      to.setHours(23,59,59,999);
      return campaignDate >= from && campaignDate <= to;
    });
  }, [data, dateRange]);

  // Added '!data' check for robustness while data is null
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

          <motion.div variants={itemVariants}>
            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            <CampaignTable data={filteredCampaigns} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}