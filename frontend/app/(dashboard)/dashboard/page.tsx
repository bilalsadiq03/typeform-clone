
export default function DashboardPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back
          </h1>

          <p className="text-muted-foreground">
            Build beautiful conversational forms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            Form Card Placeholder
          </div>

          <div className="rounded-2xl border bg-white p-6">
            Form Card Placeholder
          </div>

          <div className="rounded-2xl border bg-white p-6">
            Form Card Placeholder
          </div>
        </div>
      </div>
  );
}