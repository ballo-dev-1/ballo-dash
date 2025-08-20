// src/Common/AppInitializer.tsx

import { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { companyService, userService } from "@/services";

const AppInitializer = () => {
  const { company, user } = useAppContext();
  


  // One-time initialization on mount
  useEffect(() => {
    // Initialize company and user services
    
  }, [company, user]);

  // No more Redux polling - services handle their own caching
  console.log('AppInitializer: No polling needed - services handle caching automatically');

  return null; // This component only runs side effects
};

export default AppInitializer;
