## Why

Phase 1 已交付了基于 2D SVG 平面图的 Agent 实时监控界面，但扁平的圆点 + 文字标签无法传达"数字员工在办公室协作"的拟人化体验。Phase 2 将 2D 平面图升级为 Isometric 2.5D 办公室场景——Agent 不再是色块圆点，而是坐在工位前、有呼吸感的"小人"角色；工位不再是矩形区域标签，而是有桌椅的真实办公空间；Sub-Agent（临时工）的派生与消亡将以传送门光效和粒子消散呈现。这是 OpenClaw Office 从"数据看板"进化为"数字孪生办公室"的核心一步。

## What Changes

- **新增 R3F 3D 渲染引擎**：集成 React Three Fiber + drei，用 OrthographicCamera 实现 isometric 等距投影视角，含灯光、地板、网格线、区域标记
- **新增 3D 办公家具布局**：用 BoxGeometry 构建桌椅模型，按四区域（工位区/会议区/热工位区/休息区）排列，为 Agent 角色提供"坐"的位置感
- **新增 Agent 3D 角色系统**：每个 Agent 渲染为胶囊体(身体) + 球体(头部)的拟人小人，颜色由 avatar-generator 确定性生成，5 种状态各有独立动画（呼吸/思考圈/虚拟屏幕/对话气泡/错误标志）
- **新增 2D↔3D 视图切换**：TopBar 添加切换按钮，App.tsx 按 viewMode 条件渲染 FloorPlan 或 Scene3D，带 fade 过渡
- **新增 Sub-Agent 生命周期可视化**：通过 RPC 轮询 `sessions.list` 检测 Sub-Agent 变化（Gateway 不广播 subagent 事件），派生时显示传送门光环 + 角色缩放出现动画，消亡时按原因（complete/error/killed）显示不同消散动画
- **新增父子 Agent 连线**：使用 drei `<Line>` 组件在父 Agent 和 Sub-Agent 之间渲染虚线光束，颜色随状态变化
- **新增会议区协作聚集**：当 2+ Agent 通过 sessionKey 建立协作关系时，角色自动平滑移动到会议区圆桌旁围坐，桌面上方浮现协作任务标签
- **新增 Sub-Agent 列表面板**：侧栏新增面板，展示活跃 Sub-Agent 的名称、父 Agent、任务、状态、运行时长
- **新增底部操作栏**：会议/选中模式下底部浮现 Pause / Spawn / Interview 按钮（Phase 2 仅 UI 壳，Phase 3 实现实际功能）

## Capabilities

### New Capabilities

- `r3f-scene`: R3F 基础场景——Canvas 容器、isometric 相机、灯光环境、地板网格、区域地面标记、OrbitControls（禁旋转，允许平移缩放）
- `office-furniture`: 3D 办公家具布局——桌椅 BoxGeometry 模型、按四区域排列、区域半透明彩色地面
- `agent-character`: Agent 3D 角色系统——胶囊体+球头几何体、确定性 avatar 颜色、5 种状态动画（idle 呼吸/thinking 加载圈/tool_calling 虚拟屏幕/speaking HTML 气泡/error 旋转八面体）、Sub-Agent 半透明蓝色外观
- `view-mode-switch`: 2D↔3D 视图切换——TopBar 切换按钮、App.tsx 条件渲染、fade 过渡动画
- `subagent-lifecycle`: Sub-Agent 生命周期可视化——RPC 轮询检测、派生传送门动画（同心光环+缩放出现）、消亡动画（complete 绿色消散/error 红色闪烁/killed 快速缩小）、父子虚线连线
- `meeting-zone`: 会议区协作聚集——协作检测增强、角色自动移入会议区、圆桌模型+围坐排列、任务标签 HTML overlay、协作结束返回原位
- `action-bar`: 底部操作栏——Pause/Spawn/Interview 按钮 UI、会议/选中模式下显示（Phase 2 仅 UI 壳）
- `subagent-panel`: Sub-Agent 列表面板——活跃 Sub-Agent 卡片列表、父 Agent 关联、任务描述、运行时长、点击定位

### Modified Capabilities

- `office-store`: 新增 Sub-Agent 管理（parentAgentId/childAgentIds 字段）、会议区位置管理（originalPosition 保存/恢复）、sessions 轮询状态、viewMode 切换功能启用
- `event-processing`: 扩展 VisualAgent 类型（新增 parentAgentId / childAgentIds / zone / originalPosition 等字段）以支持 Sub-Agent 和会议区功能
- `floor-plan-2d`: position-allocator 升级支持 2D→3D 坐标映射函数、会议区位置分配

## Impact

- **新增依赖**：`three`、`@react-three/fiber`、`@react-three/drei`、`@types/three`（devDep）
- **代码范围**：新增 `src/components/office-3d/` 目录（~10 个组件文件），修改 `src/gateway/types.ts`（VisualAgent 扩展）、`src/store/office-store.ts`（Sub-Agent 管理）、`src/lib/position-allocator.ts`（3D 坐标）、`src/lib/constants.ts`（3D 区域常量）、`src/App.tsx`（viewMode 切换）、`src/components/layout/TopBar.tsx`（切换按钮）
- **Gateway 依赖**：通过 RPC `sessions.list` 轮询检测 Sub-Agent 变化（每 3 秒），不依赖新的 Gateway 事件或 API
- **性能影响**：3D 渲染引入 Three.js（~500KB gzipped），需代码分割确保 2D 模式不加载 3D 代码；3D 场景需保持 ≥24fps
