export const USER_ROLES = ["admin", "assessor", "user"] as const;

export type UserRole = typeof USER_ROLES[number]; 