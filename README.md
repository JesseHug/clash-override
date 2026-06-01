# Clash Override

FLClash (Mihomo) JavaScript 覆写配置，四版迭代记录。

## 版本历史

| 版本 | 说明 |
|:----|:-----|
| **v1.0** | 初始版：纯 AGWA5783 规则集，`classical` 行为，`url-test` 自动测速 |
| **v2.0** | ACL4SSR 迁移：ChinaDomain/ChinaIP/ProxyLite + blackmatrix7 Apple |
| **v3.0** | 性能优化：`fallback` 取代 `url-test`，加 `lazy`/防误判，加 KR/EU/Other 地区，加 Speedtest，删 Bahamut |
| **v4.0** | 全面迁移 666OS `.mrs`：所有规则集换二进制格式（O(1) 匹配），GEOSITE→RULE-SET，清理废弃代码 |

## 查看各版本

```bash
git checkout v1.0
git checkout v2.0
git checkout v3.0
git checkout v4.0
```
