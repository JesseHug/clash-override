# Clash Override

> 由 AI 辅助开发（Claude Code + AIsouler/MyClash 参考）

Mihomo（Clash Meta）高性能覆写脚本与配置文件，无 DNS 泄露、`url-test` 自动测速、倍率过滤、IP 规则兜底、PCDN 拦截、已关闭 IPv6。

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

- ✅ **现代 JS 语法 (ES2020)** — 脚本采用最前沿的 ES2020 语法架构（如可选链 `?.` 与空值合并 `??`），请确保您的客户端支持 **QuickJS** 引擎。

- ✅ **无 DNS 泄露** — 保留订阅私有 DNS，国内外 DNS 分离，`nameserver-policy` 精准分流
- ✅ **高性能规则集** — 666OS 编译 `.mrs` 二进制格式，O(1) 哈希匹配，告别臃肿 geodata
- ✅ **`url-test` 自动测速** — tolerance 50ms 防抖动，lazy 懒加载省电
- ✅ **IP 规则体系** — AIIP / GoogleIP / TelegramIP / ProxyIP / ChinaIP + PrivateIP，域名漏网 IP 兜底
- ✅ **QUIC 拦截** — 禁用国外 UDP/443，防止 YouTube/Netflix 视频卡顿
- ✅ **自动排除非地区信息节点** — 可自定义是否启用（默认启用）
- ✅ **自动识别节点倍率** — 低倍率节点（≤0.5）、高倍率节点（≥2）分别归类

## 内置策略组

| 策略组 | 默认指向 | 备注 |
|:------|:--------|:-----|
| **Auto** | 自动测速 | 日常使用，自动选最优地区 |
| **Proxies** | Auto | 主入口，可选手动地区 |
| **Google** | Proxies | 解决 Play Store 下载 |
| **YouTube** | Proxies | 流媒体 |
| **Spotify** | Proxies / DIRECT | 音乐 |
| **Telegram** | Proxies | 通讯 |
| **Steam** | Proxies / DIRECT | 游戏 |
| **PayPal** | Proxies / DIRECT | 支付 |
| **X** | Proxies | 社交 |
| **OpenAI** | Proxies | ChatGPT |
| **AI** | Proxies | 通用 AI 服务 |
| **Apple** | Proxies / DIRECT | 苹果服务 |
| **Final** | Proxies / DIRECT | 最终兜底 |

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

- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) — 主要参考来源
- [666OS/rules](https://github.com/666OS/rules) — 规则集
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- [wwqgtxx/clash-rules](https://github.com/wwqgtxx/clash-rules)
- [Koolson/Qure](https://github.com/Koolson/Qure) — 图标集
