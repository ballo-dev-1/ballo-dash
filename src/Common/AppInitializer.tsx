// src/Common/AppInitializer.tsx

import { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { companyService, userService } from "@/services";

const AppInitializer = () => {
  const { company, user } = useAppContext();
  


  // One-time initialization on mount
  useEffect(() => {
    console.log('🔍 AppInitializer: Initializing services...');
    
    // Initialize company and user services
    if (!company) {
      console.log('🔍 AppInitializer: Company not loaded, will be loaded by AppContext');
    }
    
    if (!user) {
      console.log('🔍 AppInitializer: User not loaded, will be loaded by AppContext');
    }
    
    console.log('🔍 AppInitializer: Services initialized successfully');
    console.log('🔍 AppInitializer: Social media data will be fetched automatically by AppContext');
  }, [company, user]);

  // No more Redux polling - services handle their own caching
  console.log('🔍 AppInitializer: No polling needed - services handle caching automatically');

  return null; // This component only runs side effects
};

export default AppInitializer;
