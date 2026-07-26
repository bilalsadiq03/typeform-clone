"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import QuestionBlock from "./QuestionBlock";
import BuilderEmptyState from "./BuilderEmptyState";
import AddQuestionButton from "./AddQuestionButton";
import { useBuilderStore } from "@/store/builder.store";

export default function BuilderCanvas() {
  const { form, reorderQuestions, selectQuestion } = useBuilderStore();

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderQuestions(String(active.id), String(over.id));
    }
  };

  const hasQuestions = form.questions.length > 0;

  return (
    <div
      className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-5xl flex-col px-4 py-8 md:px-8 md:py-10"
      onClick={() => selectQuestion(null)}
    >
      {!hasQuestions ? (
        <div className="flex flex-1 flex-col justify-between gap-8">
          <BuilderEmptyState />
          <div className="flex justify-center">
            <AddQuestionButton />
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={form.questions.map((question) => question.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-1 flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {form.questions.map((question) => (
                  <QuestionBlock key={question.id} question={question} />
                ))}
              </AnimatePresence>

              <div className="flex justify-center pt-4">
                <AddQuestionButton />
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
