## ADDED Requirements

### Requirement: 底部操作栏

系统 SHALL 在特定模式下显示底部操作按钮栏。

#### Scenario: 操作栏显示条件

- **WHEN** 有 Agent 被选中，或有 Agent 在会议区
- **THEN** 视口底部 SHALL 显示半透明背景的操作栏，从底部滑入（transition duration 300ms）

#### Scenario: 操作按钮内容

- **WHEN** 操作栏渲染
- **THEN** SHALL 包含三个按钮：Pause Agent（暂停图标 + "暂停"文字）、Spawn Sub-Agent（派生图标 + "派生子Agent"文字）、Interview（对话图标 + "对话"文字）

#### Scenario: 按钮状态（Phase 2）

- **WHEN** 用户点击操作栏按钮
- **THEN** Phase 2 中按钮 SHALL 显示 tooltip "此功能将在后续版本中启用"，不执行实际操作

#### Scenario: 操作栏隐藏

- **WHEN** 没有 Agent 被选中且会议区无 Agent
- **THEN** 操作栏 SHALL 以滑出动画隐藏（transition duration 300ms）
