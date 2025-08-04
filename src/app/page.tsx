"use client"

import { useEffect, useState, useMemo } from "react";
import { dashboardData as mockData } from "@/lib/mock-data"; // Import your mock data
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
  // State to hold your data
  const [data, setData] = useState(null);
  // State to manage loading
  const [isLoading, setIsLoading] = useState(true);
  // State to manage the selected date range
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  useEffect(() => {
    // Simulate a network request to fetch data
    const timer = setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1500); // 1.5-second delay

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // This is the new useEffect hook for real-time updates
  useEffect(() => {
    // Only run this interval if data is loaded
    if (data) {
      const interval = setInterval(() => {
        // Update the state with new data
        setData((prevData) => {
          // Find the "Users" metric
          const newMetrics = prevData.keyMetrics.map(metric => {
            if (metric.title === 'Users') {
              // Add a random number between -5 and 10 to the current value
              const currentValue = parseInt(metric.value.replace(/,/g, ''));
              const newValue = currentValue + Math.floor(Math.random() * 15) - 5;
              return { ...metric, value: newValue.toLocaleString() };
            }
            return metric;
          });

          // Return the new state object
          return { ...prevData, keyMetrics: newMetrics };
        });
      }, 3000); // Update every 3 seconds

      // IMPORTANT: Clear the interval when the component unmounts to prevent memory leaks
      return () => clearInterval(interval);
    }
  }, [data]); // The effect re-runs if the `data` object changes

  // Filter campaigns by date range
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

  if (isLoading) {
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
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 w-full bg-muted rounded-lg animate-pulse" />
              ))
            ) : (
              <MetricsOverview metrics={data.keyMetrics} />
            )}
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
