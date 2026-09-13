export const mockNotifications = {
  push: [
    { id: "pn_01", title: "Time to log your meal!", audience: "Active Users (Last 24h)", sent: 4500, clicked: 1200, date: "2026-07-12 12:00" },
    { id: "pn_02", title: "New workout available", audience: "Premium Users", sent: 2400, clicked: 850, date: "2026-07-11 08:00" },
    { id: "pn_03", title: "Weekly metabolic summary", audience: "All Users", sent: 12450, clicked: 6200, date: "2026-07-05 10:00" },
  ],
  email: [
    { id: "em_01", subject: "Welcome to Premium!", audience: "New Subscribers", sent: 15, openRate: "68%", ctr: "12%", status: "automated" },
    { id: "em_02", subject: "Your Monthly Health Report", audience: "Premium Users", sent: 2400, openRate: "54%", ctr: "21%", status: "sent" },
    { id: "em_03", subject: "We miss you - Special Offer", audience: "Inactive Users (30d+)", sent: 1200, openRate: "18%", ctr: "3%", status: "scheduled" },
  ]
};
