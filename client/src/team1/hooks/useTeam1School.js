import { useEffect, useState } from "react";
import { getCurrentSchool } from "../utils/school";

export default function useTeam1School() {
  const [school, setSchool] = useState(getCurrentSchool());

  useEffect(() => {
    const handleSchoolChange = (event) => {
      setSchool(event.detail || getCurrentSchool());
    };

    const handleStorage = (event) => {
      if (event.key === "selectedSchool" || event.key === "school") {
        setSchool(getCurrentSchool());
      }
    };

    window.addEventListener("team1-school-change", handleSchoolChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("team1-school-change", handleSchoolChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return school;
}
