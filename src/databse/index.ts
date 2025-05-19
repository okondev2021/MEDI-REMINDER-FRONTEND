export const dummMedications = [
  {
    name: "Lisinopril",
    strength: "10mg",
    frequency: "Daily",
    schedule: "8:00 AM",
    instructions: "Take with water",
    status: true,
  },
  {
    name: "Metformin",
    strength: "500mg",
    frequency: "Twice daily",
    schedule: "8:00 AM, 8:00 PM",
    instructions: "Take with food",
    status: true,
  },
  {
    name: "Vitamin D",
    strength: "1000 IU",
    frequency: "Daily",
    schedule: "2:00 PM",
    instructions: "Take with food",
    status: false,
  },
];



export const dummDailySchedule = [
  {
    time: "08:00 AM",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        instructions: "Take with water",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        instructions: "Take with breakfast",
      },
    ],
  },
  {
    time: "02:00 PM",
    medications: [
      {
        name: "Vitamin D",
        dosage: "1000 IU",
        instructions: "Take with food",
      },
    ],
  },
  {
    time: "08:00 PM",
    medications: [
      {
        name: "Atorvastatin",
        dosage: "20mg",
        instructions: "Take with evening meal",
      },
    ],
  },
];

