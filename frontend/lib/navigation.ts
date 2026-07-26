import {
    LayoutDashboard, FileText, PlusCircle, Settings
} from 'lucide-react';

export const sidebarItems = [
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
    }
]