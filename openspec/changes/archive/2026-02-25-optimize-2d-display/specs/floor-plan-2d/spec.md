## MODIFIED Requirements

### Requirement: SVG 办公室平面图

系统 SHALL 渲染一个 SVG 办公室平面图，使用 `viewBox="0 0 1200 700"` 固定坐标系，包含四个可辨识的功能区域，并增加阴影、圆角和渐变等视觉细节。

#### Scenario: 四区域布局渲染

- **WHEN** FloorPlan 组件加载
- **THEN** 系统 SHALL 渲染四个区域：Desk Zone（固定工位区，左上）、Meeting Zone（会议区，右上）、Hot Desk Zone（热工位区，左下）、Lounge Zone（休息区，右下），每个区域 SHALL 有不同的渐变底色、圆角（rx=16）和轻微的阴影效果（feDropShadow）。

#### Scenario: 区域标签可读

- **WHEN** 平面图渲染完成
- **THEN** 每个区域 SHALL 显示中文区域名称（固定工位区 / 会议区 / 热工位区 / 休息区），标签使用半透明毛玻璃背景（或对应的 SVG 滤镜）确保在不同底色上可读，并增加视觉层次感。

### Requirement: Agent 圆点渲染

系统 SHALL 在平面图上为每个 VisualAgent 渲染一个状态色彩编码的拟人化图标组合（取代简单的圆点）。

#### Scenario: 圆点位置由工位分配算法决定

- **WHEN** Agent 在 store 中被创建或更新
- **THEN** 圆点 SHALL 出现在 position-allocator 分配的坐标位置

#### Scenario: 圆点颜色反映 Agent 状态

- **WHEN** Agent 状态变更
- **THEN** 圆点（或图标背景/边框）颜色 SHALL 按以下映射变化：`idle=#22c55e`（绿）、`thinking=#3b82f6`（蓝）、`tool_calling=#f97316`（橙）、`speaking=#a855f7`（紫）、`error=#ef4444`（红）、`offline=#6b7280`（灰），颜色变化 SHALL 使用 CSS transition（duration 400ms）平滑过渡，并带有对应颜色的发光效果（box-shadow 或 SVG drop-shadow）。

#### Scenario: 圆点大小

- **WHEN** Agent 圆点渲染
- **THEN** 基础图标组合直径 SHALL 为 32px（SVG 坐标系单位），选中的 Agent 图标组合直径 SHALL 放大到 40px 并显示高亮环和更强的发光效果。

#### Scenario: 悬停显示 Agent 名称

- **WHEN** 鼠标悬停在 Agent 圆点上
- **THEN** 系统 SHALL 显示 tooltip 包含 Agent 名称和当前状态，且 tooltip 具有毛玻璃效果和柔和阴影。

#### Scenario: 点击选中 Agent

- **WHEN** 用户点击 Agent 圆点
- **THEN** 系统 SHALL 调用 `selectAgent(agentId)`，选中的 Agent 圆点显示高亮边框和发光效果，右侧面板展开 AgentDetailPanel

### Requirement: Agent 间协作连线

系统 SHALL 在有协作关系的 Agent 之间渲染可视连线，并带有更具科技感的流动动画。

#### Scenario: 连线样式

- **WHEN** store 中存在 CollaborationLink
- **THEN** 系统 SHALL 在两个 Agent 圆点之间渲染 SVG 虚线（`stroke-dasharray: "6,4"`）或渐变曲线，线条颜色透明度与 `strength` 成正比（strength=1 时完全不透明，strength=0.1 时 10% 透明度），并带有轻微的发光滤镜。

#### Scenario: 连线动画

- **WHEN** 连线渲染
- **THEN** 虚线 SHALL 有 dash-offset 循环动画，模拟数据流动方向，动画速度和流畅度需优化以体现科技感。
