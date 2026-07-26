"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Sparkles, Star } from "lucide-react";

export default function BuilderEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[56vh] flex-col items-center justify-center px-8 text-center"
    >
      <div className="relative mb-8 flex h-52 w-full max-w-xl items-center justify-center">
        <div className="absolute inset-x-10 bottom-6 h-28 rounded-[2rem] border border-blue-100 bg-white/90 shadow-[0_28px_80px_rgba(37,99,235,0.12)]" />
        <div className="absolute left-1/2 top-4 h-44 w-72 -translate-x-1/2 rounded-[2rem] border border-blue-100 bg-linear-to-b from-blue-50 via-white to-white p-5 shadow-[0_24px_64px_rgba(15,23,42,0.14)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-3 w-20 rounded-full bg-blue-100" />
            <Sparkles className="size-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="h-10 rounded-2xl bg-white shadow-sm ring-1 ring-blue-100" />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex h-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <MessageSquareText className="size-5" />
              </div>
              <div className="flex h-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
                <Star className="size-5" />
              </div>
            </div>
            <div className="h-3 w-2/3 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      <h3 className="text-3xl font-semibold tracking-tight text-foreground">
        Start building your form
      </h3>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
        Add your first question below.
      </p>
    </motion.div>
  );
}
