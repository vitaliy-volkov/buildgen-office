## ADDED Requirements

### Requirement: Agent 3D 角色几何体

系统 SHALL 为每个 VisualAgent 渲染一个由胶囊体和球体组成的拟人化角色。

#### Scenario: 角色组成

- **WHEN** VisualAgent 在 3D 场景中渲染
- **THEN** 角色 SHALL 由两部分组成：身体（`CapsuleGeometry(0.15, 0.4)`，y=0.35）和头部（`SphereGeometry(0.12)`，y=0.7），材质为 `MeshStandardMaterial`

#### Scenario: 确定性颜色

- **WHEN** 角色渲染
- **THEN** 身体颜色 SHALL 由 `avatar-generator` 基于 agentId 确定性生成，同一 agentId 每次打开页面颜色相同

#### Scenario: 角色位置

- **WHEN** 角色渲染
- **THEN** 角色 SHALL 位于 `position2dTo3d(agent.position)` 映射后的 3D 坐标，即 `(agent.position.x * 0.01, 0, agent.position.y * 0.01)`

### Requirement: 状态动画

系统 SHALL 为每种 AgentVisualStatus 渲染不同的动画效果。

#### Scenario: idle 呼吸动画

- **WHEN** Agent 状态为 `"idle"`
- **THEN** 角色身体 SHALL 有轻微的 Y 轴正弦波位移（振幅 0.02，频率 2Hz），模拟呼吸感

#### Scenario: thinking 加载圈

- **WHEN** Agent 状态为 `"thinking"`
- **THEN** 角色头顶 SHALL 出现一个 `TorusGeometry(0.15, 0.02, 8, 24)` 蓝色半透明环，以 `rotation.z += dt * 3` 的速度旋转

#### Scenario: tool_calling 虚拟屏幕

- **WHEN** Agent 状态为 `"tool_calling"`
- **THEN** 角色面前 SHALL 出现一个 `PlaneGeometry(0.5, 0.35)` 半透明面板（opacity=0.3，颜色 `#f97316`），面板上通过 drei `<Html>` 显示当前工具名称

#### Scenario: speaking 对话气泡

- **WHEN** Agent 状态为 `"speaking"` 且 `speechBubble` 不为空
- **THEN** 角色头顶 SHALL 通过 drei `<Html distanceFactor={10}>` 组件渲染 SpeechBubble，内容使用 react-markdown 渲染

#### Scenario: error 错误标志

- **WHEN** Agent 状态为 `"error"`
- **THEN** 角色头顶 SHALL 出现一个 `OctahedronGeometry(0.1)` 红色 `#ef4444` 八面体，以缓慢旋转速度 `rotation.y += dt * 1.5` 运动

#### Scenario: offline 状态

- **WHEN** Agent 状态为 `"offline"`
- **THEN** 角色 SHALL 整体材质变为灰色 `#6b7280`，opacity=0.4

### Requirement: Sub-Agent 外观区分

系统 SHALL 使 Sub-Agent 角色在视觉上明显区别于常驻 Agent。

#### Scenario: 半透明蓝色材质

- **WHEN** Agent 的 `isSubAgent` 为 true
- **THEN** 角色材质 SHALL 使用 `transparent: true, opacity: 0.6, color: "#60a5fa"`（忽略 avatar-generator 生成的颜色）

#### Scenario: 缩放脉冲

- **WHEN** Sub-Agent 角色渲染
- **THEN** 角色 SHALL 有持续的 scale 脉冲动画：`scale = 1.0 + sin(time * 3) * 0.05`，模拟"边缘发光"效果

### Requirement: 角色交互

系统 SHALL 支持在 3D 场景中点击和悬停 Agent 角色。

#### Scenario: 点击选中

- **WHEN** 用户点击 3D 场景中的 Agent 角色
- **THEN** 系统 SHALL 调用 `selectAgent(agentId)`，选中的角色 SHALL 显示底部发光圆环指示

#### Scenario: 悬停提示

- **WHEN** 鼠标悬停在 Agent 角色上
- **THEN** 角色头顶 SHALL 通过 drei `<Html>` 显示 tooltip：Agent 名称 + 状态文字
