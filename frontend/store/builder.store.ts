import { create } from "zustand";
import { Form, Question } from "@/types/form";

interface BuilderState{
    form : Form | null;

    setForm: (form: Form) => void;

    addQuestion: (question: Question) => void;

    updateQuestion: (
        id: String,
        updates: Partial<Question>
    ) => void;

    removeQuestion: (id: String) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  form: null,

  setForm: (form) =>
    set({
      form,
    }),

  addQuestion: (question) =>
    set((state) => {
      if (!state.form) return state;

      return {
        form: {
          ...state.form,
          questions: [...state.form.questions, question],
        },
      };
    }),

  updateQuestion: (id, updates) =>
    set((state) => {
      if (!state.form) return state;

      return {
        form: {
          ...state.form,
          questions: state.form.questions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        },
      };
    }),

  removeQuestion: (id) =>
    set((state) => {
      if (!state.form) return state;

      return {
        form: {
          ...state.form,
          questions: state.form.questions.filter(
            (q) => q.id !== id
          ),
        },
      };
    }),
}));
