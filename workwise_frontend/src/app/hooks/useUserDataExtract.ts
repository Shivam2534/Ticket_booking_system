import { useState } from "react";

export const useUserDataExtract = () => {
  const [userData, setUserData] = useState(null);

  function extractUserDataFromLocalStorage() {
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null; // Handle null case safely
    setUserData(userData);
  }

  function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData(null);
  }

  return { userData, extractUserDataFromLocalStorage, logoutUser };
};
