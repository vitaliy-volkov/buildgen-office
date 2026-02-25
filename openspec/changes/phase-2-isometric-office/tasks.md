## 1. 依赖安装与类型扩展

- [x] 1.1 安装 3D 依赖：`pnpm add three @react-three/fiber @react-three/drei && pnpm add -D @types/three`
- [x] 1.2 验证依赖安装成功：`pnpm typecheck` 无新增类型错误
- [x] 1.3 扩展 `src/gateway/types.ts` 中 VisualAgent 类型：新增 `parentAgentId: string | null`、`childAgentIds: string[]`、`zone: "desk" | "meeting" | "hotDesk" | "lounge"`、`originalPosition: { x: number; y: number } | null`
- [x] 1.4 更新 `src/store/office-store.ts` 中 `createVisualAgent()` 函数，初始化新增字段：`parentAgentId: null, childAgentIds: [], zone: "desk", originalPosition: null`
- [x] 1.5 在 `src/gateway/types.ts` 中新增 `SubAgentInfo` 类型（用于 sessions.list 轮询 diff）和 `SessionSnapshot` 类型
- [x] 1.6 更新 `src/gateway/types.ts` 中 OfficeStore 接口，新增 `lastSessionsSnapshot`、Sub-Agent 管理 actions
- [x] 1.7 验证现有测试通过：`pnpm test` 确认类型扩展不破坏 Phase 1 功能

## 2. 坐标映射与工具函数

- [x] 2.1 在 `src/lib/constants.ts` 中新增 3D 映射常量：`SCALE_X_2D_TO_3D = 16/1200`、`SCALE_Z_2D_TO_3D = 12/700`、`DESK_HEIGHT = 0.42`、`CHARACTER_Y = 0`、`MEETING_TABLE_RADIUS = 1.2`、`MEETING_SEAT_RADIUS = 1.7`
- [x] 2.2 在 `src/lib/position-allocator.ts` 中新增 `position2dTo3d(pos: {x,y}): [number, number, number]` 函数
- [x] 2.3 新增 `allocateMeetingPositions(agentIds: string[], tableCenter: {x,y}): Array<{x,y}>` 函数——按等角分布计算环坐座位
- [x] 2.4 创建 `src/lib/__tests__/position-allocator-3d.test.ts`，测试 position2dTo3d 映射一致性、会议座位计算的等角分布和碰撞避免
- [x] 2.5 在 `src/lib/avatar-generator.ts` 中新增 `generateAvatar3dColor(agentId): string` 函数，返回 MeshStandardMaterial 可用的十六进制颜色字符串

## 3. R3F 基础场景

- [x] 3.1 创建 `src/components/office-3d/Scene3D.tsx`——R3F `<Canvas>` 容器（perspective, antialias, 浅色背景 #e8ecf2），包裹 Environment + OfficeLayout + Agent 渲染
- [x] 3.2 重写 `src/components/office-3d/Environment3D.tsx`——仿真办公室建筑：浅色墙壁、多层地板、窗户发光效果、楼梯装饰元素、服务器机架；灯光：DirectionalLight + AmbientLight + HemisphereLight（明亮暖色调）
- [x] 3.3 改用 PerspectiveCamera（fov=42），初始位置 [22,15,22]，lookAt 场景中心 [8,0,6]
- [x] 3.4 配置 OrbitControls：**enableRotate={true}**，限制极角 minPolarAngle=π/8 maxPolarAngle=π/2.8，enableDamping，enablePan+enableZoom，target 设为场景中心
- [x] 3.5 添加 WebGL 可用性检测：创建 `src/lib/webgl-detect.ts`（`isWebGLAvailable(): boolean`），在 App 中如不可用则锁定 2D 模式
- [x] 3.6 验证 3D 场景渲染：`pnpm dev` 后切换到 3D 模式可看到浅色办公室建筑+灯光+旋转交互

## 4. 3D 办公家具布局

