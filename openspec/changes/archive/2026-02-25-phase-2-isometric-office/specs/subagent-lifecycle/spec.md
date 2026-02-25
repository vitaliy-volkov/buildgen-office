## ADDED Requirements

### Requirement: Sub-Agent 检测

系统 SHALL 通过 RPC 轮询检测 Sub-Agent 的新增和消亡。

#### Scenario: 定期轮询 sessions.list

- **WHEN** WebSocket 已连接
- **THEN** 系统 SHALL 每 3 秒调用 `sessions.list` RPC，对比前后两次结果的 diff

#### Scenario: 检测新 Sub-Agent

- **WHEN** sessions.list 返回的结果中包含新的 session 且该 session 的 `requesterSessionKey` 或父子关系指向已知 Agent
- **THEN** 系统 SHALL 创建新的 VisualAgent（`isSubAgent=true`，`parentAgentId` 设为父 Agent ID），分配 Hot Desk Zone 位置，触发派生动画

#### Scenario: 检测 Sub-Agent 消亡

- **WHEN** 前次存在的 Sub-Agent session 在新一轮 sessions.list 中消失或其状态变为 ended
- **THEN** 系统 SHALL 触发消亡动画，动画完成后从 store 中移除该 VisualAgent

#### Scenario: 连接断开时停止轮询

- **WHEN** WebSocket 断开连接
- **THEN** sessions.list 轮询 SHALL 暂停，重连成功后恢复

### Requirement: Sub-Agent 派生动画

系统 SHALL 在 Sub-Agent 出现时渲染视觉特效。

#### Scenario: 父 Agent 光环

- **WHEN** Sub-Agent 被检测到生成
- **THEN** 父 Agent 位置 SHALL 闪现 3 个同心 `RingGeometry` 光环，旋转 + 缩放动画，持续 800ms 后消失

#### Scenario: 子 Agent 缩放出现

- **WHEN** Sub-Agent 被检测到生成
- **THEN** 新角色 SHALL 在分配的 Hot Desk 位置以 scale 0→1 的动画出现（duration 800ms，easeOutBack 缓动）

#### Scenario: 父子光束

- **WHEN** 父 Agent 光环动画播放期间
- **THEN** 父 Agent 到子 Agent 位置之间 SHALL 短暂显示一道光束连线（duration 与光环动画一致）

### Requirement: Sub-Agent 消亡动画

系统 SHALL 根据消亡原因渲染不同的消失效果。

#### Scenario: 正常完成消散

- **WHEN** Sub-Agent 消亡且 outcome 为 `"ok"` 或 `"complete"`
- **THEN** 角色 SHALL 以绿色调淡出 + 向上位移 + scale 1→0 的动画消失（duration 800ms）

#### Scenario: 错误消亡

- **WHEN** Sub-Agent 消亡且 outcome 为 `"error"` 或 `"timeout"`
- **THEN** 角色 SHALL 以红色闪烁（3 次快闪）后淡出消失（duration 800ms）

#### Scenario: 被终止消亡

- **WHEN** Sub-Agent 消亡且 outcome 为 `"killed"`
- **THEN** 角色 SHALL 以快速缩小（scale 1→0，duration 400ms）动画消失

### Requirement: 父子连线

系统 SHALL 在父 Agent 和活跃 Sub-Agent 之间渲染持续可见的连线。

#### Scenario: 虚线连线

- **WHEN** Sub-Agent 在场景中存在
- **THEN** 父 Agent 和 Sub-Agent 之间 SHALL 显示 drei `<Line>` 组件渲染的虚线（`dashed, dashScale={2}`）

#### Scenario: 连线颜色

- **WHEN** 父子连线渲染
- **THEN** 连线颜色 SHALL 跟随 Sub-Agent 的状态颜色（使用 STATUS_COLORS 映射）
