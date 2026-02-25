## ADDED Requirements

### Requirement: 视图切换按钮

系统 SHALL 在 TopBar 中提供 2D↔3D 视图切换功能。

#### Scenario: 切换按钮渲染

- **WHEN** TopBar 渲染
- **THEN** SHALL 在连接状态指示器左侧显示视图切换按钮组：两个按钮 "2D" 和 "3D"，当前活跃的模式按钮 SHALL 有高亮底色

#### Scenario: 切换到 3D

- **WHEN** 用户点击 "3D" 按钮且当前为 2D 模式
- **THEN** 系统 SHALL 调用 `setViewMode("3d")`，主渲染区 SHALL 以 fade 过渡（opacity 1→0→1，duration 300ms）从 FloorPlan 切换到 Scene3D

#### Scenario: 切换到 2D

- **WHEN** 用户点击 "2D" 按钮且当前为 3D 模式
- **THEN** 系统 SHALL 调用 `setViewMode("2d")`，主渲染区 SHALL 以 fade 过渡从 Scene3D 切换回 FloorPlan

### Requirement: 3D 模块懒加载

系统 SHALL 仅在切换到 3D 模式时加载 Three.js 相关代码。

#### Scenario: 首次进入 3D 模式

- **WHEN** 用户首次点击 "3D" 按钮
- **THEN** 系统 SHALL 通过 `React.lazy` 异步加载 Scene3D 组件，加载期间显示 Suspense fallback（"加载 3D 场景..."文字 + 旋转动画）

#### Scenario: 2D 模式不加载 3D

- **WHEN** 页面以 2D 模式打开且用户从未切换到 3D
- **THEN** Three.js 相关代码 SHALL 不被加载（通过代码分割实现）
