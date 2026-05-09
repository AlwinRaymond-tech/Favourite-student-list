import { createContext, useContext, useMemo, useState } from "react";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [favouriteStudents, setFavouriteStudents] = useState([]);

  function addFavourite(student) {
    setFavouriteStudents((currentStudents) => {
      const alreadyAdded = currentStudents.some((item) => item.id === student.id);

      if (alreadyAdded) {
        return currentStudents;
      }

      return [...currentStudents, student];
    });
  }

  function removeFavourite(studentId) {
    setFavouriteStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId)
    );
  }

  function isFavourite(studentId) {
    return favouriteStudents.some((student) => student.id === studentId);
  }

  const value = useMemo(
    () => ({
      favouriteStudents,
      addFavourite,
      removeFavourite,
      isFavourite
    }),
    [favouriteStudents]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error("useStudents must be used inside StudentProvider");
  }

  return context;
}
