import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@meetsync.local").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_NAME ?? "Admin";

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: "admin",
      passwordHash,
    },
    create: {
      email,
      name,
      role: "admin",
      passwordHash,
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.role})`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("Default password: changeme123 — set ADMIN_PASSWORD in .env for production.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
