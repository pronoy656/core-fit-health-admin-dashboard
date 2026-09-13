export const mockMembership = {
  plans: [
    { id: "free", name: "Free Tier", price: 0, interval: "month", users: 8640, features: ["Basic tracking", "Standard articles", "Community access"] },
    { id: "premium", name: "Premium", price: 14.99, interval: "month", users: 2400, features: ["AI Coach", "Advanced Labs", "Meal Plans", "Premium articles"] },
    { id: "yearly", name: "Premium (Yearly)", price: 119.99, interval: "year", users: 1200, features: ["AI Coach", "Advanced Labs", "Meal Plans", "Premium articles", "2 months free"] },
    { id: "trial", name: "7-Day Trial", price: 0, interval: "week", users: 210, features: ["Full premium access"] }
  ],
  promoCodes: [
    { code: "SUMMER26", discount: "20%", uses: 342, expiry: "2026-08-31", status: "active" },
    { code: "NEWYEAR", discount: "50%", uses: 1250, expiry: "2026-01-31", status: "expired" },
    { code: "PODCAST10", discount: "10%", uses: 89, expiry: "2026-12-31", status: "active" },
  ],
  paymentHistory: [
    { id: "tx_001", user: "Atiq Rahman", amount: 119.99, plan: "Yearly", date: "2026-07-12", platform: "Stripe", status: "success" },
    { id: "tx_002", user: "Sarah Mitchell", amount: 14.99, plan: "Premium", date: "2026-07-11", platform: "Apple", status: "success" },
    { id: "tx_003", user: "Lucas Ferreira", amount: 14.99, plan: "Premium", date: "2026-07-11", platform: "Google", status: "failed" },
    { id: "tx_004", user: "Emily Chen", amount: 119.99, plan: "Yearly", date: "2026-07-10", platform: "Stripe", status: "success" },
    { id: "tx_005", user: "Peter Novak", amount: 14.99, plan: "Premium", date: "2026-07-09", platform: "Apple", status: "refunded" },
  ],
  failedPayments: [
    { id: "tx_003", user: "Lucas Ferreira", amount: 14.99, reason: "Card expired", date: "2026-07-11" },
    { id: "tx_006", user: "Nina Johansson", amount: 14.99, reason: "Insufficient funds", date: "2026-07-08" },
  ]
};
