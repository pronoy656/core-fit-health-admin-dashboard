export const mockAnalytics = {
  overview: {
    totalUsers: { value: 12450, delta: 12 },
    activeUsers: { value: 9230, delta: 8 },
    paidUsers: { value: 3810, delta: 15 },
    mrr: { value: 48200, delta: 21 },
  },
  revenueTrend: [
    { month: "Jan", revenue: 38000 },
    { month: "Feb", revenue: 39500 },
    { month: "Mar", revenue: 41000 },
    { month: "Apr", revenue: 41500 },
    { month: "May", revenue: 43200 },
    { month: "Jun", revenue: 45000 },
    { month: "Jul", revenue: 48200 },
  ],
  planDistribution: [
    { plan: "Free", value: 8640, fill: "var(--color-chart-1)" },
    { plan: "Premium", value: 2400, fill: "var(--color-chart-2)" },
    { plan: "Yearly", value: 1200, fill: "var(--color-chart-3)" },
    { plan: "Trial", value: 210, fill: "var(--color-chart-4)" },
  ],
  userGrowth: [
    { week: "W1", new: 340, churned: 45 },
    { week: "W2", new: 410, churned: 50 },
    { week: "W3", new: 390, churned: 38 },
    { week: "W4", new: 460, churned: 42 },
  ],
  churnMetrics: {
    grossChurn: 4.2,
    netChurn: 1.8,
    logoChurn: 3.1,
    expansion: 2.4
  },
  cohortRetention: [
    { cohort: "Jan", m0: 100, m1: 85, m2: 78, m3: 72, m4: 68 },
    { cohort: "Feb", m0: 100, m1: 87, m2: 80, m3: 74, m4: 70 },
    { cohort: "Mar", m0: 100, m1: 84, m2: 76, m3: 70, m4: null },
    { cohort: "Apr", m0: 100, m1: 86, m2: 79, m3: null, m4: null },
    { cohort: "May", m0: 100, m1: 88, m2: null, m3: null, m4: null },
  ]
};
