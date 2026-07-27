"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateForm } from "@/lib/api/forms";

export function useDuplicateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
  });
}