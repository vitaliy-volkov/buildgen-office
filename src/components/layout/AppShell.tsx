import type { ReactNode } from "react";
import { ActionBar } from "./ActionBar";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50 text-gray-900">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1 overflow-hidden">
          {children}
          <ActionBar />
        </main>
        <Sidebar />
      </div>
    </div>
  );
}
