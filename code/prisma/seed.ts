import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const firstNames = [
  "Aisha", "Ben", "Chen", "Dana", "Elias", "Fatima", "Gabe", "Hannah", "Ivan",
  "Jules", "Kim", "Leo", "Maya", "Noor", "Omar", "Priya", "Quinn", "Ravi",
  "Sofia", "Tom", "Uma", "Vik", "Wren", "Xia", "Yuki", "Zara", "Alex", "Blair",
  "Casey", "Drew", "Ellis", "Finley", "Gray", "Harper", "Indigo", "Jordan",
  "Kai", "Logan", "Morgan", "Nico", "Rowan", "Skyler", "Taylor",
];

function phone(i: number) {
  return `+1555000${String(1000 + i).slice(-4)}`;
}

async function main() {
  await prisma.attendee.deleteMany();
  await prisma.event.deleteMany();

  await prisma.event.create({
    data: {
      title: "Summer Garden Gala",
      venue: "Riverside Conservatory",
      date: new Date("2026-06-14T18:00:00Z"),
      capacity: 120,
      attendees: {
        create: firstNames.slice(0, 18).map((name, i) => ({
          name,
          phone: phone(i),
          email: i < 2 ? `demo-rsvp-${i}@example.com` : null,
          dietaryPreference: i % 5 === 0 ? "Vegetarian" : i % 7 === 0 ? "No nuts" : "",
          hasPlusOne: i % 4 === 0,
          rsvpStatus: i === 3 ? "declined" : i === 5 ? "pending" : "confirmed",
          checkedInAt:
            i !== 3 && i !== 5 && i < 12
              ? new Date(`2026-06-14T${17 + (i % 3)}:${10 + i}:00Z`)
              : null,
        })),
      },
    },
  });

  await prisma.event.create({
    data: {
      title: "Quarterly Tech Mixer",
      venue: "Downtown Hub, Floor 3",
      date: new Date("2026-07-02T17:30:00Z"),
      capacity: 80,
      attendees: {
        create: firstNames.slice(18, 34).map((name, i) => {
          const idx = 18 + i;
          return {
            name,
            phone: phone(idx),
            dietaryPreference: i % 6 === 0 ? "Vegan" : "",
            hasPlusOne: i % 5 === 0,
            rsvpStatus: "confirmed",
            checkedInAt:
              i < 10 ? new Date(`2026-07-02T17:${35 + (i % 20)}:00Z`) : null,
          };
        }),
      },
    },
  });

  await prisma.event.create({
    data: {
      title: "Lighting Workshop",
      venue: "Northside Studio",
      date: new Date("2026-08-09T10:00:00Z"),
      capacity: 40,
      attendees: {
        create: firstNames.slice(34, 43).map((name, i) => {
          const idx = 34 + i;
          return {
            name,
            phone: phone(idx),
            dietaryPreference: "",
            hasPlusOne: false,
            rsvpStatus: "confirmed",
            checkedInAt: null,
          };
        }),
      },
    },
  });

  const total = await prisma.attendee.count();
  console.log(`Seeded ${total} attendees across 3 events.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
