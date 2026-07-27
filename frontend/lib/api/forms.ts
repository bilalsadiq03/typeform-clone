import { api } from "./client";
import type { Form, Question } from "@/types/form";

// ---------------------------------------------------------------------------
// API DTOs — shape of the raw JSON returned by the FastAPI backend.
// These are kept lightweight; only fields that differ from the frontend model
// (snake_case vs camelCase, or extra backend-only fields) are listed here.
// ---------------------------------------------------------------------------

export interface ApiQuestion extends Question {
  form_id: string;
}

export interface ApiForm
  extends Omit<Form, "questions" | "createdAt" | "updatedAt" | "responseCount"> {
  response_count: number;
  created_at: string;
  updated_at: string;
  questions: ApiQuestion[];
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export interface CreateFormPayload {
  title: string;
  description?: string;
}

export interface UpdateFormPayload {
  title?: string;
  description?: string;
  status?: "draft" | "published";
  questions?: Question[];
}

// ---------------------------------------------------------------------------
// Mapper — converts an API DTO into the canonical frontend Form model.
// ---------------------------------------------------------------------------

function mapForm(form: ApiForm): Form {
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    status: form.status,
    slug: form.slug,
    questions: form.questions,
    responseCount: form.response_count,
    createdAt: form.created_at,
    updatedAt: form.updated_at,
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

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

export async function deleteForm(id: string): Promise<void> {
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