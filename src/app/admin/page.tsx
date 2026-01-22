import { AuditConsole } from "@/components/admin/audit-console";

export const metadata = {
  title: "Admin Console | LSR",
};

export default function AdminPage() {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-4">Admin Console</h1>
      <AuditConsole />
    </div>
  );
}