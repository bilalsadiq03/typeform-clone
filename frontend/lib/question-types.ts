import { QuestionOption, QuestionType } from "@/types/form";
import {
  AlignLeft,
  CircleDot,
  Hash,
  List,
  Mail,
  Star,
  TextCursorInput,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";

export interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const QUESTION_TYPE_CONFIG: QuestionTypeConfig[] = [
  {
    type: "short_text",
    label: "Short Text",
    description: "Single line answer",
    icon: TextCursorInput,
  },
  {
    type: "long_text",
    label: "Long Text",
    description: "Multi-line answer",
    icon: AlignLeft,
  },
  {
    type: "email",
    label: "Email",
    description: "Email address",
    icon: Mail,
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric input",
    icon: Hash,
  },
  {
    type: "dropdown",
    label: "Dropdown",
    description: "Select one option",
    icon: List,
  },
  {
    type: "multiple_choice",
    label: "Multiple Choice",
    description: "Pick one option",
    icon: CircleDot,
  },
  {
    type: "rating",
    label: "Rating",
    description: "Star rating scale",
    icon: Star,
  },
  {
    type: "yes_no",
    label: "Yes / No",
    description: "Binary choice",
    icon: ToggleLeft,
  },
];

export function getQuestionTypeLabel(type: QuestionType): string {
  return (
    QUESTION_TYPE_CONFIG.find((config) => config.type === type)?.label ?? type
  );
}

export function createDefaultOptions(): QuestionOption[] {
  return [
    {
      id: crypto.randomUUID(),
      label: "Option 1",
      value: "option_1",
      order: 1,
    },
    {
      id: crypto.randomUUID(),
      label: "Option 2",
      value: "option_2",
      order: 2,
    },
  ];
}

export function getDefaultOptionsForType(
  type: QuestionType
): QuestionOption[] | undefined {
  if (type === "multiple_choice" || type === "dropdown") {
    return createDefaultOptions();
  }

  return undefined;
}
