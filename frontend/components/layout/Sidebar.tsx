"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import {
  LayoutDashboard,
  FileText,
  CirclePlus,
  Settings,
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Forms",
    href: "/dashboard",
    icon: FileText,
  },
  {
    title: "Create Form",
    href: "/forms/new",
    icon: CirclePlus,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
    disabled: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white p-5 flex flex-col">
      <Logo />

      <nav className="mt-8 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.disabled ? "#" : item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                active
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } ${item.disabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}