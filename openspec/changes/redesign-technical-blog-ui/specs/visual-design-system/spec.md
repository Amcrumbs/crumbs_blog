## ADDED Requirements

### Requirement: Unified visual tokens

系统 MUST 使用统一的设计 token 管理全站颜色、文字、边框、圆角、阴影、表面层级和状态色，并优先在全局样式中定义这些 token。

#### Scenario: Global tokens define the visual foundation

- **WHEN** 开发者查看全局样式
- **THEN** 系统提供语义化 token 覆盖背景、表面、边框、主文字、次级文字、强调色、状态色、圆角和阴影
- **AND** 主要页面和通用组件使用这些 token，而不是为同类视觉属性重复散写硬编码值

#### Scenario: Existing shared classes remain coherent

- **WHEN** 页面使用 `surface`、`surface-strong`、`text-muted`、`text-faint` 或 `prose-workspace`
- **THEN** 这些类 MUST 呈现统一的现代博客视觉语言
- **AND** 它们在首页、列表页、详情页、工具页、链接页、留言页和私密区之间保持一致

### Requirement: Light and dark mode compatibility

系统 MUST 同时提供浅色和暗色视觉 token，并在未实现手动主题切换时尊重用户系统主题。

#### Scenario: System light theme

- **WHEN** 用户系统偏好为浅色
- **THEN** 页面 MUST 使用浅色背景、浅色表面、深色正文和低对比柔和边框
- **AND** 链接、按钮、标签、卡片和表单控件 MUST 保持可读且层级清晰

#### Scenario: System dark theme

- **WHEN** 用户系统偏好为暗色
- **THEN** 页面 MUST 使用暗色背景、暗色表面、浅色正文和低对比柔和边框
- **AND** 页面 MUST 避免大面积霓虹、强发光和高饱和赛博朋克效果

### Requirement: Consistent surfaces and cards

系统 MUST 使用统一的表面、卡片、边框、圆角和阴影规则表达信息层级。

#### Scenario: Repeated card components

- **WHEN** 页面展示文章卡片、链接卡片、工具卡片、留言卡片或私密内容卡片
- **THEN** 卡片 MUST 使用一致的圆角、边框、背景和 hover 反馈
- **AND** 卡片之间 MUST 通过尺寸、留白和内容层级区分主次，而不是依赖大量不同颜色

#### Scenario: No nested decorative card clutter

- **WHEN** 页面包含多个内容区域
- **THEN** 系统 MUST 避免无必要的卡片套卡片
- **AND** 页面区块 MUST 使用清晰的网格、留白或分隔线建立结构

### Requirement: Restrained interaction feedback

系统 MUST 为导航、卡片、按钮、输入框和链接提供适度 hover、focus 和 transition 反馈。

#### Scenario: Hover feedback

- **WHEN** 用户悬停在可点击卡片、导航项、按钮或链接上
- **THEN** 元素 MUST 提供轻微且一致的视觉反馈
- **AND** 反馈 MUST 限制在边框、背景、阴影、文字色或小幅位移变化

#### Scenario: Focus feedback

- **WHEN** 用户通过键盘聚焦链接、按钮、输入框或文本域
- **THEN** 元素 MUST 显示清晰的 focus 样式
- **AND** focus 样式 MUST 在浅色和暗色主题下都可见

### Requirement: Typography hierarchy

系统 MUST 建立清晰的文字层级，用于 Hero、页面标题、卡片标题、正文、辅助信息和代码文本。

#### Scenario: Page typography scale

- **WHEN** 用户浏览首页、列表页和详情页
- **THEN** Hero 标题、页面标题、卡片标题、正文和元信息 MUST 呈现明确的大小与权重层级
- **AND** 字体大小 MUST 不依赖视口宽度做不可控缩放

#### Scenario: Chinese and English content

- **WHEN** 用户切换中文或英文内容
- **THEN** 页面 MUST 保持良好的字距、行高和阅读节奏
- **AND** 中文和英文内容 MUST 使用同一套层级规则，不通过混乱字体堆叠制造视觉差异
