"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBuilderStore } from "@/store/builder.store";
import { cn } from "@/lib/utils";
import { Question } from "@/types/form";

type AnswerValue = string | number | boolean | null;
type Answers = Record<string, AnswerValue>;

interface FormExperienceProps {
  formId: string;
}

const RATING_VALUES = [1, 2, 3, 4, 5];

function validateQuestion(question: Question, value: AnswerValue): boolean {
  if (question.required && (value === null || value === undefined || value === "")) {
    return false;
  }

  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (question.type === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
  }

  if (question.type === "number") {
    return Number.isFinite(Number(value));
  }

  return true;
}

function getValidationMessage(question: Question, value: AnswerValue): string | null {
  if (question.required && (value === null || value === undefined || value === "")) {
    return "This question requires an answer.";
  }

  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (question.type === "email" && !validateQuestion(question, value)) {
    return "Enter a valid email address.";
  }

  if (question.type === "number" && !validateQuestion(question, value)) {
    return "Enter a valid number.";
  }

  return null;
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: AnswerValue;
  onChange: (nextValue: AnswerValue) => void;
}) {
  const sharedInputClassName =
    "h-14 rounded-2xl border-slate-300 bg-white/85 px-5 text-lg shadow-sm transition focus-visible:ring-slate-300 md:text-xl";

  switch (question.type) {
    case "short_text":
      return (
        <Input
          autoFocus
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder ?? "Type your answer here..."}
          className={sharedInputClassName}
        />
      );

    case "long_text":
      return (
        <Textarea
          autoFocus
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder ?? "Type your answer here..."}
          className="min-h-44 rounded-[1.75rem] border-slate-300 bg-white/85 px-5 py-4 text-lg shadow-sm transition focus-visible:ring-slate-300 md:text-xl"
        />
      );

    case "email":
      return (
        <Input
          autoFocus
          type="email"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder ?? "name@example.com"}
          className={sharedInputClassName}
        />
      );

    case "number":
      return (
        <Input
          autoFocus
          type="number"
          value={value === null ? "" : String(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder ?? "0"}
          className={cn(sharedInputClassName, "max-w-sm")}
        />
      );

    case "dropdown":
      return (
        <Select
          value={typeof value === "string" ? value : ""}
          onValueChange={(nextValue) => onChange(nextValue)}
        >
          <SelectTrigger className="h-14 w-full rounded-2xl border-slate-300 bg-white/85 px-5 text-lg shadow-sm md:text-xl">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {(question.options ?? []).map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multiple_choice":
      return (
        <div className="grid gap-3">
          {(question.options ?? []).map((option, index) => {
            const selected = value === option.value;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "flex min-h-16 items-center gap-4 rounded-[1.75rem] border px-5 py-4 text-left text-lg transition",
                  selected
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                    : "border-slate-300 bg-white/80 text-slate-900 hover:border-slate-500 hover:bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    selected ? "border-white/30 bg-white/10" : "border-slate-300 bg-slate-50"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      );

    case "yes_no":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[true, false].map((optionValue, index) => {
            const selected = value === optionValue;
            const label = optionValue ? "Yes" : "No";

            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange(optionValue)}
                className={cn(
                  "flex min-h-20 items-center justify-between rounded-[1.75rem] border px-5 py-4 text-left transition",
                  selected
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                    : "border-slate-300 bg-white/80 text-slate-900 hover:border-slate-500 hover:bg-white"
                )}
              >
                <span className="text-xl font-medium">{label}</span>
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border text-sm font-semibold",
                    selected ? "border-white/30 bg-white/10" : "border-slate-300 bg-slate-50"
                  )}
                >
                  {index === 0 ? "Y" : "N"}
                </span>
              </button>
            );
          })}
        </div>
      );

    case "rating":
      return (
        <div className="flex flex-wrap gap-3">
          {RATING_VALUES.map((rating) => {
            const selected = Number(value) === rating;

            return (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                className={cn(
                  "flex size-14 items-center justify-center rounded-2xl border text-xl font-semibold transition",
                  selected
                    ? "border-amber-400 bg-amber-300/30 text-slate-900 shadow-lg"
                    : "border-slate-300 bg-white/80 text-slate-700 hover:border-amber-300 hover:bg-amber-50"
                )}
              >
                {rating}
              </button>
            );
          })}
        </div>
      );

    default:
      return null;
  }
}

