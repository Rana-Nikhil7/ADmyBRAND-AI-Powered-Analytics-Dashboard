// In src/lib/mock-data.ts

import { DashboardData } from "./types"; // Import the master type

// THE FIX: We apply the DashboardData type to our object.
// This forces our data to match the structure defined in types.ts.
export const dashboardData: DashboardData = {
  keyMetrics: [
    {
      id: 1,
      title: 'Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      icon: 'DollarSign',
    },
    {
      id: 2,
      title: 'Users',
      value: '2,350',
      change: '+180.1%',
      icon: 'User',
    },
    {
      id: 3,
      title: 'Conversions',
      value: '12,234',
      change: '+19%',
      icon: 'ShoppingCart',
    },
    {
      id: 4,
      title: 'Growth %',
      value: '573',
      change: '+201',
      icon: 'TrendingUp',
    },
  ],

  performanceOverTime: [
    { month: 'Jan', value: 2200 },
    { month: 'Feb', value: 9800 },
    { month: 'Mar', value: 10000 },
    { month: 'Apr', value: 4000 },
    { month: 'May', value: 5500 },
    { month: 'Jun', value: 4700 },
    { month: 'Jul', value: 4200 },
  ],

  trafficSources: [
    { source: 'Organic', visitors: 4300 },
    { source: 'Direct', visitors: 3300 },
    { source: 'Social', visitors: 2100 },
    { source: 'Email', visitors: 2900 },
    { source: 'Referral', visitors: 1900 },
  ],

  deviceBreakdown: [
    { device: 'Desktop', visitors: 45 },
    { device: 'Mobile', visitors: 35 },
    { device: 'Tablet', visitors: 20 },
  ],

  campaignPerformance: Array.from({ length: 50 }, (_, i) => {
    const statuses: ("Active" | "Paused" | "Completed")[] = ['Active', 'Paused', 'Completed'];
    const campaignNames = ['Summer Sale', 'Brand Awareness', 'Product Launch', 'Holiday Promo', 'Retargeting Push'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomName = campaignNames[Math.floor(Math.random() * campaignNames.length)] + ` ${i + 1}`;
    const randomSpend = (Math.random() * 5000 + 1000).toFixed(2);
    const randomROI = Math.floor(Math.random() * 500) + 50;

    const randomTimestamp = new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    );
    const formattedDate = randomTimestamp.toISOString().split('T')[0];

    return {
      id: i + 1,
      campaignName: randomName,
      status: randomStatus,
      spend: `$${randomSpend}`,
      roi: `${randomROI}%`,
      date: formattedDate,
    };
  }),
};