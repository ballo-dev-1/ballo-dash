import { Company } from "@/types";
import {
  ReactNode,
  createContext,
  useContext,
} from "react";
import { useAppContext } from "./AppContext";

// This context now acts as a wrapper around AppContext for backward compatibility
const CompanyContext = createContext<Company | null>(null);
export const useCompany = () => useContext(CompanyContext);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { company } = useAppContext();

  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
}
