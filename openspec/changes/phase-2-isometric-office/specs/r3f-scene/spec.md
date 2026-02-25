## ADDED Requirements

### Requirement: R3F Canvas 容器

系统 SHALL 提供一个 R3F Canvas 组件作为 3D 场景的渲染容器。

#### Scenario: Canvas 正常渲染

- **WHEN** viewMode 为 "3d" 且 3D 场景组件加载完成
- **THEN** R3F Canvas SHALL 以全宽全高填充主渲染区，开启抗锯齿（`antialias: true`），背景色为 `#0f172a`（深蓝黑）

#### Scenario: WebGL 不可用降级

- **WHEN** 用户浏览器不支持 WebGL
- **THEN** 系统 SHALL 自动锁定 viewMode 为 "2d"，TopBar 切换按钮 SHALL 禁用并显示 tooltip "当前浏览器不支持 3D 渲染"

### Requirement: Isometric 相机

系统 SHALL 使用 OrthographicCamera 实现 isometric 等距投影视角。

#### Scenario: 相机初始位置

- **WHEN** 3D 场景首次渲染
- **THEN** 相机 SHALL 位于 `[10, 10, 10]`，zoom=50，lookAt `[6, 0, 3.5]`（场景中心）

#### Scenario: 交互控制

- **WHEN** 用户在 3D 场景中操作
- **THEN** SHALL 允许平移（拖拽/触屏双指滑动）和缩放（滚轮/触屏捏合），SHALL 禁止旋转（保持 isometric 角度不变）

### Requirement: 场景环境

系统 SHALL 渲染灯光、地板和网格辅助线。

#### Scenario: 灯光配置

- **WHEN** 3D 场景渲染
- **THEN** 场景 SHALL 包含一个方向光（`DirectionalLight`，位于 `[5, 10, 5]`，intensity=0.8，castShadow）和一个环境光（`AmbientLight`，intensity=0.4）

#### Scenario: 地板渲染

- **WHEN** 3D 场景渲染
- **THEN** 场景 SHALL 包含一个水平地板（`PlaneGeometry` 旋转 -π/2，尺寸 14×8，灰色材质 `#1e293b`）

#### Scenario: 网格线

- **WHEN** 3D 场景渲染
- **THEN** 场景 SHALL 显示 drei `<Grid>` 组件辅助线（cellSize=1，sectionSize=4，淡灰色，fadeDistance=20）
