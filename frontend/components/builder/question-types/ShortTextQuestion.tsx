import { Question } from "@/types/form";
import { Input } from "@/components/ui/input";

interface QuestionTypePreviewProps {
  question: Question;
}

export default function ShortTextQuestion({
  question,
}: QuestionTypePreviewProps) {
  return (
    <Input
      disabled
      placeholder={question.placeholder ?? "Type your answer here..."}
      className="max-w-md bg-muted/30"
    />
  );
}
