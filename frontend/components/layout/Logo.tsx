import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg font-bold text-white">
        F
      </div>

      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          FormFlow
        </h1>

        <p className="text-xs text-muted-foreground">
          Conversational Forms
        </p>
      </div>
    </Link>
  );
}