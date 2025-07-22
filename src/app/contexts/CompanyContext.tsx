import { Company } from "@/types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// import { Company } from "@/types";

interface CompanyProviderProps {
  children: ReactNode;
}

const CompanyContext = createContext<Company | null>(null);
export const useCompany = () => useContext(CompanyContext);

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      const res = await fetch("/api/company");
      const data = await res.json();
      setCompany(data.company);
    }

    fetchCompany();
  }, []);

  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
}
