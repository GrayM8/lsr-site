import { Switch } from "@/components/ui/switch";

export default function AdminToolsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Misc. Tools</h1>
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <Switch id="leorge-gawrence-enforcement-unit" />
          <label htmlFor="leorge-gawrence-enforcement-unit">Leorge Gawrence Enforcement Unit</label>
        </div>
      </div>
    </div>
  );
}