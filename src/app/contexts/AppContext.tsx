// contexts/AppContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Company, User } from "@/types";

interface AppContextType {
  company: Company | null;
  user: User | null;
  setCompany: (company: Company | null) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [companyRes, userRes] = await Promise.all([
        fetch("/api/company"),
        fetch("/api/user"),
      ]);
      const companyData = await companyRes.json();
      const userData = await userRes.json();

      setCompany(companyData.company);
      setUser(userData.user);
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ company, user, setCompany, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
