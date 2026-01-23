"use client";

import { useEffect, useState } from "react";
import { getLeorgeGawrenceEnforcementUnitStatus, setLeorgeGawrenceEnforcementUnitStatus } from "./actions";
import { Switch } from "@/components/ui/switch";
import { ToolsConsole, type Tool } from "@/components/admin/tools-console";
import { Bot } from "lucide-react";

export default function AdminToolsPage() {
  const [leorgeEnabled, setLeorgeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeorgeGawrenceEnforcementUnitStatus().then((val) => {
        setLeorgeEnabled(val);
        setLoading(false);
    });
  }, []);

  const handleToggle = async (checked: boolean) => {
    setLeorgeEnabled(checked); // Optimistic
    try {
        await setLeorgeGawrenceEnforcementUnitStatus(checked);
        
        // The Leorge Gawrence Enforcement Unit cannot be stopped.
        if (!checked) {
            setTimeout(() => {
                handleToggle(true);
            }, 1000);
        }
    } catch (err) {
        console.error(err);
        setLeorgeEnabled(!checked); // Revert
    }
  };

  const tools: Tool[] = [
    {
        id: "leorge-gawrence-enforcement-unit",
        name: "Leorge Gawrence Enforcement Unit",
        description: "Antagonize George",
        icon: <Bot size={16} />,
        component: (
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/40 uppercase w-6 text-right">
                    {loading ? "..." : (leorgeEnabled ? "ON" : "OFF")}
                </span>
                <Switch 
                    checked={leorgeEnabled} 
                    onCheckedChange={handleToggle} 
                    disabled={loading}
                    className="data-[state=checked]:bg-lsr-orange"
                />
            </div>
        )
    }
  ];

  return (
    <div className="h-full">
      <ToolsConsole tools={tools} />
    </div>
  );
}