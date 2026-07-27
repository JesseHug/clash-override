# Clash Override

Mihomo（Clash Meta）覆写脚本与全量配置文件，无 DNS 泄露，内置多项分流策略与地区策略组，支持自动识别节点倍率、全局排除高倍率节点，解决机场使用私有 DNS 导致无法解析节点域名的问题

友情推荐，非常好用、省电且内存占用低的代理软件：[Bettbox](https://github.com/appshubcc/Bettbox)

## 覆写脚本

> [!IMPORTANT]
>
> - _注意⚠️：该脚本仅适用于覆写机场提供的配置文件，请勿用于覆写自己编写的配置文件_
> - _脚本已解决机场使用私有 DNS 导致无法解析节点域名的问题_
> - _地区策略组根据是否匹配到节点来动态生成，未匹配到节点的地区组不会显示_
> - _支持自定义是否全局过滤高倍率节点（默认禁用）_
> - _支持自定义是否启用 Emby 分流策略组（默认禁用）_

### 使用方法（脚本）

复制以下链接导入到代理客户端的远程覆写中，以 [Bettbox](https://github.com/appshubcc/Bettbox) 为例：

- [override.js](/override.js)

```txt
https://raw.githubusercontent.com/JesseHug/clash-override/master/override.js
```

## 配置文件

> [!IMPORTANT]
>
> - _配置文件实现的效果和脚本基本一致_
> - _不支持自定义是否启用策略组，不支持自定义是否过滤高倍率节点_
> - _无法像脚本那样实现不生成未匹配到节点的策略组_
> - _对于使用私有 DNS 的机场，需要手动将私有 DNS 填入到配置文件中_
> - _未匹配到节点的策略组将回退到 REJECT_

### 使用方法（配置）

复制以下链接或下载完整代码后导入代理客户端，替换 `proxy-providers` 中的订阅 URL 即可使用：

- [config.yaml](/config.yaml)

```txt
https://raw.githubusercontent.com/JesseHug/clash-override/master/config.yaml
```

## 核心特性

- **无 DNS 泄露** — 保留订阅私有 DNS，国内外 DNS 分离，`nameserver-policy` 精准分流
- **高性能规则集** — 采用 666OS 与 MetaCubeX 维护的 `.mrs` 二进制格式（O(1) 哈希匹配）
- **url-test 自动测速** — tolerance 50ms 防抖动，lazy 懒加载省电
- **节点智能处理** — 自动排除失效或非目标节点，智能识别并分组低倍率（<1x）与高倍率（≥2x）节点
- **QUIC 拦截** — 过滤非国内 UDP/443 流量，防止流媒体因 QUIC 降级导致卡顿
- **IPv6 双栈支持** — 独立"直连"策略组，内置 IPv4 优先 / IPv6 优先 / 双栈直连节点
- **PCDN 拦截** — 屏蔽哔哩哔哩 PCDN 域名，解决视频访问卡顿问题

## 内置策略组

| 策略组 | 默认指向 | 备注 |
|:------|:--------|:-----|
| Proxies | Auto | 主入口，可手动切换地区 |
| Google | Proxies | Google 服务 |
| YouTube | MO | 流媒体 |
| Spotify | TW | 音乐 |
| Telegram | Proxies | 通讯 |
| Games | Proxies / 直连 | 游戏 |
| PayPal | Proxies / 直连 | 支付 |
| X | Proxies | 社交 |
| OpenAI | US | ChatGPT |
| AI | US | 通用 AI 服务 |
| Apple | Proxies / 直连 | 苹果服务 |
| Emby | Proxies / 直连 | 媒体服务（脚本默认禁用，需手动开启） |
| Final | Proxies / 直连 | 最终兜底 |
| 直连 | 🇨🇳 直连 \| 双栈 | 国内直连，支持切换 IPv4/IPv6 偏好 |
| Auto | url-test | 自动测速选择最优地区 |

## 内置节点组

> 覆写脚本中，若机场订阅中不存在对应节点，则该节点组不会显示

| 节点组 | 匹配规则 |
|:------|:--------|
| HK | 港 / HK / Hong Kong |
| SG | 坡 / SG / Singapore |
| TW | 台 / TW / Taiwan |
| JP | 日 / JP / Japan |
| US | 美 / US / United States |
| MO | 澳 / MO / Macao / Macau |
| EU | 法 / 德 / 英 / 荷 / FR / DE / GB / UK / NL 等 |
| Other | 未匹配到以上地区的节点 |
| 低倍率节点 | 倍率 < 1x 的节点 |
| 高倍率节点 | 倍率 ≥ 2x 的节点 |

## 致谢

- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) — 主要参考来源
- [666OS/rules](https://github.com/666OS/rules) — 规则集
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- [wwqgtxx/clash-rules](https://github.com/wwqgtxx/clash-rules)
- [Koolson/Qure](https://github.com/Koolson/Qure) — 图标集
