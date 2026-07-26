"use client";

import { useEffect } from "react";
import { mockForm } from "@/lib/mockForm";
import { useBuilderStore } from "@/store/builder.store";

export default function NewFormPage() {
  const { form, setForm } = useBuilderStore();

  useEffect(() => {
    setForm(mockForm);
  }, [setForm]);

  return (
    <div className="p-10">
      <h1>{form?.title}</h1>

      <ul>
        {form?.questions.map((question) => (
          <li key={question.id}>
            {question.title}
          </li>
        ))}
      </ul>
    </div>
  );
}