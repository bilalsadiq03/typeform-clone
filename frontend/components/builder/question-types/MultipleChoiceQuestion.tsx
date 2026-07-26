import { Question, QuestionOption } from "@/types/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuestionTypePreviewProps {
  question: Question;
  selected?: boolean;
  onOptionsChange?: (options: QuestionOption[]) => void;
}

export default function MultipleChoiceQuestion({
  question,
  selected = false,
  onOptionsChange,
}: QuestionTypePreviewProps) {
  const options = question.options ?? [];

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium",
              index === 0 ? "border-primary bg-primary/10" : "border-muted-foreground/30"
            )}
          >
            {String.fromCharCode(65 + index)}
          </span>

          {selected ? (
            <Input
              value={option.label}
              onChange={(event) =>
                onOptionsChange?.(
                  options.map((item) =>
                    item.id === option.id
                      ? { ...item, label: event.target.value }
                      : item
                  )
                )
              }
              className="max-w-md"
            />
          ) : (
            <span className="text-sm text-muted-foreground">{option.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
