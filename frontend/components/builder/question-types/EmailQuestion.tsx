import { Question } from "@/types/form";
import { Input } from "@/components/ui/input";

interface QuestionTypePreviewProps {
  question: Question;
}

export default function EmailQuestion({ question }: QuestionTypePreviewProps) {
  return (
    <Input
      disabled
      type="email"
      placeholder={question.placeholder ?? "name@example.com"}
      className="max-w-md bg-muted/30"
    />
  );
}
