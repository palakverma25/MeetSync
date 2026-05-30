import { prisma } from "@/lib/prisma";

/** Calendar-day bounds in local time for the given instant. */
export function calendarDayBounds(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function findEventWithSameTitleOnDate(title: string, date: Date) {
  const { start, end } = calendarDayBounds(date);
  return prisma.event.findFirst({
    where: {
      title: { equals: title.trim(), mode: "insensitive" },
      date: { gte: start, lte: end },
    },
    select: { id: true, title: true, venue: true, date: true },
  });
}
