"use client";
import axios from "axios";
import { useState } from "react";
import { SeatMatrix } from "./SeatMatrix";
import { HTTP_BACKEND_URL } from "../constant";

function SeatInput() {
  const [seatCount, setSeatCount] = useState<number>(0);
  const [isloading, setisloading] = useState(false);
  const [updateMatrix, setupdateMatrix] = useState([]);
  async function BookSeats() {
    try {
      setisloading(true);
      const res = await axios.post(
        `${HTTP_BACKEND_URL}/api/v1/seat/booking`,
        {
          seatCount,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            RequestedFrom: "inputbox",
          },
        }
      );

      console.log("res-", res.data);
      setupdateMatrix(res.data.updateMatrix);
    } catch (error) {
      console.log("Something went wrong while booking!!", error);
      alert("Booking failed.");
    } finally {
      setisloading(false);
    }
  }
  console.log("updateMatrix from seat input box-", updateMatrix);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            Train Ticket Booking
          </h1>
          <p className="text-indigo-100 mt-2">
            Select your seats for the best experience
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 p-8">
          {/* Input Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-6 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </span>
                Book Your Seat
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="seatCount"
                    className="block text-sm font-medium text-indigo-300 mb-2"
                  >
                    Number of Seats
                  </label>
                  <input
                    id="seatCount"
                    type="number"
                    min={1}
                    value={seatCount}
                    onChange={(e) =>
                      setSeatCount(Number.parseInt(e.target.value))
                    }
                    placeholder="Enter number of seats to book"
                    className="border border-slate-600 bg-slate-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center text-indigo-300 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Booking Information
                  </div>
                  <p className="text-sm text-slate-300">
                    Select the number of seats you wish to book. Our system will
                    automatically allocate the best available seats for you.
                  </p>
                </div>

                <button
                  onClick={BookSeats}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-lg shadow-indigo-900/50 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>

                  {isloading ? "Finding best  seat for you..." : "Book Now"}
                </button>
              </div>
            </div>

            <div className="w-full mt-4 pt-6 border-t border-slate-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Price per ticket:</span>
                <span className="font-medium text-white">$12.00</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Convenience fee:</span>
                <span className="font-medium text-white">$1.50</span>
              </div>
              <div className="flex justify-between font-bold mt-3 pt-3 border-t border-dashed border-slate-700">
                <span className="text-indigo-300">Total:</span>
                <span className="text-indigo-300">
                  ${(seatCount * 12 + 1.5).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Seat Matrix Section */}
          <div className="w-full md:w-1/2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            {/* Screen indicator */}

            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <SeatMatrix updateMatrix={updateMatrix} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatInput;
