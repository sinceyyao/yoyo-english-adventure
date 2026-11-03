# Yoyo's English Adventure

面向5～6岁儿童的英语启蒙 H5/PWA。当前代码基线 **Sky Explorer V1.0**，本地已完成V1.1实现，待真实设备与发布验收，主题为 Wonders GK Unit 8 Week 3。第一阶段供 Yoyo 家庭使用。

## 文档导航

- [PRODUCT.md](PRODUCT.md)：产品目标、已实现功能、数据结构和问题分析。
- [ROADMAP.md](ROADMAP.md)：版本规划、模块化建议和验收标准。

基线分析日期：2026-11-03。当前开发分支：`feature/sky-ui-v1.1`。V1.1已落地基础存储保护、语音服务、自动读题/手动重播、错误不揭示答案、第三关完整句子及PWA更新机制；20张原创插画和六个页面的统一视觉已完成本地实现与回归。真实iPhone与线上发布仍待验收。没有推送、合并或部署。V1.0历史行为见PRODUCT.md；本轮证据见[artifacts/VERIFICATION.md](artifacts/VERIFICATION.md)。

## 技术与文件结构

无需 npm、构建步骤、第三方框架或后端。使用原生 HTML/CSS/JavaScript、Web Speech API、localStorage 和 Service Worker。

```text
index.html             页面入口与服务状态区域
styles/app.css         原有样式、共享变量与服务反馈
src/app.js             词表、题库、状态、渲染及事件委托
assets/illustrations/  20张独立原创透明WebP词图
src/services/          存储、语音与PWA更新服务
assets/icons/          安装图标
tests/regression.cjs   Node逻辑回归（不依赖第三方包）
manifest.webmanifest   PWA 名称、入口、作用域、显示方式和图标声明
sw.js                  预缓存、同源 GET 的缓存优先响应
icon.svg               512×512 SVG 应用图标
README.md              运行、测试、部署说明
PRODUCT.md             产品与代码现状
ROADMAP.md             迭代与技术改造建议
```

`src/app.js` 的主要调用关系：启动读取存储 → `render()`；`go()` 切换视图；`setFilter()` / `moveWord()` 操作词卡；`startQuiz()` → `choose()` → `nextQuestion()` 完成 Quiz；`save()` 写入记录；`speak()` 调用设备语音。视图由字符串状态管理，无 URL 路由。

## 本地运行与预览

需要 Python 3。在仓库根目录执行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>；按 `Ctrl+C` 停止。端口被占用时换用 8001。建议固定地址和端口，以免看到另一份学习记录。

无需 `npm install` 或 `npm run dev`。直接双击 HTML 不适合作为 PWA 验收方式。

手机同一 Wi-Fi 预览可用 `python3 -m http.server 8000 --bind 0.0.0.0`，访问电脑局域网 IP 的 8000 端口；仅在可信网络临时使用。该 HTTP 方式适合页面检查，不能验证当前代码的 Service Worker。

**本地PWA：**现改为安全上下文注册，HTTP localhost/127.0.0.1可检查SW；局域网HTTP不适用。真实安装、设备语音及线上HTTPS仍需分别验收。

逻辑回归需Node18+：`node tests/regression.cjs`。项目运行不依赖Node。本环境系统默认Node过旧时需使用现代Node。没有npm依赖或构建任务。

## 手动测试清单

使用独立测试浏览器配置，避免影响家庭真实记录。

| 场景 | 操作与当前预期 |
| --- | --- |
| 首页 | 显示 Sky Explorer、4个功能入口、已完成 Quiz 次数 |
| 词卡 | Core 8张、More 12张；组内上一张/下一张循环；首次展示即记为 explored |
| 发音 | 单词、例句、题干均可点播；答对自动读例句；在真实设备检查首播、连点、中英文系统及静音状态 |
| Quiz | 固定12题、每题4选1；未答对不能下一题；错误可重试；答对后锁定 |
| 计分 | 全部首次答对得12/12；一题先错后对得11/12；全部完成才增加一次 session |
| 错词 | 同题错选两次使目标词 misses 增加2；复习按累计次数降序；答对不消除错词 |
| 持久化 | 刷新后保留已展示词、累计错误和已完成成绩；未完成 Quiz 状态不恢复 |
| 进度 | 总场次、四舍五入平均分、最高分、最近5场（仅日期）与记录一致 |
| 布局 | 检查320/375/520px宽度、横屏、安全区和长单词，确认可点按、可滚动 |
| PWA（HTTPS） | 检查 Manifest/SW、安装图标、首次联网后离线访问、升级后是否显示新版本 |

