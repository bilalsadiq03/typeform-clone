import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { Form, Question, QuestionType } from "@/types/form";
import {
  getDefaultOptionsForType,
  getQuestionTypeLabel,
} from "@/lib/question-types";

interface BuilderState {
  form: Form;

  selectedQuestionId: string | null;

  setTitle: (title: string) => void;

  createQuestion: (type: QuestionType) => void;

  updateQuestion: (id: string, updates: Partial<Question>) => void;

  deleteQuestion: (id: string) => void;

  duplicateQuestion: (id: string) => void;

  reorderQuestions: (activeId: string, overId: string) => void;

  selectQuestion: (id: string | null) => void;

  publishForm: () => void;
}

const now = () => new Date().toISOString();

const initialForm: Form = {
  id: crypto.randomUUID(),
  title: "Untitled Form",
  description: "",
  status: "draft",
  questions: [],
  createdAt: now(),
  updatedAt: now(),
};

function normalizeQuestionOrders(questions: Question[]): Question[] {
  return questions.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
}

export const useBuilderStore = create<BuilderState>((set) => ({
  form: initialForm,

  selectedQuestionId: null,

  setTitle: (title) =>
    set((state) => ({
      form: {
        ...state.form,
        title,
        updatedAt: now(),
      },
    })),

  createQuestion: (type) =>
    set((state) => {
      const defaultOptions = getDefaultOptionsForType(type);
      const nextQuestion: Question = {
        id: crypto.randomUUID(),
        type,
        title: getQuestionTypeLabel(type),
        description: "",
        required: false,
        order: state.form.questions.length + 1,
        options: defaultOptions ?? [],
      };

      return {
        form: {
          ...state.form,
          updatedAt: now(),
          questions: [
            ...state.form.questions,
            nextQuestion,
          ],
        },
        selectedQuestionId: nextQuestion.id,
      };
    }),

  updateQuestion: (id, updates) =>
    set((state) => ({
      form: {
        ...state.form,
        updatedAt: now(),
        questions: state.form.questions.map((question) =>
          question.id === id ? { ...question, ...updates } : question
        ),
      },
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      form: {
        ...state.form,
        updatedAt: now(),
        questions: normalizeQuestionOrders(
          state.form.questions.filter((question) => question.id !== id)
        ),
      },
      selectedQuestionId:
        state.selectedQuestionId === id ? null : state.selectedQuestionId,
    })),

  duplicateQuestion: (id) =>
    set((state) => {
      const index = state.form.questions.findIndex(
        (question) => question.id === id
      );

      if (index === -1) {
        return state;
      }

      const original = state.form.questions[index];
      const copy: Question = {
        ...original,
        id: crypto.randomUUID(),
        title: `${original.title} (copy)`,
        options: original.options?.map((option) => ({
          ...option,
          id: crypto.randomUUID(),
        })),
      };

      const questions = [...state.form.questions];
      questions.splice(index + 1, 0, copy);

      return {
        form: {
          ...state.form,
          updatedAt: now(),
          questions: normalizeQuestionOrders(questions),
        },
        selectedQuestionId: copy.id,
      };
    }),

  reorderQuestions: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.form.questions.findIndex(
        (question) => question.id === activeId
      );
      const newIndex = state.form.questions.findIndex(
        (question) => question.id === overId
      );

      if (oldIndex === -1 || newIndex === -1) {
        return state;
      }

      return {
        form: {
          ...state.form,
          updatedAt: now(),
          questions: normalizeQuestionOrders(
            arrayMove(state.form.questions, oldIndex, newIndex)
          ),
        },
      };
    }),

  selectQuestion: (id) =>
    set({
      selectedQuestionId: id,
    }),

  publishForm: () =>
    set((state) => ({
      form: {
        ...state.form,
        status: "published",
        updatedAt: now(),
      },
    })),
}));
