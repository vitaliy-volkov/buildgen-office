## 1. Setup

- [x] 1.1 检查并安装 `lucide-react` 图标库（如果尚未安装）

## 2. 优化 FloorPlan 基础样式

- [x] 2.1 修改 `FloorPlan.tsx`，在 `<svg>` 中添加 `<defs>`，定义背景渐变和阴影滤镜
- [x] 2.2 更新 `FloorPlan.tsx` 中的 `rect` 元素，应用渐变、圆角（rx=16）和阴影滤镜
- [x] 2.3 修改 `ZoneLabel.tsx`，为标签添加半透明背景（毛玻璃效果）和更柔和的文字颜色

## 3. 优化 AgentDot 拟人化展示

- [x] 3.1 修改 `AgentDot.tsx`，引入 `lucide-react` 图标（如 `Bot` 或 `User`）
- [x] 3.2 优化 `AgentDot.tsx` 的渲染逻辑，使用图标组合替代原有的纯色圆点，并将状态颜色应用到图标背景或光晕上
- [x] 3.3 调整 `AgentDot.tsx` 中选中状态的高亮效果，增加外发光或更明显的边框
- [x] 3.4 优化 `AgentDot.tsx` 的悬浮提示框（tooltip），增加毛玻璃效果（`backdrop-filter`）和阴影

## 4. 优化 ConnectionLine 协作连线

- [x] 4.1 修改 `ConnectionLine.tsx`，为连线添加轻微的发光滤镜
- [x] 4.2 优化 `ConnectionLine.tsx` 的 `stroke-dasharray` 和 CSS 动画，使其流动效果更平滑、更具科技感

## 5. 测试与验证

- [x] 5.1 运行前端开发服务器，在浏览器中查看 2D 视图效果
- [x] 5.2 验证各区域背景、标签、Agent 图标、悬浮提示和协作连线的视觉效果是否符合预期
- [x] 5.3 截图并分析优化效果
