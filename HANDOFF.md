# LYT UI 验收交接

作者：Tony Liu。项目／skill：`lyt-ui`。当前版本由 `package.json` 定义，为 `0.1.0`。正式 README 明确留给后续 AI 验收者，本次没有编写或自动生成。

## 仓库与版本定位

- 公开仓库：https://github.com/LYT259/lyt-ui
- 本次交付提交由 Git 标签 [`v0.1.0`](https://github.com/LYT259/lyt-ui/tree/v0.1.0) 固定；`git rev-parse v0.1.0^{commit}` 返回完整提交标识。最终回复另附完整哈希，避免在提交自身内容中嵌入自身哈希。
- `npm run build` 从当前 Git 提交生成构建标识；有未提交文件时加 `-dirty`，没有 Git 信息时明确为 `unknown`。

## 结构与入口

| 位置 | 内容 |
| --- | --- |
| [skills/lyt-ui/SKILL.md](skills/lyt-ui/SKILL.md) | skill 入口、执行流程与按需引用 |
| `skills/lyt-ui/references/` | 视觉、控件、设置、版本、国际化、平台、验证及来源 |
| [tokens.json](skills/lyt-ui/assets/tokens.json) | 与框架无关的主题令牌；默认 lyt、小幅定制 sage |
| `skills/lyt-ui/assets/web/` | 可选的原生 HTML/CSS/JS 基础，不是全平台组件库 |
| `demo/` | 虚构工作空间 Stillroom 的设置、语言、关于、控件展示 |
| `trial/` | 虚构书单 Shelf 的需求与独立实现 |
| `scripts/`、`tests/` | 构建、静态服务、验证、对比度报告、试用组装 |
| `evidence/` | 数值结果、浏览器检查、截图与观察记录 |
| `dist/` | 构建生成的网页与完整 skill；不进入 Git |

## 运行与验证

需要 Node.js 22 或以上；没有第三方运行依赖，不需要先安装 npm 包。以下命令均从仓库根目录执行：

```sh
npm run verify
node scripts/contrast-report.mjs
npm run build
npm run dev
```

网页入口为 `http://127.0.0.1:4173`。开发服务仅监听本机。修改源码后重新构建并刷新；当前没有热更新。`dist/` 可交给普通静态托管服务，本次发布的是源码仓库，没有配置公开在线演示站。

浏览器布局检查在演示网页的 JavaScript 执行环境中分三次运行，避免一次大批量导致浏览器超时：

```js
await (await import('./checks/browser-check.mjs')).run({widths:[1280]})
await (await import('./checks/browser-check.mjs')).run({widths:[390]})
await (await import('./checks/browser-check.mjs')).run({widths:[320]})
```

每次返回真实检查结果；出现 `error` 或任一 `pass:false` 就不能算通过。该脚本通过 DOM 驱动交互，不替代真实键盘操作。

独立目录试用：

```sh
npm run trial
```

进入输出的临时目录，执行 `PORT=4174 node serve.mjs .`，访问 `http://127.0.0.1:4174`。具体操作见 [试用记录](evidence/trial.md)。这是实现者自试用，不是独立模型盲测。

## 安装与使用 skill

构建后复制整个 `dist/skill/`，将目标文件夹命名为 `lyt-ui`，放入目标 AI 工具支持的 skill 目录。保留 `SKILL.md`、`references/`、`assets/`、`LICENSE`、生成的 `VERSION.json`。不只复制入口文件。源码目录 `skills/lyt-ui/` 包含全部设计与实现资源；可移植发布副本另外带生成的版本信息。

在支持 skill 调用的工具中使用 `$lyt-ui`，或者明确要求 AI 阅读复制后的 `lyt-ui/SKILL.md`。例如：“使用 lyt-ui，为我的书单应用实现设置页；保留现有数据逻辑，支持中英文、深浅主题与手机布局。”未修改用户全局配置，没有安装到其他工具。

## 来源与取舍

只读参考 PathBlender 源码快照 `f3e1f40c2c0c053be4a2addf4581ee73a6150cd5` 和早期规范快照 `7fed540`。逐项来源见 [provenance.md](skills/lyt-ui/references/provenance.md)，运行界面观察见 [source-observations.md](evidence/source-observations.md)。当时运行的是已有本地分发包，不能证明它与所读源码完全一致。

保留已存在的中性层次、主题／强调色分离、语言搜索和版本集中管理思路。旧规范提出即时语言切换，但所读 PreferencesPanel 与所看界面实际需要保存；两者没有混为一谈。

新增决定包括更舒展的间距、重新验证的配色、机器可读令牌、sage、即时外观／语言设置与独立表单草稿、移动端选择器、平台能力边界。FRC 概念、PathBlender 品牌／资产／存储键／更新地址均未进入默认资源。

## 已完成验证

| 验证 | 结果与证据 |
| --- | --- |
| 自动测试 | 16 项通过；主题／语义色隔离、对比度、存储异常、系统模式、语言回退、搜索、翻译键与复数；见 `tests/` |
| 对比度报告 | 44 组展示配色通过，测试覆盖更多状态；见 [contrast.json](evidence/contrast.json) |
| 包装核对 | 相对引用、资源可携带性、许可证一致性、私有路径／常见凭证模式与无正式 README；`npm run verify` 可重跑，模式扫描不等于完整泄密审计 |
| skill 格式 | skill-creator 的结构验证通过；该外部验证器不属于本项目运行依赖 |
| Stillroom 浏览器矩阵 | 3 宽度 × 4 语言场景 × 2 深浅主题 × 2 预设 × 5 面板，共 240 组布局；附带共 102 项检查均通过；见 [browser.json](evidence/browser.json) |
| 草稿与交互 | 主题／语言切换保留草稿、选择器焦点返回、IME 防误提交、重置、存储重载、模拟加载／错误恢复；见浏览器结果 |
| 实际键盘路径 | 搜索中文、ArrowDown、Enter 选择，关闭后焦点回到入口且草稿保留；见 [keyboard.md](evidence/keyboard.md) |
| 文字放大 | 390 px 下长文本场景的 200% 根字体放大通过；不等于浏览器真实缩放或系统文字放大测试 |
| Shelf 运行 | 独立临时目录实际运行，14 项检查通过；见 [trial.json](evidence/trial.json) 与 [trial.md](evidence/trial.md) |
| 截图 | [桌面深色中文](evidence/desktop-dark-zh.png)、[窄屏 RTL 语言选择](evidence/mobile-web-rtl.png) |

## 支持范围与已知限制

Web 有规范、参考实现及 Chromium 实测。桌面宿主、iOS、Android 有适配规范，没有原生组件实现或实际运行验证。网页窄屏不能作为原生 App 验证。

未完成：Safari／Firefox、读屏、实体触控、真实软键盘遮挡、安全区域、系统强制颜色／减少动态效果、浏览器真实 200%／400% 缩放，以及完整键盘路径审计。已有对应实现或规范，不代表上述测试已通过。中文、英文与阿拉伯文没有专业人工语言审核；阿拉伯文明确作为预览，长文本为伪本地化。

Stillroom 与其 `1.2.0-beta.1` 产品版本均为虚构，与 LYT UI 的 `0.1.0` 分开。示例笔记与模拟加载不是后端服务；Stillroom 的工作空间名和偏好持久化，控件示例笔记仅在页面会话内保留。Shelf 书单保存在本地。没有虚构检查更新服务，也没有配置原生图标切换能力。

## 许可与后续验收

原创内容使用 MIT，版权为 2026 Tony Liu；完整许可证见 [LICENSE](LICENSE)，skill 内附相同副本。PathBlender 声明 Apache-2.0，本项目没有复制其源码、翻译、图标或媒体，没有将上游许可改标 MIT。使用系统字体而不分发字体文件；无第三方运行包或远程资产。

后续验收建议从本文件、skill 入口、来源取舍、令牌、浏览器证据与试用记录开始，再实际运行两个示例。正式 README 由后续验收者在核对支持范围和限制后编写。
