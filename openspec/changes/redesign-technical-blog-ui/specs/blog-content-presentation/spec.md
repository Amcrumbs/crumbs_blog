## ADDED Requirements

### Requirement: Editorial bento homepage

首页 MUST 使用 Editorial + Bento Grid 的布局呈现站点定位、内容入口和近期内容，并保持现有导航目标不变。

#### Scenario: Homepage hero communicates the site

- **WHEN** 用户打开首页
- **THEN** 首页首屏 MUST 展示具有设计感的 Hero 区域
- **AND** Hero MUST 包含站点核心标题、简短说明和主要内容入口
- **AND** Hero MUST 不表现为营销落地页或纯装饰首屏

#### Scenario: Homepage bento modules organize content

- **WHEN** 用户浏览首页首屏和首屏下方内容
- **THEN** 首页 MUST 以 bento grid 方式组织 notes、logs、tools、links、guestbook、近期内容或快捷入口
- **AND** 每个模块 MUST 有清晰标题、简短描述或内容摘要
- **AND** 模块链接 MUST 指向现有路由

#### Scenario: Homepage remains responsive

- **WHEN** 用户在移动端、平板或桌面宽度打开首页
- **THEN** 首页布局 MUST 保持内容可读、卡片不重叠、文本不溢出
- **AND** 首页 MUST 避免依赖绝对定位节点图作为主要信息结构

### Requirement: Modern article cards

文章列表页 MUST 使用现代、克制、可扫描的文章卡片展示公开笔记、公开日志和私密日志。

#### Scenario: Public notes list

- **WHEN** 用户打开 notes 列表页
- **THEN** 页面 MUST 使用现代卡片布局展示每篇笔记的标题、日期、摘要和标签
- **AND** 卡片 MUST 能清晰表达可点击状态并链接到现有笔记详情路由

#### Scenario: Public logs list

- **WHEN** 用户打开 logs 列表页
- **THEN** 页面 MUST 使用适合时间线或连续记录阅读的卡片布局展示日志
- **AND** 卡片 MUST 保持与 notes 卡片一致的视觉语言

#### Scenario: Private logs list

- **WHEN** 用户已解锁私密区并查看私密日志列表
- **THEN** 私密日志卡片 MUST 复用同一文章卡片规则
- **AND** 私密内容入口 MUST 保持现有访问控制，不向未解锁用户暴露私密日志详情

### Requirement: Readable article detail pages

文章详情页 MUST 优化长文阅读体验，并以正文内容为视觉中心。

#### Scenario: Article header

- **WHEN** 用户打开任意公开笔记、公开日志或已解锁私密日志详情页
- **THEN** 页面 MUST 展示清晰的文章标题、日期、摘要和可选标签
- **AND** 标题区 MUST 使用 editorial 排版，不被厚重面板样式压住

#### Scenario: Article body rhythm

- **WHEN** 用户阅读文章正文
- **THEN** 正文 MUST 使用适合长文阅读的最大宽度、字号、行高和段落间距
- **AND** 标题、段落、列表、引用、链接、行内代码和代码块 MUST 具有一致且可读的样式

#### Scenario: Article body theme compatibility

- **WHEN** 用户在浅色或暗色系统主题下阅读文章
- **THEN** 正文内容、代码、引用、链接和分隔元素 MUST 保持足够对比度
- **AND** 页面 MUST 不依赖单一暗色背景才能阅读

### Requirement: Existing blog behavior is preserved

视觉改造 MUST 不改变现有博客内容结构、路由、语言切换和公开/私密访问规则。

#### Scenario: Existing routes still work

- **WHEN** 用户访问首页、notes、logs、tools、links、guestbook、private 或各详情页
- **THEN** 路由 MUST 保持当前路径结构
- **AND** 链接目标 MUST 不因为视觉改造而改变

#### Scenario: Existing content loading still works

- **WHEN** 系统读取 `content/<locale>/notes`、`content/<locale>/logs` 或 `content/<locale>/private-logs`
- **THEN** 内容读取规则、slug 规则、frontmatter 校验和排序逻辑 MUST 保持不变

#### Scenario: Existing language behavior still works

- **WHEN** 用户切换中文或英文
- **THEN** 页面 MUST 继续使用当前语言 cookie 和字典读取机制
- **AND** 视觉改造 MUST 不引入新的语言路由结构
