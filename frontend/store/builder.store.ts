import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { Form, Question, QuestionType } from "@/types/form";
import {
  getDefaultOptionsForType,
  getQuestionTypeLabel,
} from "@/lib/question-types";

interface BuilderState {
  // Active builder state & actions
  form: Form;
  currentFormId: string | null;
  selectedQuestionId: string | null;
  setTitle: (title: string) => void;
  createQuestion: (type: QuestionType) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  reorderQuestions: (activeId: string, overId: string) => void;
  selectQuestion: (id: string | null) => void;
  publishForm: (id?: string) => void;
  initializeForm: (form: Form) => void;
  resetBuilder: () => void;
}

const now = () => new Date().toISOString();

function createQuestion(
  type: QuestionType,
  overrides: Partial<Question> = {}
): Question {
  return {
    id: crypto.randomUUID(),
    type,
    title: getQuestionTypeLabel(type),
    description: "",
    required: false,
    order: 1,
    options: getDefaultOptionsForType(type) ?? [],
    ...overrides,
  };
}

function createBlankForm(overrides: Partial<Form> = {}): Form {
  const timestamp = now();

  return {
    id: "",
    title: "Untitled Form",
    description: "",
    status: "draft",
    slug: "",
    questions: [],
    responseCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

function normalizeQuestionOrders(questions: Question[]): Question[] {
  return questions.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
}

const initialForm = createBlankForm();

export const useBuilderStore = create<BuilderState>((set) => ({
  // Active builder state
  form: initialForm,
  currentFormId: null,
  selectedQuestionId: null,

  setTitle: (title) =>
    set((state) => ({
      form: {
        ...state.form,
        title,
        updatedAt: now(),
      },
    })),

  initializeForm: (form: Form) => {
    set({
      form,
      currentFormId: form.id,
      selectedQuestionId: null,
    });
  },

  createQuestion: (type) =>
    set((state) => {
      const nextQuestion = createQuestion(type, {
        order: state.form.questions.length + 1,
      });
      const updatedForm = {
        ...state.form,
        updatedAt: now(),
        questions: [...state.form.questions, nextQuestion],
      };

      return {
        form: updatedForm,
        selectedQuestionId: nextQuestion.id,
      };
    }),

  updateQuestion: (id, updates) =>
    set((state) => {
      const updatedForm = {
        ...state.form,
        updatedAt: now(),
        questions: state.form.questions.map((question) =>
          question.id === id ? { ...question, ...updates } : question
        ),
      };

      return {
        form: updatedForm,
      };
    }),

  deleteQuestion: (id) =>
    set((state) => {
      const updatedForm = {
        ...state.form,
        updatedAt: now(),
        questions: normalizeQuestionOrders(
          state.form.questions.filter((question) => question.id !== id)
        ),
      };

      return {
        form: updatedForm,
        selectedQuestionId:
          state.selectedQuestionId === id ? null : state.selectedQuestionId,
      };
    }),

  duplicateQuestion: (id) =>
    set((state) => {
      const index = state.form.questions.findIndex((question) => question.id === id);

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

      const updatedForm = {
        ...state.form,
        updatedAt: now(),
        questions: normalizeQuestionOrders(questions),
      };

      return {
        form: updatedForm,
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

      const updatedForm = {
        ...state.form,
        updatedAt: now(),
        questions: normalizeQuestionOrders(
          arrayMove(state.form.questions, oldIndex, newIndex)
        ),
      };

      return {
        form: updatedForm,
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

  resetBuilder: () => {
    set({
      currentFormId: null,
      selectedQuestionId: null,
      form: createBlankForm({ id: "" }),
    });
  },
}));
