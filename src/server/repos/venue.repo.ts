// src/server/repos/venue.repo.ts
import { prisma } from '@/server/db';
import { Prisma } from '@prisma/client';

export async function listAllVenues() {
  return prisma.venue.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getVenueById(id: string) {
  return prisma.venue.findUnique({
    where: { id },
  });
}

export async function createVenue(data: Prisma.VenueCreateInput) {
  return prisma.venue.create({ data });
}

export async function updateVenue(id: string, data: Prisma.VenueUpdateInput) {
  return prisma.venue.update({ where: { id }, data });
}

export async function deleteVenue(id: string) {
  return prisma.venue.delete({ where: { id } });
}
