"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import FormCard from "@/components/dashboard/FormCard";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/store/builder.store";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forms = useBuilderStore((state) => state.forms);
  const createForm = useBuilderStore((state) => state.createForm);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const filteredForms = useMemo(() => {
    if (!query) {
      return forms;
    }

    return forms.filter((form) => {
      const haystack = [
        form.title,
        form.status,
        form.questions.map((question) => question.title).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [forms, query]);

  if (forms.length === 0) {
    const handleCreateForm = () => {
      createForm();
      router.push("/forms/new");
    };

    return (
      <div className="flex min-h-[calc(100vh-15rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-12"
        >
          <div className="mx-auto flex size-36 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#fef3c7,#fde68a_45%,#f8fafc_100%)] shadow-inner">
            <div className="relative flex size-24 items-center justify-center rounded-[2rem] border border-white/80 bg-white/90 shadow-lg">
              <Sparkles className="size-9 text-amber-500" />
              <div className="absolute -top-3 -right-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                New
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950">
            No forms yet
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-slate-600">
            Create your first form.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              size="lg"
              className="h-12 rounded-full px-6"
              onClick={handleCreateForm}
            >
              <Plus className="size-4" />
              Create Form
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredForms.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            No matching forms
          </h2>
          <p className="mt-3 text-slate-600">
            Try a different search term or create a new form.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredForms.map((form, index) => (
            <FormCard key={form.id} form={form} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
