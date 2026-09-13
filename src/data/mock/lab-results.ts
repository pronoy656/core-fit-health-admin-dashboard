export const mockLabResults = {
  categories: [
    {
      id: "metabolic",
      name: "Metabolic",
      markers: [
        { id: "m_01", name: "Fasting Insulin", unit: "µIU/mL", optimalRange: "2-6", standardRange: "2.6-24.9", status: "active" },
        { id: "m_02", name: "Hemoglobin A1c", unit: "%", optimalRange: "4.8-5.3", standardRange: "4.0-5.6", status: "active" },
        { id: "m_03", name: "Fasting Glucose", unit: "mg/dL", optimalRange: "70-90", standardRange: "65-99", status: "active" },
      ]
    },
    {
      id: "lipids",
      name: "Lipids",
      markers: [
        { id: "l_01", name: "Triglycerides", unit: "mg/dL", optimalRange: "<80", standardRange: "<150", status: "active" },
        { id: "l_02", name: "HDL", unit: "mg/dL", optimalRange: "55-100", standardRange: ">40", status: "active" },
        { id: "l_03", name: "LDL", unit: "mg/dL", optimalRange: "<100", standardRange: "<130", status: "active" },
        { id: "l_04", name: "ApoB", unit: "mg/dL", optimalRange: "<80", standardRange: "<100", status: "active" },
      ]
    },
    {
      id: "inflammation",
      name: "Inflammation",
      markers: [
        { id: "i_01", name: "hs-CRP", unit: "mg/L", optimalRange: "<1", standardRange: "<3", status: "active" },
        { id: "i_02", name: "Ferritin", unit: "ng/mL", optimalRange: "30-300", standardRange: "15-150", status: "active" },
      ]
    },
    {
      id: "liver",
      name: "Liver",
      markers: [
        { id: "lv_01", name: "AST", unit: "U/L", optimalRange: "<20", standardRange: "10-40", status: "active" },
        { id: "lv_02", name: "ALT", unit: "U/L", optimalRange: "<17", standardRange: "7-56", status: "active" },
      ]
    },
    {
      id: "vitamins",
      name: "Vitamins",
      markers: [
        { id: "v_01", name: "Vitamin D", unit: "ng/mL", optimalRange: "40-80", standardRange: "20-50", status: "active" },
        { id: "v_02", name: "Vitamin B12", unit: "pg/mL", optimalRange: "400-900", standardRange: "232-1245", status: "active" },
      ]
    }
  ]
};
