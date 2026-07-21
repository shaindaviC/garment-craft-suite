import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Shirt,
  ShoppingCart,
  Factory,
  Truck,
  Receipt,
  BarChart3,
  Sparkles,
  Scissors,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { currentUser } from "@/lib/mock-data";

const nav = [
  { group: "Overview", items: [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
  ]},
  { group: "Operations", items: [
    { title: "Fabric Inventory", url: "/inventory", icon: Package },
    { title: "Products", url: "/products", icon: Shirt },
    { title: "Customer Orders", url: "/orders", icon: ShoppingCart },
    { title: "Production", url: "/production", icon: Factory },
  ]},
  { group: "Business", items: [
    { title: "Suppliers", url: "/suppliers", icon: Truck },
    { title: "Billing", url: "/billing", icon: Receipt },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
  ]},
  { group: "Intelligence", items: [
    { title: "AI Stock Assistant", url: "/ai-assistant", icon: Sparkles },
  ]},
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Scissors className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">Atelier ERP</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">Garment Manufacturing</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {nav.map((g) => (
          <SidebarGroup key={g.group}>
            {!collapsed && <SidebarGroupLabel>{g.group}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
            {currentUser.initials}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">{currentUser.role}</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
