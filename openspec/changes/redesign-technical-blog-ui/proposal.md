## Why

当前站点已经具备完整的内容、导航和私密区域基础，但视觉语言仍偏早期工作台风格，卡片层级、排版节奏和阅读体验还不足以支撑一个现代、克制、有设计感的个人技术博客。

本次变更希望在不破坏既有路由、内容文件和功能边界的前提下，建立统一的视觉系统，并将首页、文章列表和文章详情页调整为 Editorial + Bento Grid + Minimal Tech Blog 的表达。

## What Changes

- 建立统一的设计 token，包括颜色、文字层级、圆角、边框、阴影、动效和 light/dark mode 兼容规则。
- 重塑首页首屏，使用更有设计感的 Hero 区域和 bento grid 信息布局，弱化当前依赖绝对定位的知识花园装饰。
- 优化文章列表页，将 notes、logs 和私密日志卡片统一为现代文章卡片布局。
- 优化文章详情页阅读体验，包括标题区、正文宽度、段落节奏、代码、引用、列表和链接样式。
- 保持现有内容读取、slug、语言切换、公开/私密内容访问规则、工具页、链接页和留言页功能不变。
- 添加克制的 hover、focus 和 transition 效果，避免赛博朋克、大面积霓虹、过度渐变和花哨动画。

## Capabilities

### New Capabilities

- `visual-design-system`: 约束全站视觉 token、主题兼容、基础 surface/card/form/navigation 样式和交互动效。
- `blog-content-presentation`: 约束首页、文章列表页和文章详情页的博客内容展示与阅读体验。

### Modified Capabilities

- 无。

## Impact

- 主要影响全局样式、应用外壳、首页、页面标题、文章卡片和文章详情组件。
- 预计涉及文件：
  - `src/app/globals.css`
  - `src/components/app-shell.tsx`
  - `src/app/page.tsx`
  - `src/components/page-heading.tsx`
  - `src/components/content-card.tsx`
  - `src/components/content-article.tsx`
- 可能需要顺带调整工具页、链接页、留言页、私密区中复用 `surface`、表单和卡片样式的局部类名，使全站视觉一致。
- 不新增运行时依赖，不修改内容目录结构，不修改既有路由，不改变鉴权、留言提交或内容读取逻辑。
