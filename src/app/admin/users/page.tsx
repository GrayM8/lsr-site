import { prisma } from "@/server/db";
import { UsersConsole } from "@/components/admin/users-console";
import { requireOfficer } from "@/server/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    await requireOfficer();

    const [users, allRoles, allTiers] = await Promise.all([
        prisma.user.findMany({
            where: { status: { not: "deleted" } },
            include: {
                roles: { include: { role: true } },
                memberships: { include: { tier: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.role.findMany(),
        prisma.membershipTier.findMany(),
    ]);

    return (
        <div className="h-full">
            <UsersConsole
                initialUsers={users}
                allRoles={allRoles}
                allTiers={allTiers}
            />
        </div>
    );
}
