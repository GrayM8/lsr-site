export type RoleCode = "member" | "competition" | "officer" | "president" | "alumni"

export const ROLE_LABEL: Record<RoleCode, string> = {
  member: "Member",
  competition: "Competition Team",
  officer: "Officer",
  president: "President",
  alumni: "Alumni",
}
