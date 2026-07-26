import { Question, QuestionOption, QuestionType } from "@/types/form";
import ShortTextQuestion from "./question-types/ShortTextQuestion";
import LongTextQuestion from "./question-types/LongTextQuestion";
import EmailQuestion from "./question-types/EmailQuestion";
import NumberQuestion from "./question-types/NumberQuestion";
import DropdownQuestion from "./question-types/DropdownQuestion";
import MultipleChoiceQuestion from "./question-types/MultipleChoiceQuestion";
import RatingQuestion from "./question-types/RatingQuestion";
import YesNoQuestion from "./question-types/YesNoQuestion";

interface QuestionRendererProps {
  question: Question;
  selected?: boolean;
  onOptionsChange?: (options: QuestionOption[]) => void;
}

const QUESTION_RENDERERS: Record<
  QuestionType,
  React.ComponentType<QuestionRendererProps>
> = {
  short_text: ShortTextQuestion,
  long_text: LongTextQuestion,
  email: EmailQuestion,
  number: NumberQuestion,
  dropdown: DropdownQuestion,
  multiple_choice: MultipleChoiceQuestion,
  rating: RatingQuestion,
  yes_no: YesNoQuestion,
};

export default function QuestionRenderer({
  question,
  selected = false,
  onOptionsChange,
}: QuestionRendererProps) {
  const Component = QUESTION_RENDERERS[question.type];

  return (
    <Component
      question={question}
      selected={selected}
      onOptionsChange={onOptionsChange}
    />
  );
}
