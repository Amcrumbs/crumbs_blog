## ADDED Requirements

### Requirement: Profile showcase content is stored in a local JSON file

系统 SHALL 使用单独的本地 JSON 文件作为首页个人展示区的唯一内容源。

#### Scenario: Homepage and private editor read the same source
- **WHEN** 首页展示区或私密区编辑面板读取个人展示数据
- **THEN** 两者 SHALL 使用同一份本地 JSON 文件
- **AND** 该文件 SHALL 独立于现有 notes、logs 和 private-logs 内容目录

### Requirement: Private editor is available only after private access is unlocked

系统 SHALL 仅在私密区已解锁时展示个人展示区编辑面板。

#### Scenario: Visitor has not unlocked private access
- **WHEN** 用户尚未通过私密区密码验证
- **THEN** 系统 SHALL 不展示个人展示区编辑面板
- **AND** 系统 SHALL 不暴露编辑入口或保存能力

#### Scenario: Owner has unlocked private access
- **WHEN** 用户已通过私密区密码验证并进入私密区
- **THEN** 系统 SHALL 展示个人展示区编辑面板
- **AND** 编辑面板 SHALL 与现有私密日志和私有链接区域并存

### Requirement: Private editor uses a structured content panel

系统 SHALL 在私密区提供一个小型内容面板，用于按分组编辑个人展示区内容。

#### Scenario: Owner edits homepage showcase content
- **WHEN** 所有者打开个人展示区编辑面板
- **THEN** 系统 SHALL 提供身份信息、重点项目、正在做的事、兴趣方向和社交链接等分组字段
- **AND** 身份信息分组 SHALL 支持编辑昵称、英文代号、一句话介绍、职业、地点、技能和插画占位信息
- **AND** 重点项目分组 SHALL 支持编辑固定项目名称和一句话介绍

### Requirement: Editor preserves bilingual field structure

系统 SHALL 在编辑时保持中英文字段成对存在，并允许分别填写文案。

#### Scenario: Owner edits bilingual content
- **WHEN** 所有者修改介绍文案、重点项目介绍或其他双语字段
- **THEN** 系统 SHALL 提供中文和英文输入位置
- **AND** 保存结果 SHALL 保持同一字段结构下的 `zh` 与 `en` 内容
- **AND** 系统 SHALL 不依赖运行时自动翻译生成另一种语言内容

### Requirement: Saving updates the local JSON source

系统 SHALL 在保存编辑结果后更新本地 JSON 文件，并使首页展示区能够读取最新内容。

#### Scenario: Owner saves edited showcase content
- **WHEN** 所有者在私密区提交个人展示区编辑表单
- **THEN** 系统 SHALL 将更新后的内容写回本地 JSON 文件
- **AND** 随后渲染的首页 SHALL 读取并显示最新保存的数据
- **AND** 保存过程 SHALL 保持 JSON 结构完整，不写入猜测字段或无定义字段
