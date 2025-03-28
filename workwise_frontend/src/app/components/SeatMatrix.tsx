"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND_URL } from "../constant";
import { toast } from "react-toastify";

const MAX_SELECTION = 7;

interface SeatType {
  id: number;
  row_number: number;
  seat_number: number;
  is_booked: boolean;
  booked_by: string | number | null;
  coach_id: number;
  bookingId: string | number | null;
}

interface SeatMatrixProps {
  updateMatrix: SeatType[];
}

const SeatMatrix = ({ updateMatrix }: SeatMatrixProps) => {
  const [seats, setSeats] = useState<SeatType[] | []>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  useEffect(() => {
    if (updateMatrix) {
      setSeats(updateMatrix);
    }
  }, [updateMatrix]);

  useEffect(() => {
    axios
      .get(`${HTTP_BACKEND_URL}/api/v1/seat/initialCoachMatrix`, {
        headers: {
          RequestedFrom: "refresh",
        },
      })
      .then((res) => setSeats(res.data.data))
      .catch(() => alert("Failed to fetch seats"));
  }, []);

  const toggleSeat = (seat: SeatType) => {
    if (seat.is_booked) return;

    if (selectedSeats.includes(seat.seat_number)) {
      setSelectedSeats(
        selectedSeats.filter((seat_number) => seat_number !== seat.seat_number)
      );
    } else if (selectedSeats.length < MAX_SELECTION) {
      setSelectedSeats([...selectedSeats, seat.seat_number]);
    }
  };

  const handleBooking = async () => {
    try {
      const res = await axios.post(
        `${HTTP_BACKEND_URL}/api/v1/seat/bookdiscreateseat`,
        {
          selectedSeats: selectedSeats,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setSeats(res.data.updateMatrix);
        toast.success("seats booked successfully 🥳");
      }
      setSelectedSeats([]);
    } catch (err) {
      alert("Booking failed...");
      console.log("error is- ", err);
      toast.warn("Something went wrong while booking");
    }
  };

  return (
    <div className="md:p-4 max-w-4sxl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Train Coach Seat Selection
        </h2>

        <div className="border-4 border-gray-800 rounded-lg p-4 bg-gray-100">
          {/* Train Coach Body */}
          {seats.map((rowSeats, rowIdx) => (
            <div
              key={rowIdx}
              className="flex justify-center items-center mb-3 gap-2"
            >
              {/* Left Side Seats (3 seats) */}
              <div className="flex gap-2">
                {(seats[rowIdx] as unknown as SeatType[]).map(
                  (seat: SeatType) => {
                    let seatColor = "";
                    if (seat.is_booked) {
                      seatColor = "bg-red-500";
                    } else if (selectedSeats.includes(seat.seat_number)) {
                      seatColor = "bg-blue-500";
                    } else {
                      seatColor = "bg-green-500";
                    }

                    return (
                      <div
                        key={seat.id}
                        onClick={() => toggleSeat(seat)}
                        className={`cursor-pointer text-center rounded-md w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-bold ${seatColor}`}
                      >
                        {seat.seat_number}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* Book Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBooking}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
            disabled={selectedSeats.length === 0}
          >
            Book {selectedSeats.length} Seat(s)
          </button>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            Booked
          </div>
        </div>
      </div>
    </div>
  );
};

export { SeatMatrix };
