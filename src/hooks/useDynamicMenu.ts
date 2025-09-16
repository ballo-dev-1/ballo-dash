import { useMemo } from 'react';
import { useIntegrations } from './useIntegrations';
import { generateReportMenuItems } from '@/Layouts/MenuData';

/**
 * Custom hook to generate dynamic menu items based on active integrations
 * @returns Object containing the main menu items and dynamic report submenu items
 */
export const useDynamicMenu = () => {
  const { integrations, loading: integrationsLoading } = useIntegrations();

  // Generate dynamic report menu items based on connected integrations
  const dynamicReportItems = useMemo(() => {
    if (integrationsLoading || !integrations) {
      return [];
    }
    
    return generateReportMenuItems(integrations);
  }, [integrations, integrationsLoading]);

  // Create the reports menu item with dynamic submenu
  const reportsMenuItem = useMemo(() => {
    const baseReportsItem = {
      id: "reports",
      label: "Reports",
      icon: "ph-duotone ph-file-text",
      link: "/reports",
      dataPage: "w_reports",
      type: "HASHMENU" as const,
    };

    // If we have dynamic report items, add them as submenu
    if (dynamicReportItems.length > 0) {
      return {
        ...baseReportsItem,
        submenu: [
          // Main reports overview
          {
            id: "reports-overview",
            label: "Overview",
            icon: "ph-duotone ph-chart-bar",
            link: "/reports",
            dataPage: "w_reports",
            parentId: "reports",
            order: 0,
          },
          ...dynamicReportItems,
        ],
      };
    }

    // If no integrations, return basic reports item
    return baseReportsItem;
  }, [dynamicReportItems]);

  return {
    reportsMenuItem,
    dynamicReportItems,
    integrationsLoading,
  };
};

export default useDynamicMenu;
