// In src/lib/types.ts

export interface Campaign {
    id: number;
    campaignName: string;
    status: "Active" | "Paused" | "Completed";
    spend: string;
    roi: string;
    date: string;
  }
  
  export interface KeyMetric {
    id: number;
    title: string;
    value: string;
    change: string;
    icon: string;
  }
  
  // This is the master type for your entire dashboard's data
  export interface DashboardData {
    keyMetrics: KeyMetric[];
    performanceOverTime: { month: string; value: number }[];
    trafficSources: { source: string; visitors: number }[];
    deviceBreakdown: { device: string; visitors: number }[];
    campaignPerformance: Campaign[];
  }