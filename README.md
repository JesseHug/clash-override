# Clash Override

> 本项目基于 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 进行 AI 辅助修改，仅供个人自用。
>
> **建议普通用户直接使用原版 [AIsouler/MyClash](https://github.com/AIsouler/MyClash)，功能更完善、维护更积极。**

Mihomo（Clash Meta）覆写脚本与全量配置文件。

友情推荐，非常好用、省电且内存占用低的代理软件：[Bettbox](https://github.com/appshubcc/Bettbox)

## 覆写脚本

适用于 Bettbox / Clash Verge Rev / Mihomo Party 等客户端对机场原始订阅进行远程覆写：

### 极简版覆写 (Lite - 推荐)

自动将机场订阅一键重构为【国内】、【国外】、【AI】三大核心策略组（加自动测速与兜底），界面极度清爽：

```
https://raw.githubusercontent.com/JesseHug/clash-override/master/overrideLite.js
```

### 全量版覆写 (Full)

包含精细化服务分流（Google、YouTube、Telegram、Spotify、Games 等）与全地区选择组：

```
https://raw.githubusercontent.com/JesseHug/clash-override/master/override.js
```

> [!IMPORTANT]
> - 仅适用于覆写机场提供的原始订阅配置文件，请勿用于覆写自己编写的配置文件
> - 已解决机场使用私有 DNS 导致无法解析节点域名的问题
> - 全量版支持 Bettbox GUI 开关：Emby 分流、全局过滤高倍率节点等

## 配置文件

### 极简版配置 (Lite - 推荐)

仅保留【国内】、【国外】、【AI】三大核心分流策略组（外加自动测速与兜底），界面极简轻量，加载飞速：

```
https://raw.githubusercontent.com/JesseHug/clash-override/master/configLite.yaml
```

### 全量版配置 (Full)

包含精细化服务分流（Google、YouTube、Telegram、Spotify、Games 等）与地区策略组：

```
https://raw.githubusercontent.com/JesseHug/clash-override/master/config.yaml
```

> [!IMPORTANT]
> - 导入代理客户端后，请将 `proxy-providers` 中的订阅 URL 替换为您自己的机场订阅链接
> - 对于使用私有 DNS 的机场，需手动将私有 DNS 填入配置文件
> - 未匹配到节点的策略组将回退到 REJECT

## 致谢

感谢以下开源项目及所有上游项目（排名不分先后）：

### 核心与面板
- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) — 内核支持
- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) — 本项目的基础与核心逻辑来源
- [Zephyruso/zashboard](https://github.com/Zephyruso/zashboard) — Web 仪表盘（External UI）

### 规则集
- [appshubcc/bett-rules](https://github.com/appshubcc/bett-rules) — 高性能 mrs 规则集主要来源
- [666OS/rules](https://github.com/666OS/rules) — EmbyIP 规则集来源
- [YiXuanZX/rules](https://github.com/YiXuanZX/rules) — 规则参考
- [217heidai/adblockfilters](https://github.com/217heidai/adblockfilters) — 广告拦截规则

### 图标集
- [Koolson/Qure](https://github.com/Koolson/Qure) — 策略组与地区彩色图标集
- [lixing0016/lige-icon](https://github.com/lixing0016/lige-icon) — 高低倍率节点图标
- [MiToverG422/Qure](https://github.com/MiToverG422/Qure) — FCM 策略组图标

### 脚本参考
- [dahaha-365/YaNet](https://github.com/dahaha-365/YaNet) — 脚本逻辑参考
