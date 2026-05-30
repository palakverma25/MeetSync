import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: Request, { params }: Params) {
  const auth = await requireApiAuth(req);
  if (auth.response) return auth.response;

  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const rows = await prisma.attendee.findMany({
    where: { eventId, checkedInAt: { not: null } },
    orderBy: { name: "asc" },
  });

  const header = ["name", "phone", "email", "dietaryPreference", "hasPlusOne", "checkedInAt"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        csvEscape(r.name),
        csvEscape(r.phone),
        csvEscape(r.email ?? ""),
        csvEscape(r.dietaryPreference),
        r.hasPlusOne ? "yes" : "no",
        csvEscape(r.checkedInAt!.toISOString()),
      ].join(","),
    ),
  ];

  const csv = lines.join("\n");
  const safeTitle = event.title.replace(/[^\w\s-]/g, "").slice(0, 40).trim() || "event";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeTitle}-checked-in.csv"`,
    },
  });
}
