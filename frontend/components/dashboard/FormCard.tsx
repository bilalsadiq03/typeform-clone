"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Copy,
  ExternalLink,
  Eye,
  FilePenLine,
  MoreHorizontal,
  Rocket,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBuilderStore } from "@/store/builder.store";
import { Form } from "@/types/form";
import { cn } from "@/lib/utils";

interface FormCardProps {
  form: Form;
  index: number;
}

function formatUpdatedTime(updatedAt: string): string {
  const updatedDate = new Date(updatedAt);
  const diff = Date.now() - updatedDate.getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return updatedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMockResponseCount(form: Form): number {
  return form.id.split("").reduce((total, character) => total + character.charCodeAt(0), 0) % 148;
}

export default function FormCard({ form, index }: FormCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const setCurrentForm = useBuilderStore((state) => state.setCurrentForm);
  const duplicateForm = useBuilderStore((state) => state.duplicateForm);
  const deleteForm = useBuilderStore((state) => state.deleteForm);
  const publishForm = useBuilderStore((state) => state.publishForm);
  const responseCount = useMemo(() => getMockResponseCount(form), [form]);

  const handleEdit = () => {
    setCurrentForm(form.id);
    router.push("/forms/new");
  };

  const handlePreview = () => {
    setCurrentForm(form.id);
    router.push(`/f/${form.id}`);
  };

  const handleDuplicate = () => {
    duplicateForm(form.id);
    setOpen(false);
  };

  const handleDelete = () => {
    deleteForm(form.id);
    setOpen(false);
  };

  const handlePublish = () => {
    publishForm(form.id);
    setOpen(false);
  };

  const statusClasses =
    form.status === "published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card className="rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
        <CardHeader className="pb-2">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-xs font-medium", statusClasses)}>
                  {form.status === "published" ? "Published" : "Draft"}
                </Badge>
                <CardTitle className="text-xl font-semibold text-slate-950">
                  {form.title}
                </CardTitle>
              </div>

              <CardAction>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    render={
                      <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-slate-950">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <PopoverContent align="end" className="w-52 rounded-2xl p-2">
                    <div className="space-y-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full justify-start rounded-xl px-3"
                        onClick={handleEdit}
                      >
                        <ExternalLink className="size-4" />
                        Open
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full justify-start rounded-xl px-3"
                        onClick={handleEdit}
                      >
                        <FilePenLine className="size-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full justify-start rounded-xl px-3"
                        onClick={handlePreview}
                      >
                        <Eye className="size-4" />
                        Preview
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full justify-start rounded-xl px-3"
                        onClick={handleDuplicate}
                      >
                        <Copy className="size-4" />
                        Duplicate
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full justify-start rounded-xl px-3"
                        onClick={handlePublish}
                        disabled={form.status === "published"}
                      >
                        <Rocket className="size-4" />
                        Publish
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full justify-start rounded-xl px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={handleDelete}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardAction>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Questions
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {form.questions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Responses
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {responseCount}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Updated</span>
            <span className="font-medium text-slate-700">
              {formatUpdatedTime(form.updatedAt)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="justify-between rounded-b-[1.75rem] border-slate-100 bg-slate-50/80">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-200 bg-white px-4"
            onClick={handlePreview}
          >
            <Eye className="size-4" />
            Preview
          </Button>

          <Button
            type="button"
            className="rounded-full px-4"
            onClick={handleEdit}
          >
            <FilePenLine className="size-4" />
            Edit
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
