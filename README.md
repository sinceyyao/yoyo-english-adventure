# Yoyo's English Adventure

面向5～6岁儿童的英语启蒙 H5/PWA。当前版本 **Sky Explorer V1.0**，主题为 Wonders GK Unit 8 Week 3。第一阶段供 Yoyo 家庭使用。

## 文档导航

- [PRODUCT.md](PRODUCT.md)：产品目标、已实现功能、数据结构和问题分析。
- [ROADMAP.md](ROADMAP.md)：版本规划、模块化建议和验收标准。

本轮基线分析日期：2026-11-03。结论以仓库代码为准；路线图中的功能尚未实现。

## 技术与文件结构

无需 npm、构建步骤、第三方框架或后端。使用原生 HTML/CSS/JavaScript、Web Speech API、localStorage 和 Service Worker。

```text
index.html             页面、全部样式、词表、题库、状态、渲染及交互
manifest.webmanifest   PWA 名称、入口、作用域、显示方式和图标声明
sw.js                  预缓存、同源 GET 的缓存优先响应
icon.svg               512×512 SVG 应用图标
README.md              运行、测试、部署说明
PRODUCT.md             产品与代码现状
ROADMAP.md             迭代与技术改造建议
```

`index.html` 的主要调用关系：启动读取存储 → `render()`；`go()` 切换视图；`setFilter()` / `moveWord()` 操作词卡；`startQuiz()` → `choose()` → `nextQuestion()` 完成 Quiz；`save()` 写入记录；`speak()` 调用设备语音。视图由字符串状态管理，无 URL 路由。

## 本地运行与预览

需要 Python 3。在仓库根目录执行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>；按 `Ctrl+C` 停止。端口被占用时换用 8001。建议固定地址和端口，以免看到另一份学习记录。

无需 `npm install` 或 `npm run dev`。直接双击 HTML 不适合作为 PWA 验收方式。

手机同一 Wi-Fi 预览可用 `python3 -m http.server 8000 --bind 0.0.0.0`，访问电脑局域网 IP 的 8000 端口；仅在可信网络临时使用。该 HTTP 方式适合页面检查，不能验证当前代码的 Service Worker。

**本地 PWA 限制：**浏览器允许 localhost 作为 Service Worker 安全上下文，但当前业务代码额外判断 `location.protocol === 'https:'`，所以普通 HTTP localhost 不会注册 SW。完整离线、安装和更新验收需要 HTTPS 测试站点或本地可信 HTTPS 服务。本轮未改变这一条件。

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

浏览器开发者工具的 Console 用于检查异常，Application 面板用于检查 Local Storage、Manifest、Service Workers 和 Cache Storage。当前没有测试框架、CI 或仓库内自动化测试脚本。

排查旧页面时，可在**测试环境**注销 SW 并单独删除本项目 Cache Storage，再联网重载；不要随意点击清除全部站点数据，这会同时删除学习记录。升级验证必须包含正常已有缓存的用户路径，不能只测清缓存后的页面。

## GitHub Pages 与 PWA 检查

仓库远程地址：<https://github.com/sinceyyao/yoyo-english-adventure>，本地当前分支为 `main`。根目录存在 `index.html`，资源均使用相对路径，适合部署在 `/yoyo-english-adventure/` 子路径，无需服务器路由回退。

部署步骤：GitHub 仓库 Settings → Pages → Deploy from a branch → 选择已包含代码的 `main` 分支及 `/ (root)`，保存并查看部署状态。具体可用性取决于仓库可见性和账户权限。当前没有 `.github/workflows` 或 `CNAME`；**仅从克隆代码无法确认远端 Pages 是否启用、部署是否成功或是否使用自定义域名**。本轮未修改远端设置，也未发布。

默认项目站点的预期地址为 <https://sinceyyao.github.io/yoyo-english-adventure/>，这不是已经验证可用的线上地址。部署后确认入口、`sw.js`、Manifest、图标均返回成功，并在 Application 面板检查实际 MIME、作用域和控制状态。

| 配置 | 代码检查结果与限制 |
| --- | --- |
| 相对路径 | Manifest `start_url: ./index.html`、`scope: ./`、图标与 SW 相对引用兼容项目子路径 |
| SW 作用域 | `sw.js` 位于项目根目录，默认控制该目录及子路径；HTTPS 才尝试注册；失败被静默忽略 |
| 离线资源 | 安装时缓存 `./`、`./index.html`、Manifest、SVG；需要先联网安装成功；语音是否离线取决于设备语音包 |
| 更新 | 固定 `yoyo-sky-v1` + cache-first；只改 HTML 可能一直展示旧版；改缓存名但不清旧缓存也不充分，当前 `caches.match` 会跨缓存查找 |
| 生命周期 | 有 `skipWaiting()` 和 `clients.claim()`，没有旧缓存清理、更新提示或网络失败兜底；未命中缓存的请求不会自动缓存 |
| 安装图标 | 仅 SVG `sizes: any`、`purpose: any maskable`；缺少明确192/512 PNG及 Apple touch icon，跨设备安装效果尚待实测 |

不能据此宣称“所有设备可安装、完全离线或更新可靠”。后续应补齐图标、修正更新策略，再分别验收 iPhone Safari、iPad Safari 和 Android Chrome。

## 本轮验证范围

已阅读所有5个原始文件；用临时 Node VM 桩验证脚本语法、20词/12题、词卡记录、重复错选、首次正确计分、完成后保存、重新读取、进度/复习渲染、无效 JSON 回退，并检查 Manifest 引用的文件存在。复现了存储内容为合法 JSON `{}` 时启动异常。

这属于逻辑冒烟检查，不等同于真实浏览器、语音、视觉、安装、离线或线上部署测试；上述设备验收仍待执行。系统默认 Node 版本较旧，临时检查改用环境提供的现代 Node；项目运行本身不依赖 Node。

## 参考资料

- [GitHub：创建 Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [MDN：Service Worker 使用与缓存生命周期](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [MDN：PWA 安装条件](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN：SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
