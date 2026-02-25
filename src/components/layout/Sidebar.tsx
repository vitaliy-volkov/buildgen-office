import { useState, useMemo } from "react";
import { AgentDetailPanel } from "@/components/panels/AgentDetailPanel";
import { EventTimeline } from "@/components/panels/EventTimeline";
import { MetricsPanel } from "@/components/panels/MetricsPanel";
import { SubAgentPanel } from "@/components/panels/SubAgentPanel";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { SvgAvatar } from "@/components/shared/SvgAvatar";
import type { AgentVisualStatus } from "@/gateway/types";
import { useSidebarLayout } from "@/hooks/useSidebarLayout";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { useOfficeStore } from "@/store/office-store";

type FilterTag = "all" | "active" | "idle" | "error";

const FILTER_TAGS: { key: FilterTag; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "active", label: "活跃" },
  { key: "idle", label: "空闲" },
  { key: "error", label: "错误" },
];

export function Sidebar() {
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const collapsed = useOfficeStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useOfficeStore((s) => s.setSidebarCollapsed);

  const { getSection, toggleSection, setSectionHeight } = useSidebarLayout();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTag>("all");

  const agentList = useMemo(() => {
    let list = Array.from(agents.values());

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }

    if (filter === "active") {
      list = list.filter((a) => a.status !== "idle" && a.status !== "offline");
    } else if (filter === "idle") {
      list = list.filter((a) => a.status === "idle");
    } else if (filter === "error") {
      list = list.filter((a) => a.status === "error");
    }

    return list;
  }, [agents, search, filter]);

  const subAgents = useMemo(
    () => Array.from(agents.values()).filter((a) => a.isSubAgent),
    [agents],
  );

  if (collapsed) {
    return (
      <aside className="flex w-12 flex-col items-center border-l border-gray-200 bg-white py-3 dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          title="展开侧栏"
        >
          ◀
        </button>
      </aside>
    );
  }

  const metricsSection = getSection("metrics");
  const agentsSection = getSection("agents");
  const subAgentsSection = getSection("subAgents");
  const detailSection = getSection("detail");
  const timelineSection = getSection("timeline");

  return (
    <aside className="flex w-80 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Sidebar header */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-gray-200 px-3 dark:border-gray-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Agents</span>
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          title="折叠侧栏"
        >
          ▶
        </button>
      </div>

      {/* Metrics section — collapsed by default */}
      <CollapsibleSection
        id="metrics"
        title="概览 / 趋势"
        collapsed={metricsSection.collapsed}
        onToggle={() => toggleSection("metrics")}
        height={metricsSection.height}
        onHeightChange={(h) => setSectionHeight("metrics", h)}
        minHeight={120}
        maxHeight={400}
      >
        <MetricsPanel />
      </CollapsibleSection>

      {/* Agent list — primary section, takes remaining space */}
      <CollapsibleSection
        id="agents"
        title="Agent 列表"
        collapsed={agentsSection.collapsed}
        onToggle={() => toggleSection("agents")}
        height={agentsSection.height}
        onHeightChange={(h) => setSectionHeight("agents", h)}
        minHeight={100}
        maxHeight={600}
        flex
        badge={agentList.length}
        headerExtra={<AgentSearchBadge filter={filter} />}
      >
        <div className="border-b border-gray-100 px-3 py-1.5 dark:border-gray-800">
          <input
            type="text"
            placeholder="搜索 Agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
          <div className="mt-1.5 flex gap-1">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag.key}
                onClick={() => setFilter(tag.key)}
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  filter === tag.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          {agentList.map((agent) => (
            <button
              key={agent.id}
              onClick={() => selectAgent(agent.id)}
              className={`flex w-full items-center gap-3 border-b border-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                selectedAgentId === agent.id ? "bg-blue-50 dark:bg-blue-950" : ""
              }`}
            >
              <SvgAvatar agentId={agent.id} size={24} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">{agent.name}</div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[agent.status as AgentVisualStatus],
                    }}
                  />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {STATUS_LABELS[agent.status as AgentVisualStatus]}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">· {timeAgo(agent.lastActiveAt)}</span>
                </div>
              </div>
            </button>
          ))}
          {agentList.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-gray-400 dark:text-gray-500">无匹配 Agent</div>
          )}
        </div>
      </CollapsibleSection>

      {/* Sub-agents — only visible when there are sub-agents */}
      {subAgents.length > 0 && (
        <CollapsibleSection
          id="subAgents"
          title="Sub-Agents"
          collapsed={subAgentsSection.collapsed}
          onToggle={() => toggleSection("subAgents")}
          height={subAgentsSection.height}
          onHeightChange={(h) => setSectionHeight("subAgents", h)}
          minHeight={60}
          maxHeight={300}
          badge={subAgents.length}
        >
          <SubAgentPanel />
        </CollapsibleSection>
      )}

      {/* Agent detail — only visible when an agent is selected */}
      {selectedAgentId && (
        <CollapsibleSection
          id="detail"
          title="Agent 详情"
          collapsed={detailSection.collapsed}
          onToggle={() => toggleSection("detail")}
          height={detailSection.height}
          onHeightChange={(h) => setSectionHeight("detail", h)}
          minHeight={80}
          maxHeight={400}
        >
          <AgentDetailPanel />
        </CollapsibleSection>
      )}

      {/* Event timeline */}
      <CollapsibleSection
        id="timeline"
        title="事件时间轴"
        collapsed={timelineSection.collapsed}
        onToggle={() => toggleSection("timeline")}
        height={timelineSection.height}
        onHeightChange={(h) => setSectionHeight("timeline", h)}
        minHeight={60}
        maxHeight={400}
      >
        <EventTimeline />
      </CollapsibleSection>
    </aside>
  );
}

function AgentSearchBadge({ filter }: { filter: FilterTag }) {
  if (filter === "all") return null;
  const label = FILTER_TAGS.find((t) => t.key === filter)?.label ?? filter;
  return (
    <span className="rounded bg-blue-100 px-1 text-[9px] text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
      {label}
    </span>
  );
}

function timeAgo(ts: number): string {
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diff < 5) {
    return "刚刚";
  }
  if (diff < 60) {
    return `${diff}秒前`;
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)}分前`;
  }
  return `${Math.floor(diff / 3600)}时前`;
}
