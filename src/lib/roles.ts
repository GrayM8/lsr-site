export type RoleCode = "member" | "competition" | "officer" | "president" | "alumni" | "admin"

export const ROLE_LABEL: Record<RoleCode, string> = {
  member: "Member",
  competition: "Competition Team",
  officer: "Officer",
  president: "President",
  alumni: "Alumni",
  admin: "Admin",
}
