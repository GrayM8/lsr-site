import { getAllSeasons } from "@/server/queries/seasons";
import { SeasonsConsole } from "@/components/admin/seasons-console";

export default async function SeasonsAdminPage() {
  const seasons = await getAllSeasons();

  return (
    <div className="h-full">
      <SeasonsConsole initialSeasons={seasons} />
    </div>
  );
}