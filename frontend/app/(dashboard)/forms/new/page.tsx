"use client";

import { useEffect } from "react";
import BuilderToolbar from "@/components/builder/BuilderToolbar";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import { useBuilderStore } from "@/store/builder.store";

export default function NewFormPage() {
  const currentFormId = useBuilderStore((state) => state.currentFormId);
  const createForm = useBuilderStore((state) => state.createForm);

  useEffect(() => {
    if (!currentFormId) {
      createForm();
    }
  }, [createForm, currentFormId]);

  return (
    <div className="min-h-full rounded-[2rem] border border-border/60 bg-linear-to-b from-slate-50 via-white to-slate-100/60 shadow-[0_16px_60px_rgba(15,23,42,0.06)]">
      <BuilderToolbar />
      <BuilderCanvas />
    </div>
  );
}
