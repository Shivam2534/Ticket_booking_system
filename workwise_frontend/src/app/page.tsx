"use client";
import Image from "next/image";
import { ArrowRightIcon, TrainIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserDataExtract } from "./hooks/useUserDataExtract";
import { useEffect } from "react";
import { useIsMobile } from "./hooks/useIsMobile";

export default function Home() {
  const { userData, logoutUser, extractUserDataFromLocalStorage } =
    useUserDataExtract();

  const isMobile = useIsMobile();

  useEffect(() => {
    extractUserDataFromLocalStorage();
  }, [extractUserDataFromLocalStorage]);
  const router = useRouter();

  function DeleteUserSession() {
    logoutUser();
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrainIcon className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">RailJourney</span>
          </div>

          {!userData && (
            <div className="flex items-center space-x-4">
              <Link href={"/Auth/Signin"}>
                <button className="hidden md:block px-4 py-2 text-gray-300 font-medium hover:text-white transition-colors">
                  Login
                </button>
              </Link>
              <Link href={"/Auth/Signup"}>
                <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {userData && (
            <div className="flex gap-10">
              {!isMobile && (
                <div className="flex items-end text-lg font-semibold text-white">
                  Welcome, {userData?.name}
                </div>
              )}
              <button
                onClick={DeleteUserSession}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with overlay gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-900/70 z-10"></div>
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="High-speed train"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 flex flex-col items-center">
          <div className="max-w-4xl text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Journey Beyond <span className="text-blue-400">Boundaries</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the world is most scenic routes with comfort and style
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={() => router.push("/pages/book_train")}
                className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg"
              >
                Book Your Journey
              </button>
              <button className=" cursor-not-allowed px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors text-lg">
                Explore Routes
              </button>
            </div>
          </div>

          {/* Train Route Illustration */}
          <div className="w-full max-w-4xl bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <div className="text-gray-400 text-sm mb-1">FROM</div>
                <div className="text-white text-2xl font-bold">New York</div>
                <div className="text-blue-400 mt-1">Grand Central</div>
              </div>

              <div className="flex items-center justify-center w-full md:w-auto py-4">
                <div className="h-0.5 w-16 bg-gray-600 hidden md:block"></div>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-4">
                  <ArrowRightIcon className="h-6 w-6 text-white" />
                </div>
                <div className="h-0.5 w-16 bg-gray-600 hidden md:block"></div>
              </div>

              <div className="text-center md:text-right">
                <div className="text-gray-400 text-sm mb-1">TO</div>
                <div className="text-white text-2xl font-bold">Boston</div>
                <div className="text-blue-400 mt-1">South Station</div>
              </div>
            </div>

            {/* Train Details */}
            <div className="mt-8 pt-8 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">DEPARTURE</div>
                <div className="text-white text-xl font-medium">08:30 AM</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">DURATION</div>
                <div className="text-white text-xl font-medium">3h 45m</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">ARRIVAL</div>
                <div className="text-white text-xl font-medium">12:15 PM</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                High-Speed Trains
              </h3>
              <p className="text-gray-400">
                Experience journeys at speeds up to 300 km/h
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                Best Price Guarantee
              </h3>
              <p className="text-gray-400">
                Always get the best rates with no hidden fees
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                Luxury Experience
              </h3>
              <p className="text-gray-400">
                Premium comfort with first-class amenities
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-950 to-transparent z-10"></div>
      </section>
    </div>
  );
}