- [x] 4.1 重写 `src/components/office-3d/OfficeLayout3D.tsx`——渲染真实办公家具：木色桌面+显示器(发光屏幕)+键盘、办公椅（带靠背扶手金属底座）、书架（彩色书籍）、沙发（蓝色坐垫）、咖啡桌、绿植
- [x] 4.2 Workstation 组件——桌面(木色) + 金属桌腿 + 显示器(深色边框+蓝色发光屏) + 键盘 + 办公椅（灰/蓝配色）
- [x] 4.3 按功能区排列家具：工位区（2×3成排工位）、会议区（六边形桌+6椅）、热工位区（2×3工位）、休息区（沙发/茶几/书架）
- [x] 4.4 会议桌：六边形桌面 + 蓝色发光边缘 + 6把围坐椅子
- [x] 4.5 区域标识：地面不同颜色（蓝/紫/橙/绿）半透明区分，区域名称使用 drei `<Html>` 标签
- [x] 4.6 验证：3D 办公室浅色 isometric 风格，建筑感强，接近设计稿效果

## 5. Agent 3D 角色组件

- [x] 5.1 创建 `src/components/office-3d/AgentCharacter.tsx`——接收 VisualAgent prop，渲染 CapsuleGeometry(0.15, 0.4) 身体 + SphereGeometry(0.12) 头部
- [x] 5.2 实现确定性颜色：从 avatar-generator 获取颜色，应用 MeshStandardMaterial
- [x] 5.3 实现 Sub-Agent 外观：`isSubAgent=true` 时材质 `transparent:true, opacity:0.6, color:#60a5fa`，加 scale 脉冲动画 `1.0 + sin(time*3)*0.05`
- [x] 5.4 实现 idle 呼吸动画：useFrame 中 `body.position.y = baseY + sin(time*2) * 0.02`
- [x] 5.5 创建 `src/components/office-3d/ThinkingIndicator.tsx`——TorusGeometry(0.15, 0.02, 8, 24) 蓝色半透明，rotation.z 持续旋转
- [x] 5.6 创建 `src/components/office-3d/ToolScreen.tsx`——PlaneGeometry(0.5, 0.35) 橙色半透明 + drei `<Html>` 显示工具名称
- [x] 5.7 创建 `src/components/office-3d/ErrorIndicator.tsx`——OctahedronGeometry(0.1) 红色，rotation.y 缓慢旋转
- [x] 5.8 实现 speaking 状态：drei `<Html distanceFactor={10}>` 渲染 SpeechBubble，复用 Phase 1 的 SpeechBubbleOverlay 样式
- [x] 5.9 实现 offline 状态：整体材质变灰 #6b7280，opacity=0.4
- [x] 5.10 实现选中指示：选中的角色底部显示发光圆环（RingGeometry + emissive material）
- [x] 5.11 实现点击交互：R3F `onClick` 事件调用 `selectAgent(agent.id)`
- [x] 5.12 实现悬停 tooltip：`onPointerOver` 时通过 drei `<Html>` 显示 Agent 名称+状态
- [x] 5.13 验证角色渲染：5 种状态各有正确的视觉区分，Sub-Agent 明显不同于常驻 Agent

## 6. 2D↔3D 视图切换

- [x] 6.1 修改 `src/components/layout/TopBar.tsx`——在连接状态左侧添加 "2D"/"3D" 按钮组，当前模式高亮
- [x] 6.2 修改 `src/App.tsx`——使用 `React.lazy` 懒加载 Scene3D，按 `viewMode` 条件渲染：`viewMode==="2d" ? <FloorPlan/> : <Suspense fallback={<Loading/>}><Scene3D/></Suspense>`
- [x] 6.3 实现 fade 过渡动画：切换时主渲染区 opacity 1→0→1（duration 300ms）
- [x] 6.4 实现 Suspense fallback 组件：居中显示"加载 3D 场景..."文字 + 旋转动画
- [x] 6.5 WebGL 不可用时禁用 3D 按钮并显示 tooltip
- [x] 6.6 验证切换功能：2D→3D→2D 来回切换，Agent 状态和选中状态保持一致

## 7. Sub-Agent 检测（sessions 轮询）

