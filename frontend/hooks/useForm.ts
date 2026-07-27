"use client";

import { useQuery } from "@tanstack/react-query";
import { getForm } from "@/lib/api/forms";

export function useForm(id: string) {
  return useQuery({
    queryKey: ["form", id],
    queryFn: () => getForm(id),
    enabled: !!id,
  });
}
