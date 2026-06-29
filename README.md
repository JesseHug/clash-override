# Clash Override

FLClash (Mihomo) 高性能代理覆写配置 + YAML 完整配置，九版迭代。

## 版本历史

| 版本 | 说明 |
|:----|:-----|
| **v1.0** | 初始版：纯 AGWA5783 规则集，`classical` 行为，`url-test` 自动测速 |
| **v2.0** | ACL4SSR 迁移：ChinaDomain/ChinaIP/ProxyLite + blackmatrix7 Apple |
| **v3.0** | 性能优化：`fallback` 取代 `url-test`，加 `lazy`/防误判，加 KR/EU/Other 地区，加 Speedtest，删 Bahamut |
| **v4.0** | 全面迁移 666OS `.mrs`：所有规则集换二进制格式（O(1) 匹配），GEOSITE→RULE-SET，清理废弃代码 |
| **v5.0** | 补充 NTP/geodata-mode/TUN/Smart 配置，Telegram 换 ACL4SSR，新增 X 策略组 + IP 规则 |
| **v6.0** | Google 分流至 Proxies（使香港等节点正常下载 Play Store），新增 GoogleIP 规则 |
| **v7.0** | 全策略组添加 Qure 面板图标，提升面板可视化 |
| **v8.0** | DNS 教科书方案：`respect-rules` + `fake-ip-filter-mode` + `fallback-filter`，QUIC 拦截，`cn_additional` 补充国内域名 |
| **v8.1** | 极致轻量版重构：FCM 推送规则、`url-test` 取代 `fallback`、倍率过滤分组、独立 Google 策略组、自动选择组、DNS 提取保留订阅配置 |
| **v9.0** | 全面同步：IP 规则体系完善（TelegramIP/PrivateIP），YAML 完全对齐 override.js，策略组采用两层结构（select + hidden url-test） |

## 快速链接

| 文件 | 用途 | 直接使用 |
|:----|:----|:---------|
| **override.js** | FLClash 覆写（自动过滤/倍率分组/DNS防污染） | `https://raw.githubusercontent.com/JesseHug/clash-override/master/override.js` |
| **config.yaml** | 完整独立配置（替换订阅 URL 即用） | `https://raw.githubusercontent.com/JesseHug/clash-override/master/config.yaml` |

### override.js 使用方式
- FLClash → 覆写 → 添加远程覆写 → 粘贴上方 URL
- 日常面板选 `Auto` 自动测速最优地区
- 如需手动固定地区，选 `HK` / `JP` / `US` 等

### config.yaml 使用方式
- 修改 `proxy-providers` 中的订阅 URL 为你的机场链接
- 直接作为 Mihomo 主配置文件使用

## 查看各版本

```bash
git checkout v9.0   # 最新版
git checkout v8.1   # 上一版
# 更多版本见 tag 列表
```
