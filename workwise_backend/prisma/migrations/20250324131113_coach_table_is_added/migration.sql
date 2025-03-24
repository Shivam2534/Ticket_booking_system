/*
  Warnings:

  - You are about to drop the column `isBooked` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `rowNumber` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `seatNumber` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `coach_id` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `row_number` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seat_number` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Seat_bookingId_key";

-- DropIndex
DROP INDEX "Seat_seatNumber_key";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "isBooked",
DROP COLUMN "rowNumber",
DROP COLUMN "seatNumber",
ADD COLUMN     "booked_by" INTEGER,
ADD COLUMN     "coach_id" INTEGER NOT NULL,
ADD COLUMN     "is_booked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "row_number" INTEGER NOT NULL,
ADD COLUMN     "seat_number" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Coach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
