// src/server/repos/series.repo.ts
import { prisma } from '@/server/db';
import { Prisma } from '@prisma/client';

export async function listAllSeries() {
  return prisma.eventSeries.findMany({
    orderBy: { title: 'asc' },
  });
}

export async function getSeriesById(id: string) {
  return prisma.eventSeries.findUnique({
    where: { id },
  });
}

export async function getSeriesBySlug(slug: string) {
  return prisma.eventSeries.findUnique({
    where: { slug },
    include: {
      events: {
        include: {
          venue: true,
        },
      },
    },
  });
}

export async function createSeries(data: Prisma.EventSeriesCreateInput) {
  return prisma.eventSeries.create({ data });
}

export async function updateSeries(id: string, data: Prisma.EventSeriesUpdateInput) {
  return prisma.eventSeries.update({ where: { id }, data });
}

export async function deleteSeries(id: string) {
  return prisma.eventSeries.delete({ where: { id } });
}
