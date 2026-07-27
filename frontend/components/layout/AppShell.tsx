import { ReactNode, Suspense } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_55%,#eef2f7_100%)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={null}>
          <Topbar />
        </Suspense>
        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
