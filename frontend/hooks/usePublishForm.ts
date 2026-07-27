"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishForm } from "@/lib/api/forms";

export function usePublishForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
  });
}