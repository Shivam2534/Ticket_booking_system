"use client";
import SeatInput from "@/app/components/SeatInput";
import { useUserDataExtract } from "@/app/hooks/useUserDataExtract";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const { userData, extractUserDataFromLocalStorage } = useUserDataExtract();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    extractUserDataFromLocalStorage();
    setLoading(false);
  }, [extractUserDataFromLocalStorage]);

  useEffect(() => {
    if (!userData && !loading) {
      router.push("/Auth/Signin");
    }
  }, [userData, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  } else if (userData) {
    return (
      <div>
        <SeatInput />
      </div>
    );
  }
}

export default Page;
