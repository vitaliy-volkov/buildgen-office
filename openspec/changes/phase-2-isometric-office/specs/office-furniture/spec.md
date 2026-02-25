## ADDED Requirements

### Requirement: 桌椅模型

系统 SHALL 使用 BoxGeometry 渲染桌子和椅子模型，按四区域排列。

#### Scenario: 桌子模型

- **WHEN** 3D 场景渲染工位区域
- **THEN** 每个工位位置 SHALL 渲染一个桌子模型：`BoxGeometry(1.2, 0.06, 0.6)` 灰白色 `#94a3b8` 材质，position.y=0.4（桌面高度）

#### Scenario: 椅子模型

- **WHEN** 3D 场景渲染工位区域
- **THEN** 每个桌子前方 SHALL 渲染一个椅子模型：`BoxGeometry(0.3, 0.35, 0.3)` 深灰色 `#475569` 材质

#### Scenario: 区域排列

- **WHEN** 3D 场景渲染
- **THEN** 桌椅 SHALL 按 Desk Zone（左上 4×3 网格）、Hot Desk Zone（左下 4×3 网格）排列，与 position-allocator 的 2D 网格位置一一对应

### Requirement: 区域地面标记

系统 SHALL 在 3D 地板上显示区域划分标记。

#### Scenario: 区域彩色半透明平面

- **WHEN** 3D 场景渲染
- **THEN** 四个区域 SHALL 各有一个半透明彩色 PlaneGeometry 覆盖在地板上方 0.01 单位处，颜色与 2D 模式的 ZONE_COLORS 对应，opacity=0.15

#### Scenario: 区域文字标签

- **WHEN** 3D 场景渲染
- **THEN** 每个区域 SHALL 在角落显示 drei `<Html>` 组件渲染的区域名称标签（"固定工位区" / "会议区" / "热工位区" / "休息区"），字号小、半透明，不遮挡 Agent
