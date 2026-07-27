import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { Form, Question, QuestionType } from "@/types/form";
import {
  getDefaultOptionsForType,
  getQuestionTypeLabel,
} from "@/lib/question-types";

interface BuilderState {
  forms: Form[];
  form: Form;
  currentFormId: string | null;
  selectedQuestionId: string | null;
  setTitle: (title: string) => void;
  createForm: () => string;
  setCurrentForm: (id: string) => void;
  createQuestion: (type: QuestionType) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  reorderQuestions: (activeId: string, overId: string) => void;
  selectQuestion: (id: string | null) => void;
  publishForm: (id?: string) => void;
  duplicateForm: (id: string) => string | null;
  deleteForm: (id: string) => void;
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
    id: crypto.randomUUID(),
    title: "Untitled Form",
    description: "",
    status: "draft",
    questions: [],
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

function cloneQuestion(question: Question): Question {
  return {
    ...question,
    options: question.options?.map((option) => ({ ...option })),
  };
}

function cloneForm(form: Form): Form {
  return {
    ...form,
    questions: form.questions.map(cloneQuestion),
  };
}

function updateFormCollection(forms: Form[], updatedForm: Form): Form[] {
  return forms.map((form) => (form.id === updatedForm.id ? updatedForm : form));
}

const seededForms: Form[] = [
  createBlankForm({
    title: "Product Feedback Pulse",
    status: "published",
    createdAt: "2026-07-21T08:45:00.000Z",
    updatedAt: "2026-07-26T16:15:00.000Z",
    questions: normalizeQuestionOrders([
      createQuestion("short_text", {
        title: "What should we call you?",
        placeholder: "Your name",
      }),
      createQuestion("rating", {
        title: "How would you rate the new onboarding?",
        required: true,
      }),
      createQuestion("long_text", {
        title: "What would make the experience better?",
        placeholder: "Share your feedback",
      }),
    ]),
  }),
  createBlankForm({
    title: "Hiring Screen",
    status: "draft",
    createdAt: "2026-07-20T10:20:00.000Z",
    updatedAt: "2026-07-25T12:10:00.000Z",
    questions: normalizeQuestionOrders([
      createQuestion("short_text", {
        title: "Tell us your full name",
        required: true,
      }),
      createQuestion("email", {
        title: "What email should we contact?",
        required: true,
      }),
      createQuestion("dropdown", {
        title: "Which role are you applying for?",
        options: [
          {
            id: crypto.randomUUID(),
            label: "Frontend Engineer",
            value: "frontend_engineer",
            order: 1,
          },
          {
            id: crypto.randomUUID(),
            label: "Product Designer",
            value: "product_designer",
            order: 2,
          },
          {
            id: crypto.randomUUID(),
            label: "Growth Lead",
            value: "growth_lead",
            order: 3,
          },
        ],
      }),
    ]),
  }),
  createBlankForm({
    title: "Event RSVP",
    status: "published",
    createdAt: "2026-07-19T13:30:00.000Z",
    updatedAt: "2026-07-24T18:40:00.000Z",
    questions: normalizeQuestionOrders([
      createQuestion("yes_no", {
        title: "Will you be attending in person?",
        required: true,
      }),
      createQuestion("multiple_choice", {
        title: "Pick your session track",
        options: [
          {
            id: crypto.randomUUID(),
            label: "Design Systems",
            value: "design_systems",
            order: 1,
          },
          {
            id: crypto.randomUUID(),
            label: "Growth",
            value: "growth",
            order: 2,
          },
          {
            id: crypto.randomUUID(),
            label: "AI Workflows",
            value: "ai_workflows",
            order: 3,
          },
        ],
      }),
      createQuestion("number", {
        title: "How many guests are joining?",
        placeholder: "0",
      }),
    ]),
  }),
];

const initialForm = cloneForm(seededForms[0]);

export const useBuilderStore = create<BuilderState>((set, get) => ({
  forms: seededForms.map(cloneForm),
  form: initialForm,
  currentFormId: initialForm.id,
  selectedQuestionId: null,

  setTitle: (title) =>
    set((state) => {
      const updatedForm = {
        ...state.form,
        title,
        updatedAt: now(),
      };

      return {
        form: updatedForm,
        forms: updateFormCollection(state.forms, updatedForm),
      };
    }),

  createForm: () => {
    const nextForm = createBlankForm();

    set((state) => ({
      forms: [nextForm, ...state.forms],
      form: nextForm,
      currentFormId: nextForm.id,
      selectedQuestionId: null,
    }));

    return nextForm.id;
  },

  setCurrentForm: (id) =>
    set((state) => {
      const nextForm = state.forms.find((form) => form.id === id);

      if (!nextForm) {
        return state;
      }

      return {
        form: cloneForm(nextForm),
        currentFormId: nextForm.id,
        selectedQuestionId: null,
      };
    }),

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
        forms: updateFormCollection(state.forms, updatedForm),
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
        forms: updateFormCollection(state.forms, updatedForm),
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
        forms: updateFormCollection(state.forms, updatedForm),
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
        forms: updateFormCollection(state.forms, updatedForm),
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
        forms: updateFormCollection(state.forms, updatedForm),
      };
    }),

  selectQuestion: (id) =>
    set({
      selectedQuestionId: id,
    }),

  publishForm: (id) =>
    set((state) => {
      const targetId = id ?? state.currentFormId;

      if (!targetId) {
        return state;
      }

      const nextForms: Form[] = state.forms.map((form): Form =>
        form.id === targetId
          ? {
              ...form,
              status: "published",
              updatedAt: now(),
            }
          : form
      );
      const nextCurrent = nextForms.find((form) => form.id === state.currentFormId);

      return {
        forms: nextForms,
        form: nextCurrent ? cloneForm(nextCurrent) : state.form,
      };
    }),

  duplicateForm: (id) => {
    const state = get();
    const original = state.forms.find((form) => form.id === id);

    if (!original) {
      return null;
    }

    const duplicatedFormSource: Form = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (copy)`,
      status: "draft",
      createdAt: now(),
      updatedAt: now(),
      questions: normalizeQuestionOrders(
        original.questions.map((question) => ({
          ...cloneQuestion(question),
          id: crypto.randomUUID(),
          options: question.options?.map((option) => ({
            ...option,
            id: crypto.randomUUID(),
          })),
        }))
      ),
    };
    const duplicatedForm = cloneForm(duplicatedFormSource);

    set((current) => ({
      forms: [duplicatedForm, ...current.forms],
    }));

    return duplicatedForm.id;
  },

  deleteForm: (id) =>
    set((state) => {
      const nextForms = state.forms.filter((form) => form.id !== id);

      if (state.currentFormId !== id) {
        return {
          forms: nextForms,
        };
      }

      const fallbackForm = nextForms[0];

      if (!fallbackForm) {
        return {
          forms: [],
          currentFormId: null,
          selectedQuestionId: null,
        };
      }

      return {
        forms: nextForms,
        form: cloneForm(fallbackForm),
        currentFormId: fallbackForm.id,
        selectedQuestionId: null,
      };
    }),
}));
