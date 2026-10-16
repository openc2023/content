# STUDIO 7 内容资源

当前正式图形为 **C / SPLIT**。域名配置保持 `img.7studio.org`，`CNAME` 不变。

## 推荐引用

| 用途 | 路径 |
| --- | --- |
| 浅色背景黑标（t 镂空） | `/logo/studio7.svg` |
| 深色背景白标（t 镂空） | `/logo/studio7-white.svg` |
| 黑圆 + 实体白色 t | `/logo/studio7-full.svg` |
| 白圆 + 实体黑色 t | `/logo/studio7-full-reverse.svg` |
| 单独 t（原白色部分） | `/logo/studio7-t.svg` |
| 单独白色 t | `/logo/studio7-t-white.svg` |

以上路径也提供同名 `.png`。全套 18 款 SVG 位于 `logo/studio7-c/svg/`，对应 PNG 位于 `logo/studio7-c/png/`；图标 PNG 为 1024 × 1024，横向组合为 1800 × 1024。原生可编辑文件为 `logo/studio7-c/source/studio7-c.ai`。

`index.html` 首页直接展示全部 18 款标志及 SVG / PNG 下载入口；`test.html` 保留同样的资源预览。

## 历史与兼容

旧 Logo 的 9 个文件以及首页、测试页原件，按原始字节保存在 `archive/legacy-pre-c/`，不直接删除。原有 `/logo/7logo*.svg`、`.png` 与 `/logo/7logo.ai` 地址继续保留，但内容更新为 C 版。带 `blue` 的旧名称仅作兼容，现在同样是黑色 C 标志。仓库外部的链接使用情况无法仅由本仓库确认，因此保留这些地址以避免 404。

新页面应使用上面的语义化路径。需要固定某一版、避免 CDN 或浏览器继续读取旧图时，可引用版本目录或在 URL 后加 `?v=c-split-20261016`。原有外部链接可能需要等待缓存刷新。

| 同名 SVG / PNG 别名 | 全套版本名 |
| --- | --- |
| `studio7` | `05-split-black-transparent` |
| `studio7-white` | `06-split-white-transparent` |
| `studio7-full` | `01-full-positive-transparent` |
| `studio7-full-reverse` | `02-full-reverse-transparent` |
| `studio7-t` | `09-t-black-transparent` |
| `studio7-t-white` | `10-t-white-transparent` |
| `7logo` | `05-split-black-transparent` |
| `7logo-new` | `05-split-black-transparent` |
| `7logo-2-01` | `05-split-black-transparent` |
| `7logo-blue` | `05-split-black-transparent` |
| `7logo-blue-1` | `05-split-black-transparent` |
| `7logo-new-01` | `05-split-black-transparent` |
