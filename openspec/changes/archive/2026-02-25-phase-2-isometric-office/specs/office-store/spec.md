## ADDED Requirements

### Requirement: Sub-Agent 关系管理

系统 SHALL 在 VisualAgent 中维护父子关系字段，并提供 Sub-Agent 的增删操作。

#### Scenario: Sub-Agent 创建

- **WHEN** sessions.list 轮询检测到新的 Sub-Agent
- **THEN** 系统 SHALL 创建 VisualAgent（`isSubAgent=true`），设置 `parentAgentId` 为父 Agent 的 id，并在父 Agent 的 `childAgentIds` 数组中追加该 Sub-Agent id

#### Scenario: Sub-Agent 移除

- **WHEN** Sub-Agent 消亡动画完成
- **THEN** 系统 SHALL 从 agents Map 中移除该 Sub-Agent，同时从父 Agent 的 `childAgentIds` 中移除对应 id

#### Scenario: Sub-Agent 计数

- **WHEN** 查询活跃 Sub-Agent 列表
- **THEN** 系统 SHALL 提供 selector 返回所有 `isSubAgent=true` 的 VisualAgent 数组

### Requirement: 会议区位置管理

系统 SHALL 支持 Agent 在原工位和会议区之间移动，保存和恢复原位。

#### Scenario: 保存原位

- **WHEN** Agent 因协作被移入会议区
- **THEN** 系统 SHALL 将 Agent 当前 `position` 保存到 `originalPosition` 字段，`zone` 更新为 `"meeting"`

#### Scenario: 恢复原位

- **WHEN** 协作结束，Agent 从会议区返回
- **THEN** 系统 SHALL 将 Agent `position` 恢复为 `originalPosition`，`zone` 恢复为原值，`originalPosition` 清空为 null

### Requirement: Sessions 轮询状态

系统 SHALL 管理 sessions.list 轮询的状态。

#### Scenario: 轮询数据存储

- **WHEN** sessions.list 返回数据
- **THEN** 系统 SHALL 在 store 中维护 `lastSessionsSnapshot`，用于下次轮询时做 diff 比较

## MODIFIED Requirements

### Requirement: Agent 状态管理

系统 SHALL 使用 Zustand + Immer 管理所有 VisualAgent 的状态，支持高频增量更新。

#### Scenario: 初始化 Agent 列表

- **WHEN** 从 RPC `agents.list` 获取到 Agent 配置列表
- **THEN** 系统 SHALL 为每个 Agent 创建 VisualAgent 对象，初始状态为 `"idle"`，使用 `agent.identity.name` 或 `agent.name` 或 `agent.id` 作为显示名称，使用 agentId 生成确定性 avatar 颜色，`parentAgentId` 设为 null，`childAgentIds` 设为空数组，`zone` 设为 `"desk"`，`originalPosition` 设为 null

#### Scenario: 处理 Agent 状态变更事件

- **WHEN** 事件处理模块推送状态变更
- **THEN** store SHALL 更新对应 VisualAgent 的 `status`、`currentTool`、`speechBubble`、`lastActiveAt` 等字段，且 MUST 使用 immer 确保不可变更新

#### Scenario: Agent 选中/取消选中

- **WHEN** 用户点击 Agent 圆点、3D 角色或列表项
- **THEN** `selectedAgentId` SHALL 更新为对应 id（再次点击同一 Agent 取消选中设为 null）
