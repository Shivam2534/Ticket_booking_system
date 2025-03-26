"use client";
import SeatInput from "@/app/components/SeatInput";
import { useUserDataExtract } from "@/app/hooks/useUserDataExtract";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const { userData, extractUserDataFromLocalStorage } = useUserDataExtract();
  useEffect(() => {
    extractUserDataFromLocalStorage();
  }, []);

  const router = useRouter();

  if (!userData) {
    router.push("/Auth/Signin");
  } else {
    return (
      <div>
        <SeatInput />
      </div>
    );
  }
}

export default Page;
