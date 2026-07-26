import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <Input
        placeholder="Search forms..."
        className="max-w-sm"
      />

      <Button>Create Form</Button>
    </header>
  );
}