浏览器开发者工具的 Console 用于检查异常，Application 面板用于检查 Local Storage、Manifest、Service Workers 和 Cache Storage。当前没有测试框架或CI；新增的 `tests/regression.cjs` 使用Node内置assert/vm，检查逻辑和SW桩行为。

排查旧页面时，可在**测试环境**注销 SW 并单独删除本项目 Cache Storage，再联网重载；不要随意点击清除全部站点数据，这会同时删除学习记录。升级验证必须包含正常已有缓存的用户路径，不能只测清缓存后的页面。

## GitHub Pages 与 PWA 检查

仓库远程地址：<https://github.com/sinceyyao/yoyo-english-adventure>，基线分支为 `main`，当前开发分支为 `feature/sky-ui-v1.1`。根目录存在 `index.html`，资源均使用相对路径，适合部署在 `/yoyo-english-adventure/` 子路径，无需服务器路由回退。

部署步骤：GitHub 仓库 Settings → Pages → Deploy from a branch → 选择已包含代码的 `main` 分支及 `/ (root)`，保存并查看部署状态。具体可用性取决于仓库可见性和账户权限。当前没有 `.github/workflows` 或 `CNAME`；**仅从克隆代码无法确认远端 Pages 是否启用、部署是否成功或是否使用自定义域名**。本轮未修改远端设置，也未发布。

默认项目站点的预期地址为 <https://sinceyyao.github.io/yoyo-english-adventure/>，这不是已经验证可用的线上地址。部署后确认入口、`sw.js`、Manifest、图标均返回成功，并在 Application 面板检查实际 MIME、作用域和控制状态。

| 配置 | 代码检查结果与限制 |
| --- | --- |
| 相对路径 | Manifest `start_url: ./index.html`、`scope: ./`、图标与 SW 相对引用兼容项目子路径 |
| SW 作用域 | 注册根目录sw.js；安全上下文可用；限制同项目子路径；失败显示在线学习提示 |
| 离线资源 | 预缓存入口、样式、3个服务、应用脚本、Manifest、图标和20张词图；语音离线取决于设备 |
| 更新 | 项目版本缓存，只查当前版本；激活清理本项旧缓存；不得删除localStorage或其他应用缓存 |
| 生命周期 | 新版本等待接受，Quiz中阻止更新操作；从V1.0首次升级，旧页面没有更新提示，需关闭本项目所有旧标签/独立窗口后重开，让等待的SW激活，不需要清学习数据 |
| 安装图标 | 192/512 PNG、独立maskable及Apple touch icon已生成；真实设备裁切仍待验收 |

不能据此宣称“所有设备可安装、完全离线或更新可靠”。后续应补齐图标、修正更新策略，再分别验收 iPhone Safari、iPad Safari 和 Android Chrome。

## 当前验证范围

`node tests/regression.cjs`：14组逻辑回归通过，覆盖词序、答案映射、20词浏览、12/12及11/12计分、完成一次、防误泄答案、存储备份保护、语音队列与SW作用域/升级桩测试。

内置桌面浏览器375×667：实际通关12题，先错后对为11/12和92%；自动播放出现开始状态、重试不揭示答案。截图和后续核对结果见[验证记录](artifacts/VERIFICATION.md)。不能据此宣称已通过真实iPhone、安装或线上部署验证。

## 参考资料

- [GitHub：创建 Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [MDN：Service Worker 使用与缓存生命周期](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [MDN：PWA 安装条件](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN：SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

## V1.1视觉阶段验证

20张独立透明WebP词图共691,200字节，六个页面视觉已统一。在本地项目子路径完成20词逐张加载及播放入口检查、12题两轮通关（11/12和12/12）、320/375/390px检查、刷新保留记录、接受更新及停服后离线重载。真实iPhone与线上Pages发布仍待验收。详细证据见[验证记录](artifacts/VERIFICATION.md)。

正常预览仍为 <http://127.0.0.1:8000/>。若显示旧版，在Quiz之外接受“Update now”；不要清除学习记录。8002端口只是离线测试服务，已主动停止。
