# Dynamic Menu System

## Overview

The dynamic menu system automatically generates navigation menu items based on active integrations. When users connect to social media platforms (Facebook, Instagram, LinkedIn, etc.), corresponding report pages are automatically added to the navigation menu.

## Architecture

### Core Components

1. **`MenuData.tsx`** - Contains the base menu structure and dynamic generation functions
2. **`useDynamicMenu.ts`** - Custom hook that manages dynamic menu state
3. **`Header.tsx`** - Main navigation component that renders the dynamic menu
4. **`NestedMenu.tsx`** - Renders the actual menu items with submenu support

### Key Functions

#### `generateReportMenuItems(integrations)`
- **Purpose**: Generates menu items for each connected integration
- **Input**: Array of integration objects
- **Output**: Array of menu item objects with platform-specific routes
- **Features**:
  - Filters for `CONNECTED` status integrations
  - Maps platform types to display names and icons
  - Generates `/reports/{platform}` routes
  - Adds "All Platforms" option when multiple integrations exist

#### `useDynamicMenu()`
- **Purpose**: React hook that manages dynamic menu state
- **Returns**:
  - `reportsMenuItem`: The main reports menu item with dynamic submenu
  - `dynamicReportItems`: Array of platform-specific report items
  - `integrationsLoading`: Loading state for integrations

## Platform Support

### Supported Platforms
- **Facebook** → `/reports/facebook`
- **Instagram** → `/reports/instagram`
- **LinkedIn** → `/reports/linkedin`
- **X (Twitter)** → `/reports/x`
- **TikTok** → `/reports/tiktok`
- **YouTube** → `/reports/youtube`

### Icons
Each platform has a corresponding Phosphor icon:
- Facebook: `ph-duotone ph-facebook-logo`
- Instagram: `ph-duotone ph-instagram-logo`
- LinkedIn: `ph-duotone ph-linkedin-logo`
- X: `ph-duotone ph-twitter-logo`
- TikTok: `ph-duotone ph-video`
- YouTube: `ph-duotone ph-youtube-logo`

## Menu Structure

### Static Menu Items
```typescript
{
  id: "reports",
  label: "Reports",
  icon: "ph-duotone ph-file-text",
  link: "/reports",
  dataPage: "w_reports",
  type: "HASHMENU",
  submenu: [] // Populated dynamically
}
```

### Dynamic Submenu Items
```typescript
{
  id: "reports-facebook",
  label: "Facebook Reports",
  icon: "ph-duotone ph-facebook-logo",
  link: "/reports/facebook",
  dataPage: "w_reports_facebook",
  parentId: "reports",
  order: 1
}
```

## Usage Examples

### Basic Implementation
```tsx
import { useDynamicMenu } from '@/hooks/useDynamicMenu';

const MyComponent = () => {
  const { reportsMenuItem, dynamicReportItems } = useDynamicMenu();
  
  return (
    <div>
      <h3>{reportsMenuItem.label}</h3>
      {reportsMenuItem.submenu?.map(item => (
        <div key={item.id}>
          <a href={item.link}>{item.label}</a>
        </div>
      ))}
    </div>
  );
};
```

### Integration with Existing Menu
```tsx
// In Header.tsx
const dynamicMenuItems = React.useMemo(() => {
  return menuItems.map((item: any) => {
    if (item.id === "reports") {
      return reportsMenuItem; // Replace with dynamic version
    }
    return item;
  });
}, [reportsMenuItem]);

// Render with dynamic menu
<NestedMenu menuItems={dynamicMenuItems} />
```

## Integration Requirements

### Data Structure
The system expects integration objects with this structure:
```typescript
interface Integration {
  id: string;
  type: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'X' | 'TIKTOK' | 'YOUTUBE';
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING';
  // ... other properties
}
```

### Redux Integration
The system integrates with the existing Redux store:
- Uses `useIntegrations()` hook to fetch integration data
- Automatically updates when integrations change
- Handles loading states gracefully

## Customization

### Adding New Platforms
1. Add platform type to `platformIcons` and `platformNames` in `MenuData.tsx`
2. Add corresponding icon class
3. Create platform-specific report page at `/reports/{platform}`
4. Update integration types if needed

### Modifying Menu Structure
- Edit `generateReportMenuItems()` function to change menu item structure
- Modify `useDynamicMenu()` to add additional menu logic
- Update `NestedMenu.tsx` to support new menu item types

## Performance Considerations

- **Memoization**: Dynamic menu items are memoized to prevent unnecessary re-renders
- **Lazy Loading**: Menu items are only generated when integrations are loaded
- **Efficient Updates**: Only re-renders when integration status changes

## Testing

Use the `DynamicMenuDemo` component to test the dynamic menu functionality:
```tsx
import DynamicMenuDemo from '@/components/DynamicMenuDemo';

// Add to any page to see current menu state
<DynamicMenuDemo />
```

## Future Enhancements

- **Role-based Menu Items**: Show/hide menu items based on user permissions
- **Custom Ordering**: Allow users to reorder menu items
- **Menu Persistence**: Save menu state in localStorage
- **Breadcrumb Integration**: Update breadcrumbs based on dynamic routes