export default function FormExperience({ formId }: FormExperienceProps) {
  const router = useRouter();
  const form = useBuilderStore((state) => state.form);
  const questions = useMemo(
    () => [...form.questions].sort((a, b) => a.order - b.order),
    [form.questions]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const hasQuestions = questions.length > 0;
  const boundedIndex = hasQuestions
    ? Math.min(currentIndex, questions.length - 1)
    : 0;
  const currentQuestion = questions[boundedIndex];
  const currentValue = currentQuestion ? answers[currentQuestion.id] ?? null : null;
  const currentIsValid = currentQuestion
    ? validateQuestion(currentQuestion, currentValue)
    : false;
  const currentMessage = currentQuestion
    ? getValidationMessage(currentQuestion, currentValue)
    : null;
  const progress = hasQuestions ? ((boundedIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = boundedIndex === questions.length - 1;

  useEffect(() => {
    if (!hasQuestions || submitted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTextarea = target?.tagName === "TEXTAREA";

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        if (boundedIndex > 0) {
          setDirection(-1);
          setCurrentIndex((index) => index - 1);
        }

        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        if (currentIsValid) {
          if (isLastQuestion) {
            setSubmitted(true);
          } else {
            setDirection(1);
            setCurrentIndex((index) => index + 1);
          }
        }

        return;
      }

      if (event.key === "Enter" && !isTextarea) {
        event.preventDefault();

        if (currentIsValid) {
          if (isLastQuestion) {
            setSubmitted(true);
          } else {
            setDirection(1);
            setCurrentIndex((index) => index + 1);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [boundedIndex, currentIsValid, hasQuestions, isLastQuestion, submitted]);

  const handleAnswerChange = (nextValue: AnswerValue) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((state) => ({
      ...state,
      [currentQuestion.id]: nextValue,
    }));
  };

  const handlePrevious = () => {
    if (boundedIndex === 0) {
      return;
    }

    setDirection(-1);
    setCurrentIndex((index) => index - 1);
  };

  const handleNext = () => {
    if (!currentQuestion || !currentIsValid) {
      return;
    }

    if (isLastQuestion) {
      setSubmitted(true);
      return;
    }

    setDirection(1);
    setCurrentIndex((index) => index + 1);
  };

  if (!hasQuestions) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(241,245,249,0.92)_55%,rgba(226,232,240,0.95))] px-6 py-12 text-slate-900">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[700px] flex-col items-center justify-center gap-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Preview {formId}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            This form has no questions yet
          </h1>
          <p className="text-lg text-slate-600">
            Add a few questions in the builder, then open preview again.
          </p>
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-full px-6"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(241,245,249,0.92)_55%,rgba(226,232,240,0.95))] px-6 py-12 text-slate-900">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[700px] flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full rounded-[2rem] border border-white/70 bg-white/80 px-8 py-12 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="size-8" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              {formId}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Thank You
            </h1>
            <p className="mt-3 text-lg text-slate-600">Response Submitted</p>
            <div className="mt-10 flex justify-center">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-full px-6"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(241,245,249,0.92)_55%,rgba(226,232,240,0.95))] px-6 py-12 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[700px] flex-col justify-center">
        <div className="mb-10 space-y-5">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
            <motion.div
              className="h-full rounded-full bg-slate-900"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-500">
            <span>Preview {formId}</span>
            <span>
              Question {boundedIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        <div className="overflow-hidden">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.section
              key={currentQuestion.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 64 : -64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -64 : 64 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {currentQuestion.title}
                </h1>

                {currentQuestion.description ? (
                  <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                    {currentQuestion.description}
                  </p>
                ) : null}

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  {currentQuestion.required ? (
                    <span className="rounded-full bg-rose-100 px-3 py-1 font-medium text-rose-700">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-600">
                      Optional
                    </span>
                  )}
                </div>
              </div>

              <QuestionField
                question={currentQuestion}
                value={currentValue}
                onChange={handleAnswerChange}
              />

              <div className="min-h-6 text-sm text-rose-600">
                {currentMessage}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CornerDownLeft className="size-4" />
            <span>Enter to continue</span>
            <span className="hidden sm:inline">/</span>
            <span>Arrow keys to move</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 rounded-full px-5"
              onClick={handlePrevious}
              disabled={boundedIndex === 0}
            >
              <ArrowLeft className="size-4" />
              Previous
            </Button>

            <Button
              type="button"
              size="lg"
              className="h-11 rounded-full px-5"
              onClick={handleNext}
              disabled={!currentIsValid}
            >
              {isLastQuestion ? "Submit" : "Next"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
