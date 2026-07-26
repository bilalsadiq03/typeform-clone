"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
} from "lucide-react";

import Logo from "./Logo";

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
        icon: PlusCircle,
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
        <aside className="flex h-screen w-64 flex-col border-r bg-white p-5">
            <Logo />

            <nav className="mt-10 flex flex-col gap-2">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.disabled ? "#" : item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                                pathname === item.href
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                            } ${item.disabled ? "pointer-events-none opacity-50" : ""}`}
                        >
                            <Icon size={20} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}