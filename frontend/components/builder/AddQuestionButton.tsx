"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QUESTION_TYPE_CONFIG } from "@/lib/question-types";
import { useBuilderStore } from "@/store/builder.store";
import { useState } from "react";

export default function AddQuestionButton() {
  const { createQuestion } = useBuilderStore();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button type="button" size="lg" className="rounded-full px-5">
            <Plus className="size-4" />
            Add Question
          </Button>
        }
      />
      <PopoverContent
        sideOffset={12}
        align="center"
        className="w-[min(92vw,26rem)] rounded-3xl border border-border/80 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.16)]"
      >
        <PopoverHeader className="px-1 pb-2">
          <PopoverTitle>Add a question</PopoverTitle>
          <PopoverDescription>
            Pick a question type to add it to your form.
          </PopoverDescription>
        </PopoverHeader>

        <div className="grid gap-1.5">
          {QUESTION_TYPE_CONFIG.map((config, index) => {
            const Icon = config.icon;

            return (
              <motion.button
                key={config.type}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.02 }}
                className="flex items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-muted"
                onClick={() => {
                  createQuestion(config.type);
                  setOpen(false);
                }}
              >
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {config.label}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
