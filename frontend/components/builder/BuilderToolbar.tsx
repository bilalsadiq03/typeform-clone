"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilderStore } from "@/store/builder.store";
import { Eye, Send } from "lucide-react";

export default function BuilderToolbar() {
  const { form, setTitle, publishForm } = useBuilderStore();
  const isPublished = form.status === "published";

  return (
    <div className="sticky top-0 z-20 border-b border-border/80 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Input
            value={form.title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-auto min-w-0 border-none px-0 text-xl font-semibold shadow-none focus-visible:ring-0 md:text-2xl"
            placeholder="Untitled Form"
          />

          <Badge
            variant={isPublished ? "secondary" : "outline"}
            className={
              isPublished
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button type="button" variant="outline" size="lg">
            <Eye className="size-4" />
            Preview
          </Button>

          <Button type="button" size="lg" onClick={publishForm}>
            <Send className="size-4" />
            {isPublished ? "Published" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
