import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a Coach
  const coach = await prisma.coach.create({
    data: {
      name: "Coach A",
    },
  });

  const totalSeats = 80;
  const seatsPerRow = 7;
  const totalRows = Math.ceil(totalSeats / seatsPerRow); //12

  const seatsData = [];
  let seatCounter = 0;

  for (let row = 1; row <= totalRows; row++) {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      seatCounter++;

      if (seatCounter > totalSeats) break; // Stop after 80 seats

      seatsData.push({
        row_number: row,
        seat_number: seatCounter,
        coach_id: coach.id,
      });
    }
  }

  // Insert all seats
  await prisma.seat.createMany({
    data: seatsData,
  });

  console.log(
    `Seeded 1 coach with ${seatsData.length} seats across ${totalRows} rows.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
