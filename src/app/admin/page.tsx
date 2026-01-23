import { AuditConsole } from "@/components/admin/audit-console";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | LSR",
};

export default function AdminPage() {
  return (
    <div className="h-full">
      <AuditConsole />
    </div>
  );
}