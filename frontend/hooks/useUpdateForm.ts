"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateForm, UpdateFormPayload } from "@/lib/api/forms";

export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFormPayload;
    }) => updateForm(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["form", data.id],
      });
    },
  });
}