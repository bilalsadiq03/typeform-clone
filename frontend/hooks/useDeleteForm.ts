"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteForm } from "@/lib/api/forms";

export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
  });
}