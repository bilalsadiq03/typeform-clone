import { Question } from "@/types/form";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionTypePreviewProps {
  question: Question;
}

export default function RatingQuestion({ question }: QuestionTypePreviewProps) {
  void question;

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <button
          key={index}
          type="button"
          disabled
          className={cn(
            "flex size-10 items-center justify-center rounded-lg border transition-colors",
            index < 3
              ? "border-amber-300 bg-amber-50 text-amber-500"
              : "border-border bg-muted/30 text-muted-foreground"
          )}
        >
          <Star
            className={cn("size-5", index < 3 && "fill-amber-400 text-amber-400")}
          />
        </button>
      ))}
    </div>
  );
}
