import { Question } from "@/types/form";
import { Input } from "@/components/ui/input";

interface QuestionTypePreviewProps {
  question: Question;
}

export default function NumberQuestion({ question }: QuestionTypePreviewProps) {
  return (
    <Input
      disabled
      type="number"
      placeholder={question.placeholder ?? "0"}
      className="max-w-xs bg-muted/30"
    />
  );
}
