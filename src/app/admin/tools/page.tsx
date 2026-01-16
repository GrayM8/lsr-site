"use client";

import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { getLeorgeGawrenceEnforcementUnitStatus, setLeorgeGawrenceEnforcementUnitStatus } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

      <main className="mx-auto max-w-6xl p-8">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">Misc. Tools</h1>

          <Button asChild>

            <Link href="/admin">Back to Admin Dashboard</Link>

          </Button>

        </div>

        <div className="mt-4">

          <div className="flex items-center space-x-2">

            <Switch id="leorge-gawrence-enforcement-unit" checked={enabled} onCheckedChange={handleToggle} />

            <label htmlFor="leorge-gawrence-enforcement-unit">Leorge Gawrence Enforcement Unit</label>

          </div>

        </div>

      </main>

    );

  }

  