"use client";

import { useEffect } from "react";
import BuilderToolbar from "@/components/builder/BuilderToolbar";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import { useBuilderStore } from "@/store/builder.store";
import { createForm as createFormApi } from "@/lib/api/forms";

export default function NewFormPage() {
  const currentFormId = useBuilderStore((state) => state.currentFormId);
  const initializeForm = useBuilderStore((state) => state.initializeForm);

  useEffect(() => {
    async function bootstrap() {
      if (currentFormId) return;

      try {
        const backendForm = await createFormApi({
          title: "Untitled Form",
          description: "",
        });

        initializeForm({
          id: backendForm.id,
          title: backendForm.title,
          description: backendForm.description ?? "",
          status: backendForm.status,
          slug: backendForm.slug,
          questions: [],
          responseCount: backendForm.responseCount,
          createdAt: backendForm.createdAt,
          updatedAt: backendForm.updatedAt,
        });
      } catch (err) {
        console.error(err);
      }
    }

    bootstrap();
  }, [currentFormId, initializeForm]);

  return (
    <div className="min-h-full rounded-[2rem] border border-border/60 bg-linear-to-b from-slate-50 via-white to-slate-100/60 shadow-[0_16px_60px_rgba(15,23,42,0.06)]">
      <BuilderToolbar />
      <BuilderCanvas />
    </div>
  );
}
