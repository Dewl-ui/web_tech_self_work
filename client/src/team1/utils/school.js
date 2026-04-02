export const setCurrentSchool = (school) => {
  if (!school) {
    localStorage.removeItem("selectedSchool");
    localStorage.removeItem("school");
    return;
  }

  const serialized = JSON.stringify(school);
  localStorage.setItem("selectedSchool", serialized);
  localStorage.setItem("school", serialized);
};

export const getCurrentSchool = () => {
  try {
    return JSON.parse(
      localStorage.getItem("selectedSchool") || localStorage.getItem("school")
    );
  } catch {
    return null;
  }
};

export const setRole = (role) => {
  const nextRole = typeof role === "string" && role.trim() ? role : "student";
  localStorage.setItem("role", nextRole.toLowerCase());
};

export const getRole = () => {
  return (localStorage.getItem("role") || "").trim().toLowerCase();
};
