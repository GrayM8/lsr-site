"use client";

import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { getLeorgeGawrenceEnforcementUnitStatus, setLeorgeGawrenceEnforcementUnitStatus } from "./actions";

export default function AdminToolsPage() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    getLeorgeGawrenceEnforcementUnitStatus().then(setEnabled);
  }, []);

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    await setLeorgeGawrenceEnforcementUnitStatus(checked);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Misc. Tools</h1>
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <Switch id="leorge-gawrence-enforcement-unit" checked={enabled} onCheckedChange={handleToggle} />
          <label htmlFor="leorge-gawrence-enforcement-unit">Leorge Gawrence Enforcement Unit</label>
        </div>
      </div>
    </div>
  );
}