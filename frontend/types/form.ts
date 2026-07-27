export type FormStatus = "draft" | "published";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "email"
  | "dropdown"
  | "number"
  | "yes_no"
  | "rating";

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  order: number;
}

export interface Question {
  id: string;
  type: QuestionType;

  title: string;
  description?: string;

  required: boolean;

  placeholder?: string;

  order: number;

  options?: QuestionOption[];
}

export interface Form {
  id: string;

  title: string;
  description?: string;

  status: FormStatus;

  slug: string;

  questions: Question[];

  responseCount: number;

  createdAt: string;
  updatedAt: string;
}
