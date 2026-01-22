"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  MapPin,
  Image as ImageIcon,
  Newspaper,
  Wrench,
  FileSpreadsheet,
  Users,
  Car,
  List
} from "lucide-react";

const navItems = [
  { title: "Audit Console", href: "/admin", icon: List },
  { title: "Events", href: "/admin/events", icon: Calendar },
  { title: "Results", href: "/admin/results", icon: FileSpreadsheet },
  { title: "Seasons", href: "/admin/seasons", icon: Trophy },
  { title: "Series", href: "/admin/series", icon: LayoutDashboard }, // reusing icon
  { title: "Venues", href: "/admin/venues", icon: MapPin },
  { title: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { title: "News", href: "/admin/news", icon: Newspaper },
  { title: "Driver Mappings", href: "/admin/drivers", icon: Users },
  { title: "Car Mappings", href: "/admin/cars", icon: Car },
  { title: "Misc. Tools", href: "/admin/tools", icon: Wrench },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-black/50 min-h-[calc(100vh-4rem)] hidden md:block">
      <div className="p-4">
        <h2 className="text-lg font-bold text-white/80 px-4 mb-4">Admin</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-lsr-orange text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={16} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
