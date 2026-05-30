import { PrismaClient } from "@prisma/client";
import { hashPassword, validatePasswordStrength } from "../lib/auth/password";

const prisma = new PrismaClient();

const LOCAL_DEV_DEFAULT_EMAIL = "admin@meetsync.local";
const LOCAL_DEV_DEFAULT_PASSWORD = "changeme123";

function isLocalDatabase(url: string) {
  return (
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("@localhost:") ||
    url.includes("51214")
  );
}

async function main() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  const isLocal = isLocalDatabase(dbUrl);

  const email = (process.env.ADMIN_EMAIL ?? LOCAL_DEV_DEFAULT_EMAIL).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? (isLocal ? LOCAL_DEV_DEFAULT_PASSWORD : "");
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!password) {
    console.error(
      "ADMIN_PASSWORD is required when seeding a hosted database. Set it in .env and re-run.",
    );
    process.exit(1);
  }

  const strengthError = validatePasswordStrength(password);
  if (strengthError) {
    console.error(strengthError);
    process.exit(1);
  }

  if (!isLocal && password === LOCAL_DEV_DEFAULT_PASSWORD) {
    console.error(
      "Refusing to use the local dev default password on a hosted database. Choose a unique ADMIN_PASSWORD.",
    );
    process.exit(1);
  }

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
  if (isLocal && !process.env.ADMIN_PASSWORD) {
    console.log(
      `Local dev login: ${LOCAL_DEV_DEFAULT_EMAIL} / ${LOCAL_DEV_DEFAULT_PASSWORD} — change before any shared deploy.`,
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
