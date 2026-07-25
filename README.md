# Clash Override

> 由 AI 辅助开发（Claude Code + Antigravity AI + AIsouler/MyClash 参考）

Mihomo（Clash Meta）高性能覆写脚本与配置文件，无 DNS 泄露、`url-test` 自动测速、倍率过滤、IP 规则兜底、PCDN 拦截，并全面支持国内双栈与 IPv6 细粒度控制。

友情推荐，非常好用、省电且内存占用低的代理软件：[Bettbox](https://github.com/appshubcc/Bettbox)

## 覆写脚本

> **注意：该脚本仅适用于覆写机场提供的配置文件，请勿用于覆写自己编写的配置文件**

复制以下链接导入到 Bettbox 的远程覆写中：

```txt
https://raw.githubusercontent.com/JesseHug/clash-override/master/override.js
```

## 配置文件

复制以下链接或下载完整代码后直接作为 Mihomo 主配置文件使用（替换 `proxy-providers` 中的订阅 URL）：

```txt
https://raw.githubusercontent.com/JesseHug/clash-override/master/config.yaml
```

## 配置和脚本说明

- ✅ **现代 JS 语法 (ES2020)** — 脚本采用最前沿的 ES2020 语法架构（如可选链 `?.` 与空值合并 `??`），并经过严格的 QuickJS 引擎兼容性测试。
- ✅ **全面拥抱 IPv6 与双栈网络** — 底层开启 `ipv6: true`，构建独立的“直连”策略组，内置“IPv4 优先”、“IPv6 优先”及“双栈”直连节点，实现国内流量的精准网络栈控制，同时对代理节点保持原始下发配置（顺其自然）。
- ✅ **无 DNS 泄露** — 保留订阅私有 DNS，国内外 DNS 分离，`nameserver-policy` 精准分流，规避传统路由规则（如 `geosite:cn` 默认强制走 `DIRECT`）导致的解析污染问题。
- ✅ **高性能规则集** — 核心采用 MetaCubeX 与 666OS 维护的 `.mrs` 二进制格式（O(1) 哈希匹配），引入 `geolocation-cn` 与 `gfw` 规则集，告别臃肿的经典大杂烩规则。
- ✅ **`url-test` 自动测速** — tolerance 50ms 防抖动，lazy 懒加载省电。
- ✅ **精细化路由与 IP 兜底** — AIIP / GoogleIP / TelegramIP / ProxyIP / ChinaIP + PrivateIP 体系，针对特定静态资源（如 Bilibili `hdslb.com`）实现精准直连，辅以域名漏网 IP 兜底机制，彻底移除影响性能的 `no-resolve` 滥用。
- ✅ **QUIC 拦截** — 严格过滤非国内目的地的 UDP/443 流量，有效防止 YouTube / Netflix 等流媒体因 QUIC 降级导致的视频卡顿。
- ✅ **节点智能化处理** — 自动排除失效或非目标节点，智能识别并重组低倍率（≤0.5）与高倍率（≥2）节点。

## 内置策略组

| 策略组 | 默认指向 | 备注 |
|:------|:--------|:-----|
| **Auto** | 自动测速 | 日常使用，自动选最优地区 |
| **Proxies** | Auto | 主入口，可选手动地区 |
| **直连** | 🇨🇳 直连 \| 双栈 | 国内服务直连入口，支持切换 IPv4/IPv6 偏好 |
| **Google** | Proxies | 解决 Play Store 下载 |
| **YouTube** | Proxies | 流媒体 |
| **Spotify** | Proxies / 直连 | 音乐（默认节点选择 TW） |
| **Telegram** | Proxies | 通讯 |
| **Games** | Proxies / 直连 | 游戏 |
| **PayPal** | Proxies / 直连 | 支付 |
| **X** | Proxies | 社交 |
| **OpenAI** | Proxies | ChatGPT（默认节点选择 US） |
| **AI** | Proxies | 通用 AI 服务（默认节点选择 US） |
| **Apple** | Proxies / 直连 | 苹果服务 |
| **Final** | Proxies / 直连 | 最终兜底 |

## 内置节点组

> - 若机场订阅中不存在对应节点，则该节点组不会显示
> - 每组均为 select 手动选择，内部包含对应的 hidden url-test 自动选择组

- `HK`
- `JP`
- `SG`
- `TW`
- `US`
- `KR`
- `EU`
- `Other`
- `低倍率节点`
- `高倍率节点`

## 版本历史

| 版本 | 说明 |
|:----|:------|
| **v11.0** | 架构升级：引入完整 IPv6/双栈控制体系，弃用内置保留关键字 DIRECT 策略组（重命名为直连），全面集成 gfw 与 geolocation-cn 规则集，优化 DNS 策略与 B站静态资源分流。 |
| **v10.1** | 同步非标机场 DNS 提取逻辑，优化 Keep-Alive、NTP 及 TUN 模式参数 |
| **v10.0** | 终极防崩溃打磨：引入节点强校验、完美动态 Other 补集、重构倍率识别算法、合并并发 DNS |
| **v9.1** | 移除 FCM/Speedtest 规则集，Games 完整重命名，PCDN 拦截扩展，default-selected 硬编码 |
| **v8.1** | 极致轻量版重构：FCM 推送、url-test 取代 fallback、倍率过滤、DNS 提取 |
| **v8.0** | DNS 教科书方案：respect-rules + fake-ip-filter-mode + fallback-filter |
| **v7.0** | 全策略组添加 Qure 面板图标 |
| **v6.0** | Google 分流至 Proxies，解决 Play Store 下载 |
| **v5.0** | 补充 NTP/geodata-mode/TUN/Smart 配置 |
| **v4.0** | 全面迁移 666OS `.mrs`，GEOSITE→RULE-SET |
| **v3.0** | fallback 取代 url-test，加 KR/EU/Other 地区 |
| **v2.0** | ACL4SSR 迁移：ChinaDomain/ChinaIP/ProxyLite |
| **v1.0** | 初始版：AGWA5783 规则集 + url-test |

## 致谢

- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) — 主要参考来源与双栈灵感
- [666OS/rules](https://github.com/666OS/rules) — 规则集
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- [wwqgtxx/clash-rules](https://github.com/wwqgtxx/clash-rules)
- [Koolson/Qure](https://github.com/Koolson/Qure) — 图标集
