"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export default function SidebarItem({
  title,
  href,
  icon: Icon,
  disabled,
}: SidebarItemProps) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      href={disabled ? "#" : href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
        active
          ? "bg-black text-white"
          : "hover:bg-gray-100",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <Icon size={20} />
      <span>{title}</span>
    </Link>
  );
}