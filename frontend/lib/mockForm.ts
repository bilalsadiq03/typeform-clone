import { Form } from "@/types/form";

export const mockForm: Form = {
  id: "1",
  title: "Customer Feedback Survey",
  description: "Help us improve our product.",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: [
    {
      id: "q1",
      type: "short_text",
      title: "What is your name?",
      required: true,
      order: 1,
    },
    {
      id: "q2",
      type: "email",
      title: "Email Address",
      required: true,
      order: 2,
    },
  ],
};