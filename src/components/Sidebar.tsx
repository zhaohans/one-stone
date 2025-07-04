
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Shield, 
  Settings,
  Building2,
  Receipt,
  Newspaper,
  ChevronDown,
  ChevronRight,
  Package,
  FileSearch,
  Zap,
  Activity,
  Plus,
  Eye,
  Settings2,
  GitBranch,
  GraduationCap,
  FileCheck,
  Users2
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounts',
    href: '/accounts-redesigned',
    icon: PiggyBank,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Trades',
    href: '/trades',
    icon: TrendingUp,
    subItems: [
      { title: 'Product List', href: '/trades/products', icon: Package },
      { title: 'RFQ Overview', href: '/trades/rfq-overview', icon: FileSearch },
      { title: 'RFQ Processing', href: '/trades/rfq-processing', icon: Zap },
      { title: 'Lifecycle', href: '/trades/lifecycle', icon: Activity },
      { title: 'New Order', href: '/trades/new-order', icon: Plus },
      { title: 'Order Overview', href: '/trades/order-overview', icon: Eye },
      { title: 'Order Processing', href: '/trades/order-processing', icon: Settings2 },
      { title: 'Flows', href: '/trades/flows', icon: GitBranch },
    ]
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Fee Reports',
    href: '/fees',
    icon: Receipt,
  },
  {
    title: 'Fee Management',
    href: '/fee-management',
    icon: Building2,
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'Compliance',
    href: '/compliance',
    icon: Shield,
    subItems: [
      { title: 'Compliance Training', href: '/compliance-training', icon: GraduationCap },
      { title: 'Policy Management', href: '/policy-management', icon: FileCheck },
      { title: 'Employee Acknowledgments', href: '/employee-acknowledgments', icon: Users2 },
    ]
  },
  {
    title: 'News',
    href: '/news',
    icon: Newspaper,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (itemHref: string) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemHref)) {
        newSet.delete(itemHref);
      } else {
        newSet.add(itemHref);
      }
      return newSet;
    });
  };

  const isGroupOpen = (itemHref: string) => openGroups.has(itemHref);

  return (
    <div className={cn("pb-12 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <div key={item.href}>
                <div className="flex items-center">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex-1',
                        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                        collapsed && 'justify-center'
                      )
                    }
                    title={collapsed ? item.title : undefined}
                    onClick={(e) => {
                      if (item.subItems && !collapsed) {
                        e.preventDefault();
                        toggleGroup(item.href);
                      }
                    }}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && item.title}
                  </NavLink>
                  {item.subItems && !collapsed && (
                    <button
                      onClick={() => toggleGroup(item.href)}
                      className="p-1 hover:bg-accent rounded transition-colors"
                    >
                      {isGroupOpen(item.href) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                {item.subItems && !collapsed && isGroupOpen(item.href) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center rounded-lg px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition-colors',
                            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                          )
                        }
                      >
                        <subItem.icon className="h-3 w-3 mr-2" />
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
