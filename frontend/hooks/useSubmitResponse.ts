"use client";

import { useMutation } from "@tanstack/react-query";
import { submitResponse } from "@/lib/api/responses";

export function useSubmitResponse() {
  return useMutation({
    mutationFn: submitResponse,
  });
}