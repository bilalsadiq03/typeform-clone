"use client";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "@/lib/navigation";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white p-5">
      <Logo />

      <nav className="mt-10 flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.title}
            {...item}
          />
        ))}
      </nav>
    </aside>
  );
}