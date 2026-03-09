import { createContext, useContext, useState, useEffect } from "react";
import type { FamilyMember } from "@shared/schema";

type CurrentMemberContextType = {
  currentMember: FamilyMember | null;
  setCurrentMember: (member: FamilyMember | null) => void;
  logout: () => void;
};

const CurrentMemberContext = createContext<CurrentMemberContextType | undefined>(undefined);

export function CurrentMemberProvider({ children }: { children: React.ReactNode }) {
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(() => {
    const stored = localStorage.getItem("currentMember");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentMember) {
      localStorage.setItem("currentMember", JSON.stringify(currentMember));
    } else {
      localStorage.removeItem("currentMember");
    }
  }, [currentMember]);

  const logout = () => {
    setCurrentMember(null);
  };

  return (
    <CurrentMemberContext.Provider value={{ currentMember, setCurrentMember, logout }}>
      {children}
    </CurrentMemberContext.Provider>
  );
}

export function useCurrentMember() {
  const context = useContext(CurrentMemberContext);
  if (!context) {
    throw new Error("useCurrentMember must be used within CurrentMemberProvider");
  }
  return context;
}
