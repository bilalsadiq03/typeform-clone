"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilderStore } from "@/store/builder.store";
import { Eye, Send } from "lucide-react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useUpdateForm } from "@/hooks/useUpdateForm";

export default function BuilderToolbar() {
  const router = useRouter();
  const { form, setTitle, publishForm } = useBuilderStore();
  const isPublished = form.status === "published";
  const updateMutation = useUpdateForm();

  const handleSave = async () => {
    try {
      if (!form.id) {
        toast.error("Form not found");
        return;
      }

      await updateMutation.mutateAsync({
        id: form.id,
        payload: {
          title: form.title,
          description: form.description,
          status: form.status,
          questions: form.questions,
        },
      });

      toast.success("Draft saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save form");
    }
  };

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
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            <Save className="size-4" />
            {updateMutation.isPending ? "Saving..." : "Save Draft"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push(`/f/${form.id}`)}
          >
            <Eye className="size-4" />
            Preview
          </Button>

          <Button type="button" size="lg" onClick={async () => {
            if (!form.id) return;

            try {
              await updateMutation.mutateAsync({
                id: form.id,
                payload: {
                  title: form.title,
                  description: form.description,
                  status: "published",
                  questions: form.questions,
                },
              });

              publishForm();
              toast.success("Form published");
            } catch {
              toast.error("Publish failed");
            }
          }
          }>
            <Send className="size-4" />
            {isPublished ? "Published" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