- [x] 7.1 创建 `src/hooks/useSubAgentPoller.ts`——每 3 秒调用 `sessions.list` RPC，对比前后快照 diff 检测新增/消亡的 Sub-Agent
- [x] 7.2 实现 diff 算法：比较 prev/next sessions 快照，识别新出现的 session（requesterSessionKey 指向已知 Agent）、已消失的 session
- [x] 7.3 检测到新 Sub-Agent 时：调用 store.addSubAgent(parentAgentId, subAgentInfo)，分配 Hot Desk 位置
- [x] 7.4 检测到 Sub-Agent 消亡时：触发消亡动画流程（设置消亡状态），动画完成后调用 store.removeAgent
- [x] 7.5 连接断开时暂停轮询，重连后恢复
- [x] 7.6 在 `src/hooks/useGatewayConnection.ts` 中集成 useSubAgentPoller
- [x] 7.7 创建 `src/hooks/__tests__/subagent-poller.test.ts`——测试 diff 算法：新增/消亡/无变化三种 case

## 8. Sub-Agent 动画效果

- [ ] 8.1 创建 `src/components/office-3d/SpawnPortal.tsx`——3 个同心 RingGeometry 光环旋转+缩放动画（800ms），位于父 Agent 位置
- [ ] 8.2 实现 spawn 光束：父→子位置之间的临时 Line 光束（与光环同步消失）
- [ ] 8.3 实现角色缩放出现动画：新 Sub-Agent 以 scale 0→1 + easeOutBack 缓动出现（800ms）
- [ ] 8.4 创建 `src/components/office-3d/DespawnEffect.tsx`——三种消亡动画：complete（绿色淡出+上移+缩小）、error（红色闪烁 3 次后淡出）、killed（快速缩小 400ms）
- [ ] 8.5 实现父子虚线连线：drei `<Line dashed dashScale={2}>` 连接父 Agent 和 Sub-Agent，颜色跟随 STATUS_COLORS[subAgent.status]
- [ ] 8.6 验证动画效果：手动触发 Sub-Agent 后观察派生/消亡动画是否流畅

## 9. 会议区协作聚集

- [ ] 9.1 创建 `src/store/meeting-manager.ts`——封装协作检测+聚集逻辑：监听 store.links 变化，当同一 sessionKey 的 links 中有 2+ Agent 且 strength > 0.3 时触发聚集
- [ ] 9.2 实现聚集动作：保存参与 Agent 的 originalPosition，计算会议桌座位位置，更新 agent.position 和 agent.zone
- [ ] 9.3 实现返回动作：当所有相关 links 被移除或 strength 衰减到 0 时，恢复 originalPosition
- [ ] 9.4 实现多组会议支持：按 sessionKey 分组，最多 3 组同时在会议区，各组分配不同的会议桌位置
- [ ] 9.5 在 3D 场景中实现角色位置平滑过渡：使用 lerp 插值，过渡 800ms
- [ ] 9.6 实现会议任务标签：圆桌上方 drei `<Html>` 显示参与 Agent 名称列表
- [ ] 9.7 创建 `src/store/__tests__/meeting-manager.test.ts`——测试聚集触发/座位计算/返回原位逻辑

## 10. Sub-Agent 列表面板

- [ ] 10.1 创建 `src/components/panels/SubAgentPanel.tsx`——展示活跃 Sub-Agent 卡片列表
- [ ] 10.2 每个卡片显示：名称、父 Agent 名称（可点击选中父 Agent）、任务描述（截断 80 字符）、状态标签、运行时长
- [ ] 10.3 点击卡片选中对应 Sub-Agent
- [ ] 10.4 无活跃 Sub-Agent 时隐藏面板
- [ ] 10.5 修改 `src/components/layout/Sidebar.tsx`——在 Agent 列表下方集成 SubAgentPanel
- [ ] 10.6 创建 `src/components/panels/__tests__/SubAgentPanel.test.tsx`——测试卡片渲染、点击选中、空状态隐藏

## 11. 底部操作栏

- [ ] 11.1 创建 `src/components/layout/ActionBar.tsx`——半透明底部浮动栏，包含 Pause / Spawn Sub-Agent / Interview 三个按钮
- [ ] 11.2 实现显示/隐藏条件：有 Agent 被选中 OR 会议区有 Agent 时显示，否则隐藏
- [ ] 11.3 实现滑入/滑出动画（transition duration 300ms）
- [ ] 11.4 Phase 2 中按钮点击显示 tooltip "此功能将在后续版本中启用"
- [ ] 11.5 集成到 `src/components/layout/AppShell.tsx`

