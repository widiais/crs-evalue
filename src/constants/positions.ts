export const POSITIONS = [
  "Magang",
  "Training",
  "Member",
  "Star",
  "All Star",
  "Team Leader 1",
  "Team Leader 2",
  "Junior Supervisor",
  "Middle Supervisor",
  "Senior Supervisor",
  "Junior Manager",
  "Middle Manager",
  "Senior Manager",
  "Regional Manager",
  "Division Head"
] as const;

export type Position = typeof POSITIONS[number];

export const DIVISIONS = [
  "HRD",
  "Finance",
  "Operations", 
  "Marketing",
  "IT",
  "Quality Assurance",
  "Procurement",
  "Legal"
] as const;

export type Division = typeof DIVISIONS[number]; 