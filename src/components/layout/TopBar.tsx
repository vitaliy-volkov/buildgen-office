import { useMemo } from "react";
import { useOfficeStore } from "@/store/office-store";
import { isWebGLAvailable } from "@/lib/webgl-detect";
import type { ConnectionStatus, ViewMode } from "@/gateway/types";

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { color: string; pulse: boolean; label: string }
> = {
  connecting: { color: "#eab308", pulse: true, label: "连接中..." },
  connected: { color: "#22c55e", pulse: false, label: "已连接" },
  reconnecting: { color: "#f97316", pulse: true, label: "重连中" },
  disconnected: { color: "#6b7280", pulse: false, label: "未连接" },
  error: { color: "#ef4444", pulse: false, label: "连接错误" },
};

export function TopBar() {
  const connectionStatus = useOfficeStore((s) => s.connectionStatus);
  const connectionError = useOfficeStore((s) => s.connectionError);
  const metrics = useOfficeStore((s) => s.globalMetrics);
  const viewMode = useOfficeStore((s) => s.viewMode);
  const setViewMode = useOfficeStore((s) => s.setViewMode);

  const webglAvailable = useMemo(() => isWebGLAvailable(), []);
  const statusCfg = STATUS_CONFIG[connectionStatus];

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-gray-800">
          OpenClaw Office
        </h1>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          v0.1.0
        </span>
      </div>

      <ViewModeSwitch
        viewMode={viewMode}
        setViewMode={setViewMode}
        webglAvailable={webglAvailable}
      />

      <div className="mx-8 flex items-center gap-6 text-sm text-gray-500">
        <span>
          活跃{" "}
          <strong className="text-gray-800">
            {metrics.activeAgents}/{metrics.totalAgents}
          </strong>
        </span>
        <span>
          Tokens{" "}
          <strong className="text-gray-800">
            {formatTokens(metrics.totalTokens)}
          </strong>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: statusCfg.color,
            animation: statusCfg.pulse
              ? "pulse 1.5s ease-in-out infinite"
              : "none",
          }}
        />
        <span className="text-sm text-gray-500">
          {connectionError && connectionStatus === "error"
            ? connectionError
            : statusCfg.label}
        </span>
      </div>
    </header>
  );
}

function ViewModeSwitch({
  viewMode,
  setViewMode,
  webglAvailable,
}: {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  webglAvailable: boolean;
}) {
  const modes: { key: ViewMode; label: string }[] = [
    { key: "2d", label: "2D" },
    { key: "3d", label: "3D" },
  ];

  return (
    <div className="ml-6 flex items-center rounded-md bg-gray-100 p-0.5">
      {modes.map(({ key, label }) => {
        const isActive = viewMode === key;
        const disabled = key === "3d" && !webglAvailable;
        return (
          <button
            key={key}
            onClick={() => !disabled && setViewMode(key)}
            disabled={disabled}
            title={disabled ? "当前浏览器不支持 3D 渲染" : `切换到 ${label} 视图`}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : disabled
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
