import { api } from "./client";
import type { Form, Question, QuestionType } from "@/types/form";
import type { Question as BuilderQuestion } from "@/types/form";

export interface ApiQuestion extends Question {
  form_id: string;
}

export interface ApiForm
  extends Omit<Form, "questions" | "createdAt" | "updatedAt"> {
  slug: string;
  created_at: string;
  updated_at: string;
  questions: ApiQuestion[];
}

export interface CreateFormPayload {
  title: string;
  description?: string;
}

export interface UpdateFormPayload {
  title?: string;
  description?: string;
  status?: "draft" | "published";
  questions?: BuilderQuestion[];
}

export interface ApiQuestion extends Question {
  form_id: string;
}

export interface ApiForm extends Omit<Form, "questions" | "createdAt" | "updatedAt"> {
  created_at: string;
  updated_at: string;
  question: ApiQuestion[];
}

function mapForm(form: ApiForm): Form {
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    status: form.status,
    questions: form.questions,
    createdAt: form.created_at,
    updatedAt: form.updated_at,
  };
}

export async function getForms(): Promise<Form[]> {
  const { data } = await api.get<ApiForm[]>("/forms");
  return data.map(mapForm);
}

export async function getForm(id: string): Promise<Form> {
  const { data } = await api.get<ApiForm>(`/forms/${id}`);
  return mapForm(data);
}

export async function createForm(payload: CreateFormPayload): Promise<Form> {
  const { data } = await api.post<ApiForm>("/forms", payload);
  return mapForm(data);
}

export async function deleteForm(id: string) {
  await api.delete(`/forms/${id}`);
}

export async function duplicateForm(id: string): Promise<Form> {
  const { data } = await api.post<ApiForm>(`/forms/${id}/duplicate`);
  return mapForm(data);
}

export async function publishForm(id: string): Promise<Form> {
  const { data } = await api.post<ApiForm>(`/forms/${id}/publish`);
  return mapForm(data);
}

export async function updateForm(
  id: string,
  payload: UpdateFormPayload
): Promise<Form> {
  const { data } = await api.patch<ApiForm>(`/forms/${id}`, payload);
  return mapForm(data);
}