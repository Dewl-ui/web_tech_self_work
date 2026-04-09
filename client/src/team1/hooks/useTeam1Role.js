import { useEffect, useState } from "react";
import { getRole, syncRoleFromAuthenticatedUser } from "../utils/school";

export default function useTeam1Role() {
  const [role, setRoleState] = useState(getRole());

  useEffect(() => {
    let mounted = true;

    syncRoleFromAuthenticatedUser().then((nextRole) => {
      if (mounted && nextRole) {
        setRoleState(nextRole);
      }
    });

    const handleRoleChange = (event) => {
      setRoleState(event.detail || getRole());
    };

    const handleStorage = (event) => {
      if (event.key === "role" || event.key === "selectedSchool" || event.key === "school") {
        setRoleState(getRole());
      }
    };

    window.addEventListener("team1-role-change", handleRoleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      mounted = false;
      window.removeEventListener("team1-role-change", handleRoleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return role;
}
