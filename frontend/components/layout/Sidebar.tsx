"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, LayoutDashboard, Settings } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/75 px-5 py-6 backdrop-blur xl:flex xl:flex-col">
      <Logo />

      <nav className="mt-10 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all",
                active
                  ? "bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]"
                  : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-950",
                item.disabled && "pointer-events-none opacity-45"
              )}
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Local Mode
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Dashboard, builder, and preview are all running on local Zustand state with no backend dependency.
        </p>
      </div>
    </aside>
  );
}
