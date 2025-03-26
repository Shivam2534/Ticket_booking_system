import { useCallback, useState } from "react";

interface userDataType {
  email: string;
  password: string;
  name: string;
}
export const useUserDataExtract = () => {
  const [userData, setUserData] = useState<userDataType | null>(null);

  const extractUserDataFromLocalStorage = useCallback(() => {
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null; // Handle null case safely
    setUserData(userData);
  }, []);

  function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData(null);
  }

  return { userData, extractUserDataFromLocalStorage, logoutUser };
};
