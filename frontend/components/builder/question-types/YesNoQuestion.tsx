import { Question } from "@/types/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionTypePreviewProps {
  question: Question;
}

export default function YesNoQuestion({ question }: QuestionTypePreviewProps) {
  void question;

  return (
    <div className="flex flex-wrap gap-3">
      {["Yes", "No"].map((label, index) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          disabled
          className={cn(
            "min-w-24",
            index === 0 && "border-primary bg-primary/5 text-primary"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
