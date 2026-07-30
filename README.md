# Clash Override

> 本项目基于 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 进行 AI 辅助修改，仅供个人自用。
>
> **建议普通用户直接使用原版 [AIsouler/MyClash](https://github.com/AIsouler/MyClash)，功能更完善、维护更积极。**

Mihomo（Clash Meta）覆写脚本与全量配置文件。

友情推荐，非常好用、省电且内存占用低的代理软件：[Bettbox](https://github.com/appshubcc/Bettbox)

## 覆写脚本

复制链接导入到 Bettbox 远程覆写：

```
https://raw.githubusercontent.com/JesseHug/clash-override/master/override.js
```

> [!IMPORTANT]
> - 仅适用于覆写机场提供的配置文件，请勿用于覆写自己编写的配置文件
> - 已解决机场使用私有 DNS 导致无法解析节点域名的问题
> - 支持 Bettbox GUI 开关：Emby 分流、全局过滤高倍率节点

## 配置文件

复制链接导入代理客户端，替换 `proxy-providers` 中的订阅 URL：

```
https://raw.githubusercontent.com/JesseHug/clash-override/master/config.yaml
```

> [!IMPORTANT]
> - 对于使用私有 DNS 的机场，需手动将私有 DNS 填入配置文件
> - 未匹配到节点的策略组将回退到 REJECT

## 致谢

- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) — 本项目的基础与主要参考来源
- [666OS/rules](https://github.com/666OS/rules) — 规则集
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
- [wwqgtxx/clash-rules](https://github.com/wwqgtxx/clash-rules)
- [Koolson/Qure](https://github.com/Koolson/Qure) — 图标集
