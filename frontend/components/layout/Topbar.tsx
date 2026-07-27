"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilderStore } from "@/store/builder.store";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);


  const searchValue = searchParams.get("q") ?? "";
  const isDashboard = pathname === "/dashboard";

  const heading = useMemo(() => {
    if (isDashboard) {
      return {
        eyebrow: "Good Morning",
        title: "Welcome back",
        description: "Search, preview, and manage your forms from one place.",
      };
    }

    return {
      eyebrow: "Builder",
      title: "Form workspace",
      description: "Shape questions, refine flow, and preview the public experience.",
    };
  }, [isDashboard]);

  const handleSearchChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handleCreateForm = () => {
    resetBuilder();
    router.push("/forms/new");
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/85 px-5 py-5 backdrop-blur md:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            {heading.eyebrow}
          </p>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {heading.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 md:text-base">
              {heading.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:min-w-80">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search forms..."
              className="h-11 rounded-full border-slate-200 bg-slate-50/80 pr-4 pl-11 text-sm shadow-none focus-visible:ring-slate-200"
            />
          </div>

          <Button
            type="button"
            size="lg"
            className="h-11 rounded-full px-5"
            onClick={handleCreateForm}
          >
            <Plus className="size-4" />
            Create Form
          </Button>
        </div>
      </div>
    </header>
  );
}
