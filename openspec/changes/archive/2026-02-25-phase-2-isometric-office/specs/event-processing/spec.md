## MODIFIED Requirements

### Requirement: Agent 事件解析

系统 SHALL 将 Gateway 广播的 Agent 事件帧解析为结构化的 AgentEventPayload，并推断对应的可视化状态。

#### Scenario: 解析 lifecycle start 事件

- **WHEN** 收到 `{ stream: "lifecycle", data: { phase: "start" } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"thinking"`

#### Scenario: 解析 lifecycle thinking 事件

- **WHEN** 收到 `{ stream: "lifecycle", data: { phase: "thinking" } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"thinking"`

#### Scenario: 解析 lifecycle end 事件

- **WHEN** 收到 `{ stream: "lifecycle", data: { phase: "end" } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"idle"`，清除 `currentTool` 和 `speechBubble`

#### Scenario: 解析 lifecycle fallback 事件

- **WHEN** 收到 `{ stream: "lifecycle", data: { phase: "fallback" } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"error"`

#### Scenario: 解析 tool start 事件

- **WHEN** 收到 `{ stream: "tool", data: { phase: "start", name: "browser_search", args: {...} } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"tool_calling"`，设置 `currentTool = { name: "browser_search", args }`，`toolCallCount` 递增

#### Scenario: 解析 tool end 事件

- **WHEN** 收到 `{ stream: "tool", data: { phase: "end", name: "browser_search" } }`
- **THEN** 系统 SHALL 清除 `currentTool`，将 Agent 状态映射回 `"thinking"`

#### Scenario: 解析 assistant 事件

- **WHEN** 收到 `{ stream: "assistant", data: { text: "根据搜索结果..." } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"speaking"`，设置 `speechBubble = { text, timestamp: ts }`

#### Scenario: 解析 error 事件

- **WHEN** 收到 `{ stream: "error", data: { message: "Rate limit exceeded" } }`
- **THEN** 系统 SHALL 将 Agent 状态映射为 `"error"`

#### Scenario: 收到未知 Agent 的事件

- **WHEN** 收到 runId 对应的 Agent 不在 store 中
- **THEN** 系统 SHALL 为该 runId 创建一个新的 VisualAgent（使用 runId 作为临时 id，`isSubAgent=true`，`parentAgentId` 尝试从 sessionKey 推断），并正常处理事件

## ADDED Requirements

### Requirement: VisualAgent 类型扩展

系统 SHALL 扩展 VisualAgent 类型以支持 Sub-Agent 和会议区功能。

#### Scenario: 新增 Sub-Agent 关系字段

- **WHEN** VisualAgent 类型定义
- **THEN** SHALL 包含 `parentAgentId: string | null`（父 Agent ID）和 `childAgentIds: string[]`（子 Agent ID 列表）

#### Scenario: 新增会议区字段

- **WHEN** VisualAgent 类型定义
- **THEN** SHALL 包含 `zone: "desk" | "meeting" | "hotDesk" | "lounge"`（当前所在区域）和 `originalPosition: { x: number; y: number } | null`（会议区移动前的原始位置）
