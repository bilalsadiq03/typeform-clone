import { Question } from "@/types/form";
import { Textarea } from "@/components/ui/textarea";

interface QuestionTypePreviewProps {
  question: Question;
}

export default function LongTextQuestion({
  question,
}: QuestionTypePreviewProps) {
  return (
    <Textarea
      disabled
      placeholder={question.placeholder ?? "Type your answer here..."}
      className="max-w-lg bg-muted/30"
    />
  );
}
