## ADDED Requirements

### Requirement: 2D→3D 坐标映射

系统 SHALL 提供将 2D SVG 坐标映射到 3D 世界坐标的工具函数。

#### Scenario: position2dTo3d 映射

- **WHEN** 需要将 2D position `{ x, y }` 转换为 3D 坐标
- **THEN** 系统 SHALL 提供 `position2dTo3d(pos): [number, number, number]` 函数，返回 `[pos.x * 0.01, 0, pos.y * 0.01]`

#### Scenario: 映射一致性

- **WHEN** 2D 和 3D 视图同时显示同一组 Agent
- **THEN** Agent 的相对空间关系（哪个在左/右/上/下）SHALL 在两种视图中保持一致

### Requirement: 会议区位置分配

系统 SHALL 支持将 Agent 分配到 Meeting Zone 的圆桌座位。

#### Scenario: 会议座位计算

- **WHEN** 需要为 N 个 Agent 分配会议桌座位
- **THEN** 系统 SHALL 提供 `allocateMeetingPositions(agentIds, tableCenter): Array<{ x, y }>` 函数，按等角分布计算 N 个座位位置（`angle = 2π * i / N`，半径 = Meeting Zone 中心的固定偏移量）
