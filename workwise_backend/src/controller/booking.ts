import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // assuming this is correctly set up

const initialCoachMatrix = async (req: Request) => {
  console.log("request reached into initialCoachMatrix controller");

  try {
    // Fetch all seats ordered by row_number and seat_number
    const seats = await prisma.seat.findMany({
      orderBy: [{ row_number: "asc" }, { seat_number: "asc" }],
    });

    // Build matrix: 2D array -> rows of seats
    const matrix: any[][] = [];
    let currentRow = 1;
    let rowSeats: any[] = [];

    for (const seat of seats) {
      if (seat.row_number !== currentRow) {
        matrix.push(rowSeats);
        rowSeats = [];
        currentRow = seat.row_number;
      }
      rowSeats.push(seat);
    }

    // Push the last row
    if (rowSeats.length > 0) {
      matrix.push(rowSeats);
    }

    return matrix;
    // } else {
    //   res.status(200).json({
    //     success: true,
    //     data: matrix,
    //   });
    //   return;
    // }
  } catch (error) {
    console.error("Error fetching seat matrix:", error);
    return error;
  }
};

function findContiguousBlock(rowSeats: any, requiredCount: any) {
  let count = 0;
  let startIndex = 0;
  for (let i = 0; i < rowSeats.length; i++) {
    if (!rowSeats[i].is_booked) {
      if (count === 0) startIndex = i;
      count++;
      if (count === requiredCount) {
        return rowSeats.slice(startIndex, i + 1);
      }
    } else {
      count = 0;
    }
  }
  return null;
}

const booking = async (req: Request, res: Response) => {
  console.log("Request reached in Booking controller");

  const { seatCount } = req.body;
  console.log("data-", seatCount);

  if (seatCount < 1 || seatCount > 7) {
    res.status(400).json({ error: "You can book between 1 and 7 seats." });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Retrieve seats for coach_id = 1
      const seats = await tx.seat.findMany({
        where: { coach_id: 1 },
        orderBy: [{ row_number: "asc" }, { seat_number: "asc" }],
      });

      // Group seats by row
      const rows: { [key: number]: typeof seats } = {};
      seats.forEach((seat) => {
        if (!rows[seat.row_number]) {
          rows[seat.row_number] = [];
        }
        rows[seat.row_number].push(seat);
      });

      let allocatedSeats = [];

      // 2. Try to find a contiguous block
      for (const row in rows) {
        rows[row].sort((a, b) => a.seat_number - b.seat_number);

        const block = findContiguousBlock(rows[row], seatCount);
        if (block) {
          allocatedSeats = block;
          break;
        }
      }

      // 3. If no block, pick from available seats in a row
      if (allocatedSeats.length === 0) {
        for (const row in rows) {
          const availableSeats = rows[row].filter((seat) => !seat.is_booked);
          if (availableSeats.length >= seatCount) {
            allocatedSeats = availableSeats.slice(0, seatCount);
            break;
          }
        }
      }

      if (allocatedSeats.length !== seatCount) {
        throw new Error("Not enough seats available together.");
      }

      const seatIds = allocatedSeats.map((seat: any) => seat.id);

      // 4. Update selected seats as booked
      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { is_booked: true, booked_by: 1 },
      });

      return allocatedSeats;
    });

    // here we are fetching updated matrix
    const updateMatrix = await initialCoachMatrix(req);

    res.status(200).json({
      message: "Seats booked successfully",
      seats: result,
      updateMatrix,
    });
    return;
  } catch (error: any) {
    console.error("Booking error:", error);
    if (error.message.includes("Not enough seats")) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const initialCoachMatrixHandler = async (req: Request, res: Response) => {
  try {
    const matrix = await initialCoachMatrix(req);
    res.status(200).json({
      success: true,
      data: matrix,
    });
  } catch (error) {
    console.error("Error fetching seat matrix:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coach matrix.",
    });
  }
};
export { booking, initialCoachMatrixHandler };
