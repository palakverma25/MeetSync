-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "rsvpToken" TEXT NOT NULL,
    "dietaryPreference" TEXT NOT NULL DEFAULT '',
    "hasPlusOne" BOOLEAN NOT NULL DEFAULT false,
    "rsvpStatus" TEXT NOT NULL DEFAULT 'confirmed',
    "checkedInAt" TIMESTAMP(3),

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_rsvpToken_key" ON "Attendee"("rsvpToken");

-- CreateIndex
CREATE INDEX "Attendee_eventId_idx" ON "Attendee"("eventId");

-- CreateIndex
CREATE INDEX "Attendee_name_idx" ON "Attendee"("name");

-- CreateIndex
CREATE INDEX "Attendee_phone_idx" ON "Attendee"("phone");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
