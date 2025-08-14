import { User } from "@/types";
import {
  ReactNode,
  createContext,
  useContext,
} from "react";
import { useAppContext } from "./AppContext";

// This context now acts as a wrapper around AppContext for backward compatibility
const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAppContext();

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
