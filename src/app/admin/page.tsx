import { AuditConsole } from "@/components/admin/audit-console";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | LSR",
};

export default function AdminPage() {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Admin Console</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={18} className="text-white/40 hover:text-white/80 transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-white p-3">
              <p className="font-bold mb-1 text-lsr-orange">Audit Console</p>
              <p className="text-xs text-white/80">
                A comprehensive log of all administrative actions. This ensures accountability and transparency for changes made by officers and admins.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AuditConsole />
    </div>
  );
}