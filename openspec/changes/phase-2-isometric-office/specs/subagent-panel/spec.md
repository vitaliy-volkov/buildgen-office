## ADDED Requirements

### Requirement: Sub-Agent 列表面板

系统 SHALL 在侧栏提供 Sub-Agent 列表面板。

#### Scenario: 面板入口

- **WHEN** 侧栏渲染且有活跃 Sub-Agent
- **THEN** Sidebar SHALL 在 Agent 列表下方显示"Sub-Agents"分区标题 + Sub-Agent 数量徽标

#### Scenario: Sub-Agent 卡片内容

- **WHEN** Sub-Agent 面板展开
- **THEN** 每个活跃 Sub-Agent SHALL 显示卡片：名称（或 runId 前 6 位）、父 Agent 名称（链接可点击）、任务描述（来自 session 的 task 字段，截断 80 字符）、当前状态标签（色彩编码）、运行时长（从 createdAt 到当前的相对时间，如 "运行 2m 34s"）

#### Scenario: 点击定位

- **WHEN** 用户点击 Sub-Agent 卡片
- **THEN** 系统 SHALL 选中该 Sub-Agent（`selectAgent`），且如果 viewMode 为 3D，相机 SHALL 平移到该 Sub-Agent 附近

#### Scenario: 点击父 Agent 链接

- **WHEN** 用户点击 Sub-Agent 卡片中的父 Agent 名称
- **THEN** 系统 SHALL 选中父 Agent

#### Scenario: 空状态

- **WHEN** 无活跃 Sub-Agent
- **THEN** Sub-Agent 分区 SHALL 隐藏（不显示空列表）
