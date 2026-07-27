import { api } from "./client";

export interface AnswerPayload {
  question_id: string;
  value: string;
}

export interface SubmitResponsePayload {
  form_id: string;
  answers: AnswerPayload[];
}

export async function submitResponse(payload: SubmitResponsePayload) {
  const { data } = await api.post("/responses", payload);
  return data;
}