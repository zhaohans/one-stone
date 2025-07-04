
import React from 'react';
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
  Newspaper
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
      { title: 'Product List', href: '/trades/products' },
      { title: 'RFQ Overview', href: '/trades/rfq-overview' },
      { title: 'RFQ Processing', href: '/trades/rfq-processing' },
      { title: 'Lifecycle', href: '/trades/lifecycle' },
      { title: 'New Order', href: '/trades/new-order' },
      { title: 'Order Overview', href: '/trades/order-overview' },
      { title: 'Order Processing', href: '/trades/order-processing' },
      { title: 'Flows', href: '/trades/flows' },
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
      { title: 'Compliance Training', href: '/compliance-training' },
      { title: 'Policy Management', href: '/policy-management' },
      { title: 'Employee Acknowledgments', href: '/employee-acknowledgments' },
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

  return (
    <div className={cn("pb-12 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <div key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                      collapsed && 'justify-center'
                    )
                  }
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && item.title}
                </NavLink>
                {item.subItems && !collapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-lg px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition-colors',
                            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                          )
                        }
                      >
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
