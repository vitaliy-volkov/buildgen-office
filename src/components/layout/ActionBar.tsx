import { useState } from "react";
import { useOfficeStore } from "@/store/office-store";

interface ActionButtonProps {
  icon: string;
  label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip((v) => !v)}
        onBlur={() => setShowTooltip(false)}
        className="flex items-center gap-1.5 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-gray-900"
      >
        <span>{icon}</span>
        <span>{label}</span>
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg">
          此功能将在后续版本中启用
        </div>
      )}
    </div>
  );
}

export function ActionBar() {
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const agents = useOfficeStore((s) => s.agents);

  const hasMeetingAgents = Array.from(agents.values()).some((a) => a.zone === "meeting");
  const visible = selectedAgentId !== null || hasMeetingAgents;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4 transition-all duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gray-200/50 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-sm">
        <ActionButton icon="⏸" label="暂停" />
        <ActionButton icon="🔀" label="派生子Agent" />
        <ActionButton icon="💬" label="对话" />
      </div>
    </div>
  );
}
