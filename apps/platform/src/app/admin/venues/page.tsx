import { getAllVenues } from "@/server/queries/venue";
import { VenuesConsole } from "@/components/admin/venues-console";

export default async function VenuesAdminPage() {
  const venues = await getAllVenues();

  return (
    <div className="h-full">
      <VenuesConsole initialVenues={venues} />
    </div>
  );
}