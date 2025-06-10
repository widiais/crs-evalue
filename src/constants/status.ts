export const RELATIONSHIP_STATUS = [
  "Atasan Langsung",
  "Rekan Kerja Setara", 
  "Bawahan",
  "Bagian Terkait",
  "Human Capital Development (HCD)"
] as const;

export type RelationshipStatus = typeof RELATIONSHIP_STATUS[number]; 