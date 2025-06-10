export const POSITIONS = [
  "Top Management",
  "Division Head", 
  "Regional Manager",
  "Area Manager",
  "Supervisor",
  "Team Leader", 
  "All Star",
  "Star",
  "Member",
  "Training"
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