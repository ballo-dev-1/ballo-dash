import { useRouter } from 'next/router';
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useTranslation } from "react-i18next";

interface MenuItem {
  id: number | string;
  label: string;
  type?: string;
  icon?: string;
  link?: string;
  badge?: string;
  dataPage?: string;
  submenu?: MenuItem[];
  parentId?: string;
  order?: number;
  isHeader?: boolean;
}

const NestedMenu: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const { t } = useTranslation();

  const initializeOpenMenu = (
    items: MenuItem[],
    path: string
  ): number | string | null => {
    for (const item of items) {
      if (item.link === path) {
        return item.id;
      }
      if (item.submenu) {
        const found = initializeOpenMenu(item.submenu, path);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const currentPath = router.pathname;
    const activeMenuId = initializeOpenMenu(menuItems, currentPath);
    if (activeMenuId) {
      setOpenMenuId(activeMenuId);
    }
  }, [router.pathname, menuItems]);

  const handleMenuClick = useCallback((id: number | string) => {
    setOpenMenuId(prevId => prevId === id ? null : id);
  }, []);

  const isMenuActive = (item: MenuItem) => {
    return router.pathname === item.link;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpen = openMenuId === item.id;
    const isActive = isMenuActive(item);
    const indentStyle = { paddingLeft: `${level * 20}px` };

    if (item.type === "HEADER") {
      return (
        <li key={item.id} className="pc-item pc-caption" style={indentStyle}>
          <label>{t(item.label)}</label>
        </li>
      );
    }

    if (hasSubmenu) {
      return (
        <li
          key={item.id}
          className={`pc-item pc-hasmenu ${isOpen ? "pc-trigger active" : ""}`}
          style={indentStyle}
        >
          <span
            className="pc-link"
            onClick={() => handleMenuClick(item.id)}
          >
            <span className="pc-micon">
              <i className={item.icon}></i>
            </span>
            <span className="pc-mtext">{t(item.label)}</span>
            <span className="pc-arrow">
              <FeatherIcon icon="chevron-right" />
            </span>
          </span>
          <ul
            className={`pc-submenu ${isOpen ? "open" : ""}`}
            style={{ display: isOpen ? "block" : "none" }}
          >
            {item.submenu!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </ul>
        </li>
      );
    }

    return (
      <li
        key={item.id}
        className={`pc-item ${isActive ? "active" : ""}`}
        style={indentStyle}
      >
        <Link
          href={item.link || "#"}
          className="pc-link"
          data-page={item.dataPage}
        >
          <span className="pc-micon">
            <i className={item.icon}></i>
          </span>
          <span className="pc-mtext">{t(item.label)}</span>
          {item.badge && <span className="pc-badge">{item.badge}</span>}
        </Link>
      </li>
    );
  };

  return (
    <React.Fragment>
      {menuItems.map((item) => renderMenuItem(item))}
    </React.Fragment>
  );
};

export default NestedMenu;
