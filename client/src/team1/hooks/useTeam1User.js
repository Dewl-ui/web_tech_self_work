import { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  syncRoleFromAuthenticatedUser,
} from "../utils/school";

export default function useTeam1User() {
  const [user, setUser] = useState(getCurrentUserProfile());

  useEffect(() => {
    let mounted = true;

    syncRoleFromAuthenticatedUser().finally(() => {
      if (mounted) {
        setUser(getCurrentUserProfile());
      }
    });

    const handleUserChange = (event) => {
      setUser(event.detail || getCurrentUserProfile());
    };

    window.addEventListener("team1-user-change", handleUserChange);

    return () => {
      mounted = false;
      window.removeEventListener("team1-user-change", handleUserChange);
    };
  }, []);

  return user;
}
