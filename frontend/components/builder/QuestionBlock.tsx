"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { Question, QuestionType } from "@/types/form";
import { useBuilderStore } from "@/store/builder.store";
import {
  getDefaultOptionsForType,
  getQuestionTypeLabel,
  QUESTION_TYPE_CONFIG,
} from "@/lib/question-types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionRenderer from "./QuestionRenderer";

interface QuestionBlockProps {
  question: Question;
}

export default function QuestionBlock({ question }: QuestionBlockProps) {
  const {
    selectedQuestionId,
    selectQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
  } = useBuilderStore();

  const selected = selectedQuestionId === question.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTypeChange = (value: QuestionType | null) => {
    if (!value) {
      return;
    }

    const nextOptions = getDefaultOptionsForType(value);
    const shouldKeepOptions =
      (value === "dropdown" || value === "multiple_choice") &&
      (question.type === "dropdown" || question.type === "multiple_choice") &&
      (question.options?.length ?? 0) > 0;

    updateQuestion(question.id, {
      type: value,
      title:
        question.title === getQuestionTypeLabel(question.type)
          ? getQuestionTypeLabel(value)
          : question.title,
      options: shouldKeepOptions ? question.options : nextOptions ?? [],
    });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{
        opacity: isDragging ? 0.85 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: selected ? 0 : -3 }}
      onClick={(event) => {
        event.stopPropagation();
        selectQuestion(question.id);
      }}
      className={cn(
        "group rounded-[2rem] border bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-shadow md:p-6",
        selected
          ? "border-blue-500 ring-2 ring-blue-500/20 shadow-[0_18px_48px_rgba(37,99,235,0.16)]"
          : "border-border hover:border-blue-200 hover:shadow-[0_18px_48px_rgba(15,23,42,0.10)]"
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            className="mt-1 cursor-grab rounded-xl p-2 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted active:cursor-grabbing"
            aria-label="Move question"
            onClick={(event) => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-blue-100 bg-blue-50 text-blue-700"
              >
                {getQuestionTypeLabel(question.type)}
              </Badge>
              {question.required ? (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  Required
                </Badge>
              ) : null}
            </div>

            <Input
              value={question.title}
              onChange={(event) =>
                updateQuestion(question.id, { title: event.target.value })
              }
              onClick={(event) => event.stopPropagation()}
              className="h-auto border-none px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
              placeholder="Question title"
            />

            <Textarea
              value={question.description ?? ""}
              onChange={(event) =>
                updateQuestion(question.id, {
                  description: event.target.value,
                })
              }
              onClick={(event) => event.stopPropagation()}
              placeholder="Add a description (optional)"
              className="min-h-10 resize-none border-none bg-transparent px-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div
          className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate question"
            onClick={() => duplicateQuestion(question.id)}
          >
            <Copy className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Delete question"
            onClick={() => deleteQuestion(question.id)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.18 }}
          className="mb-4"
          onClick={(event) => event.stopPropagation()}
        >
          <Select value={question.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full max-w-xs rounded-full border-blue-100 bg-blue-50 text-blue-700">
              <SelectValue>{getQuestionTypeLabel(question.type)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPE_CONFIG.map((config) => (
                <SelectItem key={config.type} value={config.type}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}

      <div
        className="mb-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <QuestionRenderer
          question={question}
          selected={selected}
          onOptionsChange={(options) =>
            updateQuestion(question.id, { options })
          }
        />
      </div>

      <div
        className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4"
        onClick={(event) => event.stopPropagation()}
      >
        <Label className="text-sm text-muted-foreground">Required</Label>
        <Switch
          checked={question.required}
          onCheckedChange={(checked) =>
            updateQuestion(question.id, { required: checked })
          }
        />
      </div>
    </motion.div>
  );
}
