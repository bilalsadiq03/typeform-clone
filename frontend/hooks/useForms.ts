"use client";

import { useQuery } from "@tanstack/react-query";
import { getForms } from "@/lib/api/forms";

export function useForms() {
  return useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
  });
}