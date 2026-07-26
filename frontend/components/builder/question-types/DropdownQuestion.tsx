import { Question, QuestionOption } from "@/types/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionTypePreviewProps {
  question: Question;
  selected?: boolean;
  onOptionsChange?: (options: QuestionOption[]) => void;
}

export default function DropdownQuestion({
  question,
  selected = false,
  onOptionsChange,
}: QuestionTypePreviewProps) {
  const options = question.options ?? [];

  return (
    <div className="space-y-3">
      {selected ? (
        <div className="space-y-2">
          {options.map((option) => (
            <Input
              key={option.id}
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
          ))}
        </div>
      ) : (
        <Select disabled>
          <SelectTrigger className="max-w-md bg-muted/30">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
