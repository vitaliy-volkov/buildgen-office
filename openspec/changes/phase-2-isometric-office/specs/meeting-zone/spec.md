## ADDED Requirements

### Requirement: 会议桌模型

系统 SHALL 在 Meeting Zone 渲染会议桌模型。

#### Scenario: 圆桌渲染

- **WHEN** 3D 场景渲染 Meeting Zone
- **THEN** SHALL 在 Meeting Zone 中心渲染一个圆桌：`CylinderGeometry(1.0, 1.0, 0.06, 32)` 深灰色材质，y=0.4（桌面高度）

#### Scenario: 多组会议支持

- **WHEN** 同时存在多组协作（不同 sessionKey）
- **THEN** Meeting Zone SHALL 支持最多 3 张会议桌，水平排列，按协作组分配

### Requirement: 协作聚集

系统 SHALL 在检测到 Agent 间协作时自动将角色移动到会议区。

#### Scenario: 触发聚集

- **WHEN** store 中 CollaborationLink 显示 2+ Agent 有活跃协作（同一 sessionKey，strength > 0.3）
- **THEN** 参与协作的 Agent 角色 SHALL 平滑移动到会议桌周围的座位位置（transition duration 800ms）

#### Scenario: 环坐排列

- **WHEN** Agent 移入会议区
- **THEN** Agent SHALL 按数量等角分布在圆桌周围（`angle = 2π * i / n, radius = 1.5`），面向桌子中心

#### Scenario: 保存原位

- **WHEN** Agent 因协作移入会议区
- **THEN** 系统 SHALL 保存该 Agent 的 `originalPosition`，用于协作结束后恢复

#### Scenario: 返回原位

- **WHEN** 协作结束（所有相关 CollaborationLink 被移除或 strength 衰减到 0）
- **THEN** Agent SHALL 以平滑过渡（duration 800ms）返回 `originalPosition`，`originalPosition` 清空

### Requirement: 会议任务标签

系统 SHALL 在会议桌上方显示当前协作任务信息。

#### Scenario: 任务标签渲染

- **WHEN** 有 Agent 围坐在会议桌旁
- **THEN** 桌面上方 SHALL 通过 drei `<Html>` 渲染一个浮动标签，显示协作的 sessionKey 摘要或参与 Agent 名称列表

#### Scenario: 标签自动更新

- **WHEN** 参与协作的 Agent 数量变化
- **THEN** 标签内容 SHALL 实时更新