## 12. Store 扩展实现

- [x] 12.1 在 office-store.ts 中实现 `addSubAgent(parentId, info)` action——创建 VisualAgent(isSubAgent=true)，设置 parentAgentId，更新父 Agent 的 childAgentIds
- [x] 12.2 实现 `removeSubAgent(subAgentId)` action——移除 VisualAgent，从父 Agent 的 childAgentIds 中清除
- [x] 12.3 实现 `moveToMeeting(agentId, meetingPosition)` action——保存 originalPosition，更新 position 和 zone
- [x] 12.4 实现 `returnFromMeeting(agentId)` action——恢复 originalPosition，清空 originalPosition
- [x] 12.5 添加 `lastSessionsSnapshot` 状态字段和 `setSessionsSnapshot` action
- [x] 12.6 创建 `src/store/__tests__/office-store-subagent.test.ts`——测试 Sub-Agent 增删、父子关系维护

## 13. 单元测试

- [ ] 13.1 更新 `src/store/__tests__/office-store.test.ts`——验证扩展字段初始值（parentAgentId / childAgentIds / zone / originalPosition）
- [ ] 13.2 测试 viewMode 切换：setViewMode("3d") → store.viewMode === "3d"
- [ ] 13.3 创建 `src/lib/__tests__/webgl-detect.test.ts`——测试 isWebGLAvailable 在有/无 WebGL context 时的返回值
- [ ] 13.4 测试 avatar-generator 3D 颜色生成：同一 agentId 返回相同颜色

## 14. 组件测试

- [ ] 14.1 创建 `src/components/office-3d/__tests__/AgentCharacter.test.tsx`——验证角色接收 VisualAgent prop 渲染（使用 @react-three/test-renderer 或仅测试 props 传递逻辑）
- [ ] 14.2 创建 `src/components/layout/__tests__/TopBar-viewmode.test.tsx`——测试 2D/3D 按钮点击调用 setViewMode
- [ ] 14.3 创建 `src/components/layout/__tests__/ActionBar.test.tsx`——测试显示/隐藏条件、按钮 tooltip

## 15. 集成测试

- [ ] 15.1 创建 `src/hooks/__tests__/subagent-poller-integration.test.ts`——mock RPC 返回两轮不同 sessions.list，验证 Sub-Agent 自动创建和移除
- [ ] 15.2 创建 `src/store/__tests__/meeting-manager-integration.test.ts`——模拟多 Agent 协作事件流 → 验证 Agent 移入会议区 → 协作结束 → 验证返回原位

## 16. 端到端验证

- [ ] 16.1 执行 `pnpm dev`，验证 2D 视图正常（Phase 1 功能无回归）
- [ ] 16.2 切换到 3D 模式，验证 isometric 办公室场景渲染（灯光/地板/桌椅/区域标记）
- [ ] 16.3 验证 Agent 角色在 3D 场景中正确渲染，颜色与 2D 圆点一致
- [ ] 16.4 触发 Agent 运行，验证 5 种状态动画在 3D 场景中正确播放
- [ ] 16.5 验证 Sub-Agent 检测：触发 Sub-Agent 后 3 秒内出现新角色 + 派生动画
- [ ] 16.6 验证 Sub-Agent 消亡动画：Sub-Agent 完成后观察绿色消散效果
- [ ] 16.7 验证父子连线：父 Agent 和 Sub-Agent 之间有虚线
- [ ] 16.8 验证 Sub-Agent 面板：侧栏显示活跃 Sub-Agent 卡片
- [ ] 16.9 验证会议区聚集：多 Agent 协作时角色移入会议区，协作结束后返回
- [ ] 16.10 验证底部操作栏：选中 Agent 后出现操作栏，按钮显示 tooltip
- [ ] 16.11 2D↔3D 来回切换，验证状态一致性
- [ ] 16.12 执行 `pnpm test` 确认所有测试通过
- [ ] 16.13 执行 `pnpm typecheck` 确认无类型错误
- [ ] 16.14 执行 `pnpm check` 确认 lint + format 通过
