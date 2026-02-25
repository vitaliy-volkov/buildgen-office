import { useOfficeStore } from "@/store/office-store";
import { Avatar } from "@/components/shared/Avatar";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import Markdown from "react-markdown";

export function AgentDetailPanel() {
  const selectedId = useOfficeStore((s) => s.selectedAgentId);
  const agents = useOfficeStore((s) => s.agents);
  const selectAgent = useOfficeStore((s) => s.selectAgent);

  if (!selectedId) return null;
  const agent = agents.get(selectedId);
  if (!agent) return null;

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <span className="text-xs font-medium text-gray-500">Agent 详情</span>
        <button
          onClick={() => selectAgent(null)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto px-3 py-2">
        <div className="mb-3 flex items-center gap-2">
          <Avatar agentId={agent.id} agentName={agent.name} size={36} />
          <div>
            <div className="text-sm font-medium text-gray-800">
              {agent.name}
            </div>
            <div className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[agent.status] }}
              />
              <span className="text-xs text-gray-500">
                {STATUS_LABELS[agent.status]}
              </span>
            </div>
          </div>
        </div>

        {agent.currentTool && (
          <div className="mb-2 rounded bg-orange-50 px-2 py-1.5 text-xs">
            <div className="text-orange-600">
              🔧 {agent.currentTool.name}
            </div>
          </div>
        )}

        {agent.speechBubble && (
          <div className="mb-2 rounded bg-white px-2 py-1.5 text-xs leading-relaxed text-gray-700 shadow-sm">
            <Markdown>{agent.speechBubble.text}</Markdown>
          </div>
        )}

        {agent.toolCallHistory.length > 0 && (
          <div className="mt-2">
            <div className="mb-1 text-xs font-medium text-gray-400">
              工具调用历史
            </div>
            {agent.toolCallHistory.map((t, i) => (
              <div
                key={`${t.name}-${t.timestamp}-${i}`}
                className="flex items-center justify-between border-b border-gray-100 py-1 text-xs text-gray-500"
              >
                <span>{t.name}</span>
                <span className="text-gray-400">
                  {new Date(t.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
