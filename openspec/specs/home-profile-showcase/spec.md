## Purpose

定义首页欢迎栏下方公开个人展示区的内容结构、展示方式、双语安全区和社交入口行为。

## Requirements

### Requirement: Homepage profile showcase is displayed below the hero

系统 SHALL 在首页欢迎栏下方展示一个公开的个人展示区，用于帮助访客先认识站点主人，再理解站点用途。

#### Scenario: Visitor opens the homepage
- **WHEN** 访客打开首页
- **THEN** 系统 SHALL 在欢迎栏下方展示个人展示区
- **AND** 个人展示区 SHALL 不替代现有欢迎栏
- **AND** 个人展示区 SHALL 作为首页公开内容的一部分直接可见

### Requirement: Profile showcase includes identity and spotlight sections

个人展示区 SHALL 使用简洁名片型布局，并至少包含身份名片块和展示信息块两个部分。

#### Scenario: Visitor reads the profile showcase
- **WHEN** 访客浏览个人展示区
- **THEN** 系统 SHALL 展示身份名片块
- **AND** 身份名片块 SHALL 包含插画占位、昵称、英文代号、一句话介绍、职业、地点、工作方式技能和社交链接
- **AND** 系统 SHALL 展示展示信息块
- **AND** 展示信息块 SHALL 包含 1 个固定重点项目、正在做的事和兴趣方向

### Requirement: Profile showcase uses the confirmed content model

系统 SHALL 支持当前已确认的个人展示字段结构，并允许中英文文案分别定义。

#### Scenario: Content is prepared for public display
- **WHEN** 系统读取个人展示区内容
- **THEN** 系统 SHALL 支持昵称 `yin` 和英文代号 `crumbs`
- **AND** 系统 SHALL 支持职业、地点、介绍文案、技能列表、社交链接、重点项目、正在做的事和兴趣方向的双语字段
- **AND** 地点 SHALL 支持以“国家 / 城市”的形式显示

### Requirement: Spotlight content reflects the owner context

系统 SHALL 支持将重点项目和长期方向作为公开展示内容的一部分。

#### Scenario: Visitor views spotlight content
- **WHEN** 访客查看展示信息块
- **THEN** 系统 SHALL 展示 1 个固定重点项目
- **AND** 重点项目 SHALL 至少包含项目名和一句话介绍
- **AND** 系统 SHALL 在重点项目下方展示“正在做的事”列表
- **AND** 系统 SHALL 支持展示“开发 agent”“正在完成这个 daily-eat 项目”“尝试开发一款自研产品”等长期方向内容

### Requirement: Social links are text-based navigation

系统 SHALL 使用文字链接展示个人社交入口，并链接到外部目标。

#### Scenario: Visitor interacts with social links
- **WHEN** 访客查看身份名片块中的社交区域
- **THEN** 系统 SHALL 以文字形式展示 GitHub、X 和 Email 链接
- **AND** 每个文字链接 SHALL 具有可点击的跳转目标
- **AND** 文字链接 SHALL 保持当前站点克制黑白的视觉风格

### Requirement: Bilingual layout remains within a safe presentation range

系统 SHALL 为个人展示区的双语内容提供稳定的结构和布局安全区，避免因文案长度差异导致布局失衡。

#### Scenario: User switches between Chinese and English
- **WHEN** 用户切换中文或英文
- **THEN** 系统 SHALL 使用同一套个人展示区结构渲染两种语言
- **AND** 一句话介绍、技能、重点项目介绍、正在做的事和兴趣方向 SHALL 保持在适合卡片展示的有限长度与数量范围内
- **AND** 页面 SHALL 避免因为中英文长度差异造成文本溢出、主要信息遮挡或卡片重叠
