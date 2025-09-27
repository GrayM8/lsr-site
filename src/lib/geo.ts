import { GeoJsonPoint } from "@/types";
import { Prisma } from "@prisma/client";

export function isGeoJsonPoint(geo: Prisma.JsonValue | null | undefined): geo is GeoJsonPoint {
  if (geo === null || typeof geo !== "object" || Array.isArray(geo)) {
    return false;
  }
  const point = geo as GeoJsonPoint;
  return point.type === "Point" && Array.isArray(point.coordinates) && point.coordinates.length === 2 && typeof point.coordinates[0] === "number" && typeof point.coordinates[1] === "number";
}
