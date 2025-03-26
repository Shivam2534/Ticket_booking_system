import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

interface SeatType {
  id: number;
  row_number: number;
  seat_number: number;
  is_booked: boolean;
  booked_by: string | number | null;
  coach_id: number;
  bookingId: string | number | null;
}

const initialCoachMatrix = async (req: Request) => {
  console.log("request reached into initialCoachMatrix controller");

  try {
    // Fetch all seats ordered by row_number and seat_number
    const seats = await prisma.seat.findMany({
      orderBy: [{ row_number: "asc" }, { seat_number: "asc" }],
    });

    // Build matrix: 2D array -> rows of seats
    const matrix: SeatType[][] = [];
    let currentRow = 1;
    let rowSeats: SeatType[] = [];

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
  } catch (error) {
    console.error("Error fetching seat matrix:", error);
    return error;
  }
};

function findContiguousBlock(rowSeats: SeatType[], requiredCount: number) {
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

const bookingNewTicket = async (req: Request, res: Response) => {
  console.log("Request reached in Booking controller");

  const { seatCount } = req.body;

  if (seatCount < 1 || seatCount > 7) {
    res.status(200).json({
      message: "You can book maximum 7 seats at a time.",
      success: false,
      status: 401,
    });
    return;
  }

  try {
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const seats = await tx.seat.findMany({
          where: { coach_id: 1 },
          orderBy: [{ row_number: "asc" }, { seat_number: "asc" }],
        });

        const rows: { [key: number]: SeatType[] } = {};
        seats.forEach((seat: SeatType) => {
          if (!rows[seat.row_number]) rows[seat.row_number] = [];
          rows[seat.row_number].push(seat);
        });

        let allocatedSeats: SeatType[] = [];
        for (const row in rows) {
          rows[row].sort(
            (a: SeatType, b: SeatType) => a.seat_number - b.seat_number
          );
          const block = findContiguousBlock(rows[row], seatCount);
          if (block) {
            allocatedSeats = block;
            break;
          }
        }

        if (allocatedSeats.length === 0) {
          for (const row in rows) {
            const availableSeats = rows[row].filter(
              (seat: SeatType) => !seat.is_booked
            );
            if (availableSeats.length >= seatCount) {
              allocatedSeats = availableSeats.slice(0, seatCount);
              break;
            }
          }
        }

        if (allocatedSeats.length !== seatCount) {
          throw new Error("Not enough seats available together.");
        }

        const seatIds = allocatedSeats.map((seat) => seat.id);
        await tx.seat.updateMany({
          where: { id: { in: seatIds } },
          data: { is_booked: true, booked_by: 1 },
        });

        return allocatedSeats;
      }
    );

    // here we are fetching updated matrix
    const updateMatrix = await initialCoachMatrix(req);

    res.status(200).json({
      message: "Seats booked successfully",
      seats: result,
      updateMatrix,
      status: 200,
    });
    return;
  } catch (error: unknown) {
    console.error("Booking error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Not enough seats")) {
        res
          .status(200)
          .json({ message: "Not enough seats", success: false, status: 501 });
        return;
      }

      res.status(200).json({
        message: "Internal Server Error",
        success: false,
        status: 500,
      });
    } else {
      // Non-standard error (not instance of Error)
      res.status(200).json({
        message: "Unknown error occurred",
        success: false,
        status: 500,
      });
    }
  }
};

const bookDiscrateSeats = async (req: Request, res: Response) => {
  try {
    console.log(
      "Request reached in booking controller for discrete seat booking"
    );

    const { selectedSeats, coachId = 1 } = req.body;

    if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      res.status(200).json({
        message: "Invalid seat selection",
        success: false,
        status: 402,
      });
      return;
    }

    const seats = await prisma.seat.findMany({
      where: {
        seat_number: { in: selectedSeats },
        coach_id: coachId,
      },
      orderBy: [{ row_number: "asc" }, { seat_number: "asc" }],
    });

    if (seats.length === 0) {
      res
        .status(200)
        .json({ message: "Seats not available", success: false, status: 502 });
      return;
    }

    const seatIds = seats.map((seat) => seat.id);

    await prisma.seat.updateMany({
      where: { id: { in: seatIds } },
      data: { is_booked: true, booked_by: 1 },
    });

    const updateMatrix = await initialCoachMatrix(req);

    res.status(200).json({
      message: "Seats booked successfully",
      success: true,
      updateMatrix,
      status: 200,
    });
    return;
  } catch (error: any) {
    console.error("Error while booking discrete seats:", error.message);
    res.status(200).json({
      message: "An error occurred while booking.",
      success: false,
      status: 500,
    });
    return;
  }
};

const initialCoachMatrixHandler = async (req: Request, res: Response) => {
  try {
    const matrix = await initialCoachMatrix(req);
    res.status(200).json({
      success: true,
      data: matrix,
      message: "Initial coach matrix fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching seat matrix:", error);
    res.status(200).json({
      success: false,
      message: "Failed to fetch coach matrix.",
      status: 500,
    });
  }
};
export { bookingNewTicket, initialCoachMatrixHandler, bookDiscrateSeats };
