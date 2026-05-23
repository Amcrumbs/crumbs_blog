## Context

当前项目是基于 Next.js、TypeScript 和内容文件驱动的个人博客 / 个人知识空间。页面结构集中，首页、列表页、详情页和工具/链接/留言页都复用 `surface`、`surface-strong`、`text-muted`、`prose-workspace` 等全局样式类，因此本次视觉改造适合优先从全局设计 token 和少量通用组件入手。

现有视觉偏暗色棕调工作台，首页使用绝对定位的知识花园图形。它有个性，但和目标中的 Editorial + Bento Grid + Minimal Tech Blog 不完全匹配：信息层级不够现代，阅读页面板感偏重，颜色命名和实际色相也存在语义不一致。

约束：

- 保持现有路由、内容目录、frontmatter、公开/私密内容规则和语言切换机制。
- 不新增无必要依赖。
- 优先通过 `globals.css` 的 token 和通用类统一视觉，而不是在每个组件里散写颜色、圆角和阴影。
- 设计应兼容 light/dark mode，并在没有额外主题切换控件时尊重系统主题。

## Goals / Non-Goals

**Goals:**

- 将全站视觉语言调整为现代、克制、有设计感的个人技术博客。
- 建立统一的颜色、排版、圆角、边框、阴影和动效规则。
- 重塑首页为 Hero + Bento Grid 的第一屏体验。
- 将文章列表调整为现代卡片布局，提升扫描效率。
- 优化文章详情页阅读体验，突出正文内容而非容器装饰。
- 保持工具页、链接页、留言页和私密区在新视觉系统下不割裂。
- 通过 `npm run typecheck`、`npm run lint`、`npm run build` 验证改造结果。

**Non-Goals:**

- 不修改内容读取逻辑、slug 规则、Markdown frontmatter 结构或语言文件结构。
- 不新增 CMS、搜索、评论审核后台、命令面板或真实工具处理能力。
- 不引入动画库、主题库或新的 UI 组件库。
- 不做品牌重命名，不改变 Personal OS 的信息架构。

## Decisions

### 1. 以 CSS 变量作为设计系统入口

继续使用 `src/app/globals.css` 中的 CSS 变量，扩展为语义化 token：

- 背景：`--bg`、`--bg-subtle`
- 表面：`--surface`、`--surface-strong`、`--surface-glass`
- 边框：`--line`、`--line-soft`
- 文本：`--text`、`--muted`、`--faint`
- 强调：`--accent`、`--accent-soft`
- 状态：`--success`、`--warning`、`--danger`
- 形状与层级：`--radius-sm`、`--radius-md`、`--radius-lg`、`--shadow-soft`

理由：现有组件已经通过全局类使用 token，集中改造可以减少散乱样式和无关重构。

备选方案：引入 Tailwind theme 配置或组件库。暂不采用，因为当前项目使用 Tailwind v4 的全局 CSS 导入，规模较小，CSS 变量更直接可维护。

### 2. Light/dark mode 尊重系统主题

默认提供浅色主题，并通过 `@media (prefers-color-scheme: dark)` 提供暗色 token。暂不新增手动主题切换状态。

理由：需求是添加兼容，不是实现完整主题偏好持久化。尊重系统主题可以满足基础 light/dark 体验，同时避免引入客户端状态和 cookie。

备选方案：新增手动主题开关。暂不采用，因为会扩大范围，涉及导航控件、持久化和水合状态。

### 3. 首页从知识花园图改为 Editorial Hero + Bento Grid

首页首屏采用大标题、简短描述、核心入口和多个 bento 模块组成。模块包括近期内容、内容分类、工具快捷入口和公开链接摘要。现有 `garden-map` 的绝对定位节点应移除或降级为更稳定的网格模块。

理由：目标风格明确包含 Bento Grid 和 Minimal Tech Blog。网格布局比绝对定位图形更响应式、更易维护，也更适合访客快速理解站点内容。

备选方案：保留知识花园作为主视觉。暂不采用，因为它更接近概念装饰，移动端稳定性和技术博客气质不如 bento 布局。

### 4. 文章详情页弱化面板，强化阅读排版

详情页保留清晰的文章 header，但正文应使用更宽松的 editorial 排版，而不是被厚重卡片包裹。正文最大宽度控制在约 `720px` 到 `780px`，段落行高约 `1.8`，标题、代码、引用、列表和链接都使用统一 prose token。

理由：个人技术博客的核心体验是阅读。容器应服务于内容，不应抢走标题和正文的注意力。

备选方案：继续沿用 `surface` 卡片作为整篇文章容器。暂不采用，因为阅读页会显得像后台面板而不是博客文章。

### 5. 动效以反馈为主，不做装饰动画

卡片、导航和按钮只使用轻微的 `border-color`、`background`、`transform: translateY(-2px)` 和 `box-shadow` 变化。统一 transition 时长约 `160ms` 到 `220ms`。

理由：符合“克制、有设计感”的目标，同时提升可感知交互。

备选方案：滚动动画、复杂渐变和强发光。明确不采用，避免偏离目标风格。

## Risks / Trade-offs

- 颜色 token 调整影响面广 → 先保持类名兼容，再逐步替换局部硬编码颜色。
- 浅色主题可能暴露部分 `text-white`、`bg-black/30` 等硬编码 → 实现时需要扫描并将关键组件改成 token 类。
- 首页重构可能改变现有视觉识别 → 保留 Personal OS 的信息架构和导航入口，避免变成营销落地页。
- 没有手动主题切换 → 本次仅满足系统主题兼容，后续如需要可单独新增主题偏好能力。
- 中文字典当前存在乱码内容 → 本次不处理文案编码问题，除非实现时必须触碰相关文件。

## Migration Plan

1. 更新全局 token、surface、prose、表单、hover 和 focus 样式。
2. 调整 AppShell，使导航、品牌区和状态区适配新 token 与 light/dark。
3. 重构首页布局为 Hero + Bento Grid。
4. 调整 PageHeading、ContentCard、ContentArticle。
5. 扫描工具页、链接页、留言页、私密区中的硬编码颜色和边框，做必要的兼容性修改。
6. 运行 `npm run typecheck`、`npm run lint`、`npm run build`。

回滚策略：本次不涉及数据迁移。若视觉改造不符合预期，可以回退相关样式和组件文件，不影响内容数据。

## Open Questions

- 是否需要在后续变更中加入手动 light/dark mode 切换控件。
- 是否需要单独修复当前中文字典内容的乱码问题。
