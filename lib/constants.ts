export const BRAND = {
  name: "GymPulse",
  tagline: "Measure. Improve. Grow."
};

export const PRICING = [
  {
    name: "Starter",
    price: "R$197",
    cadence: "/month",
    note: "For small teams getting started.",
    features: ["CRM pipeline", "Lead capture", "Manual check-ins", "Basic reports"],
    highlight: false
  },
  {
    name: "Pro",
    price: "R$297",
    cadence: "/month",
    note: "Best for growth-focused gyms.",
    features: ["Everything in Starter", "Churn-risk alerts", "Retention automations", "Score v1", "Priority support"],
    highlight: true
  },
  {
    name: "Elite",
    price: "R$497",
    cadence: "/month",
    note: "For multi-location or premium operations.",
    features: ["Everything in Pro", "Advanced analytics", "Finance module", "Pulse AI (beta)", "Dedicated onboarding"],
    highlight: false
  }
];
