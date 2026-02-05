/**
 * Internal role codes stored in the database.
 *
 * Permission roles (control access):
 * - officer: Admin console access
 * - admin: Full system access
 *
 * Participation roles (display badges):
 * - lsc_driver: Lone Star Cup participant
 * - collegiate_driver: Collegiate series team member
 */
export type RoleCode = "officer" | "admin" | "lsc_driver" | "collegiate_driver"

export const ROLE_LABEL: Record<RoleCode, string> = {
  officer: "Officer",
  admin: "Admin",
  lsc_driver: "LSC Driver",
  collegiate_driver: "Collegiate Series",
}

/** Roles that grant admin console access */
export const ADMIN_ROLES: RoleCode[] = ["officer", "admin"]

/** Roles that are display-only (participation badges) */
export const PARTICIPATION_ROLES: RoleCode[] = ["lsc_driver", "collegiate_driver"]
