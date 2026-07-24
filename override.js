/**
 * mihomo 配置覆写脚本
 * 仓库：https://github.com/JesseHug/clash-override
 * 核心基建：基于标准脚本模板（包含 DNS 防污染与 Hosts 映射）
 * 策略与规则：url-test 测速、地区分组、倍率过滤
 * 说明：移除 Smart/GeoData，部分策略组已硬编码 default-selected
 */

// --- 静态配置区域 ---

/**
 * 全局排除高倍率节点配置
 * 该配置用于启用全局排除高倍率节点功能
 * true = 启用
 * false = 禁用
 */
const excludeHighRateProxiesEnable = false;

// --- 节点匹配正则定义 ---

// 定义全局排除节点的正则表达式，用于剔除无关或失效的信息节点
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|traffic|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/iu;
const lowRateRegex = /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<![\d.])0\.\d+|下载|低倍|实验性)/;
const highRateRegex = /(?:[*×xX✕✖⨉]\s*(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*))|(?:(?<![\d.])(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*)\s*(?:倍|[*×xX✕✖⨉]))/u;

function main(config) {
  const newConfig = {};

  // --- 节点过滤与校验 ---

  /**
   * 基础节点结构校验函数
   * 1. 过滤缺少 server/port 字段的异常节点
   * 2. 过滤 127.0.0.1、0.0.0.0 等本地节点
   * 防止内核加载异常节点时崩溃
   */
  const checkProxy = (proxy) => {
    if (!proxy || typeof proxy !== 'object') return false;
    if (typeof proxy.server !== 'string' || proxy.server.trim() === '') return false;
    if (typeof proxy.port !== 'number' || proxy.port <= 0 || proxy.port > 65535) return false;
    if (typeof proxy.type !== 'string' || proxy.type.trim() === '') return false;
    if (proxy.server === '127.0.0.1' || proxy.server === 'localhost' || proxy.server === '0.0.0.0') return false;
    return true;
  };

  // 执行节点有效性校验、屏蔽词剔除以及倍率拦截
  if (Array.isArray(config.proxies)) {
    config.proxies = config.proxies.filter(proxy => {
      if (!checkProxy(proxy)) return false; // 踢出缺少 server/port 等关键字段的坏节点
      if (excludeFilter.test(proxy.name)) return false;
      if (excludeHighRateProxiesEnable && highRateRegex.test(proxy.name)) return false;
      return true;
    });
  }

  const proxies = config.proxies || [];
  const isAllDirectOrReject = proxies.every(p => p.type?.toLowerCase() === 'direct' || p.type?.toLowerCase() === 'reject');
  if (!proxies.length || isAllDirectOrReject) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  // --- 基础网络与内核特性配置 ---
  newConfig['allow-lan'] = true;
  newConfig['ipv6'] = false;
  newConfig['mode'] = 'rule';
  newConfig['log-level'] = 'info';
  newConfig['bind-address'] = '*';
  newConfig['unified-delay'] = true;
  newConfig['tcp-concurrent'] = true;
  newConfig['keep-alive-idle'] = 600;
  newConfig['keep-alive-interval'] = 60;
  newConfig['find-process-mode'] = 'strict';

  newConfig['external-controller'] = '127.0.0.1:9090';
  newConfig['external-ui'] = 'ui';
  newConfig['external-ui-url'] = 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip';

  newConfig['profile'] = {
    'store-selected': true,
    'store-fake-ip': true,
  };

  // --- DNS 提取策略与 Hosts 映射 ---

  // 读取订阅中的 DNS 配置，提取并保留机场私有 DNS (nameserver-policy)
  // 解决部分私有协议节点因公共 DNS 无法解析落地 IP 的问题
  const originalDnsConfig = config.dns || {};

  const commonDnsRegex =
    /(223\.5\.5\.5|223\.6\.6\.6|119\.29\.29\.29|1\.12\.12\.12|120\.53\.53\.53|114\.114\.114\.114|180\.76\.76\.76|1\.1\.1\.1|1\.0\.0\.1|8\.8\.8\.8|8\.8\.4\.4|94\.140\.14\.14|94\.140\.15\.15|127\.0\.0\.1|alidns|doh\.pub|dot\.pub|dnspod|dns\.baidu|dns\.google|cloudflare|adguard|system)/i;

  const privateDNS = [
    ...new Set([
      ...(originalDnsConfig['nameserver'] || []),
      ...(originalDnsConfig['proxy-server-nameserver'] || []),
    ]),
  ].filter((dns) => !commonDnsRegex.test(String(dns)));

  const proxyServerPolicy = {};

  for (const policy of [
    originalDnsConfig['proxy-server-nameserver-policy'] || {},
    originalDnsConfig['nameserver-policy'] || {},
  ]) {
    for (const [rule, dns] of Object.entries(policy)) {
      const dnsList = Array.isArray(dns) ? dns : [dns];

      if (dnsList.some((item) => commonDnsRegex.test(String(item)))) {
        continue;
      }
      proxyServerPolicy[rule] = dns;
    }
  }

  const chinaDNS = ['https://dns.alidns.com/dns-query#DIRECT', 'https://doh.pub/dns-query#DIRECT'];
  const foreignDNS = ['https://dns.cloudflare.com/dns-query#Proxies', 'https://dns.google/dns-query#Proxies'];

  newConfig['dns'] = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/16',
    'fake-ip-filter': ['rule-set:Private', 'rule-set:fakeip_filter'],
    'proxy-server-nameserver': [...chinaDNS, ...privateDNS],
    ...(Object.keys(proxyServerPolicy).length > 0 && {
      'proxy-server-nameserver-policy': proxyServerPolicy,
    }),
    'default-nameserver': ['223.5.5.5', '119.29.29.29'],
    nameserver: [...foreignDNS],
    'nameserver-policy': {
      'rule-set:ChinaDomain,cn_additional': [...chinaDNS],
    },
    'direct-nameserver': ['system', '223.5.5.5', '119.29.29.29'],
  };

  // 收集节点域名，保留机场私有 hosts（防止覆盖导致节点解析失败）
  const proxyDomains = new Set(proxies.map((p) => p.server?.toLowerCase()).filter(Boolean));
  const originalHosts = config.hosts || {};
  const proxyServerHosts = {};
  for (const [host, value] of Object.entries(originalHosts)) {
    if (proxyDomains.has(host.toLowerCase())) {
      proxyServerHosts[host] = value;
    }
  }

  newConfig['hosts'] = {
    'dns.alidns.com': ['223.5.5.5', '223.6.6.6'],
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'dns.cloudflare.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': ['services.googleapis.com'],
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    ...proxyServerHosts,
  };

  newConfig['ntp'] = { enable: true, 'write-to-system': false, server: 'ntp.aliyun.com', port: 123, interval: 60 };
  newConfig['tun'] = { enable: true, stack: 'system', 'auto-route': true, 'strict-route': true, 'auto-redirect': true, 'auto-detect-interface': true, 'dns-hijack': ['any:53', 'tcp://any:53'] };

  newConfig['proxies'] = [...proxies];

  // --- 策略组构建 ---
  const pNames = proxies.map(p => p.name);
  const getNodes = (reg) => {
    const res = pNames.filter(name => reg.test(name));
    return res.length > 0 ? res : ["DIRECT"];
  };

  const healthCheckUrl = "https://g.cn/generate_204";
  const autoBaseOption = { type: "url-test", url: healthCheckUrl, interval: 300, tolerance: 50, lazy: true, timeout: 3000, "max-failed-times": 3 };
  const ico = "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color";

  const regionMappings = [
    { key: "HK", regex: /港|HK|HongKong|Hong Kong/i, icon: "Hong_Kong.png" },
    { key: "SG", regex: /坡|SG|Singapore/i, icon: "Singapore.png" },
    { key: "TW", regex: /台|TW|Taiwan/i, icon: "Taiwan.png" },
    { key: "JP", regex: /日|JP|Japan/i, icon: "Japan.png" },
    { key: "US", regex: /美|US|UnitedStates|United States/i, icon: "United_States.png" },
    { key: "KR", regex: /韩|KR|KOR|Korea/i, icon: "Korea.png" },
    { key: "EU", regex: /法|德|英|荷|FR|DE|GB|UK|NL|EU|Europe|Frankfurt|London|Paris|Amsterdam/i, icon: "European_Union.png" }
  ];

  const regionGroups = [];
  const regionAutoGroups = [];
  const activeRegions = [];
  const matchedByRegion = new Set();

  regionMappings.forEach(r => {
    const nodes = getNodes(r.regex);
    if (nodes[0] !== "DIRECT") {
      activeRegions.push(r.key);
      nodes.forEach(n => matchedByRegion.add(n));
      const autoName = `${r.key}-自动选择`;
      regionAutoGroups.push({ name: autoName, proxies: nodes, hidden: true, ...autoBaseOption });
      regionGroups.push({ name: r.key, type: "select", icon: `${ico}/${r.icon}`, proxies: [autoName, ...nodes] });
    }
  });

  const nodesOther = pNames.filter(n => !matchedByRegion.has(n) && !lowRateRegex.test(n) && !highRateRegex.test(n));
  if (nodesOther.length > 0) {
    activeRegions.push("Other");
    regionAutoGroups.push({ name: "Other-自动选择", proxies: nodesOther, hidden: true, ...autoBaseOption });
    regionGroups.push({ name: "Other", type: "select", icon: `${ico}/Europe_Map.png`, proxies: ["Other-自动选择", ...nodesOther] });
  }

  const nodesLowRate = getNodes(lowRateRegex);
  const nodesHighRate = getNodes(highRateRegex);
  if (nodesLowRate[0] !== "DIRECT") {
    activeRegions.push("低倍率节点");
    regionAutoGroups.push({ name: "低倍率节点-自动选择", proxies: nodesLowRate, hidden: true, ...autoBaseOption });
    regionGroups.push({ name: "低倍率节点", type: "select", icon: `${ico}/Available_1.png`, proxies: ["低倍率节点-自动选择", ...nodesLowRate] });
  }
  if (nodesHighRate[0] !== "DIRECT") {
    activeRegions.push("高倍率节点");
    regionAutoGroups.push({ name: "高倍率节点-自动选择", proxies: nodesHighRate, hidden: true, ...autoBaseOption });
    regionGroups.push({ name: "高倍率节点", type: "select", icon: `${ico}/Airport.png`, proxies: ["高倍率节点-自动选择", ...nodesHighRate] });
  }

  const masterName = "Auto";

  // 策略组工厂函数
  const buildGroup = (name, iconName, proxies = ["Proxies", ...activeRegions], extra = {}) => ({
    name,
    type: "select",
    icon: `${ico}/${iconName}.png`,
    proxies,
    ...extra
  });

  newConfig["proxy-groups"] = [
    buildGroup("Proxies", "Global", [masterName, ...activeRegions, ...pNames]),
    buildGroup("Google", "Google"),
    buildGroup("YouTube", "YouTube"),
    // Spotify 默认选择 TW
    buildGroup("Spotify", "Spotify", ["Proxies", "DIRECT", ...activeRegions], { defaultSelected: "TW" }),
    buildGroup("Telegram", "Telegram_X"),
    buildGroup("Games", "Game", ["Proxies", "DIRECT", ...activeRegions]),
    buildGroup("PayPal", "PayPal", ["Proxies", "DIRECT", ...activeRegions]),
    buildGroup("X", "X"),
    // OpenAI 与 AI 默认选择 US
    buildGroup("OpenAI", "ChatGPT", ["Proxies", ...activeRegions], { defaultSelected: "US" }),
    buildGroup("AI", "AI", ["Proxies", ...activeRegions], { defaultSelected: "US" }),
    buildGroup("Apple", "Apple", ["Proxies", "DIRECT", ...activeRegions]),
    buildGroup("Final", "Final", ["Proxies", "DIRECT"]),

    { name: masterName, icon: `${ico}/Auto.png`, proxies: activeRegions, ...autoBaseOption },
    ...regionGroups,
    ...regionAutoGroups
  ];

  // 转换 defaultSelected → default-selected（Mihomo 需要的格式）
  newConfig["proxy-groups"].forEach(g => {
    if (g.defaultSelected !== undefined) {
      g["default-selected"] = g.defaultSelected;
      delete g.defaultSelected;
    }
  });

  // --- Rule Providers (666OS 体系) ---
  
  // 使用 666OS 的 MRS 规则集
  // 降低内存占用并实现分流
  const mrs = { type: "http", behavior: "domain", format: "mrs", interval: 86400 };
  const mrsIP = { type: "http", behavior: "ipcidr", format: "mrs", interval: 86400 };
  const r66 = "https://github.com/666OS/rules/raw/release/mihomo";

  newConfig["rule-providers"] = {
    Direct: { ...mrs, url: `${r66}/domain/Direct.mrs`, path: "./rules/Direct.mrs" },
    Private: { ...mrs, url: `${r66}/domain/Private.mrs`, path: "./rules/Private.mrs" },
    YouTube: { ...mrs, url: `${r66}/domain/YouTube.mrs`, path: "./rules/YouTube.mrs" },
    Spotify: { ...mrs, url: `${r66}/domain/Spotify.mrs`, path: "./rules/Spotify.mrs" },
    Telegram: { ...mrs, url: `${r66}/domain/Telegram.mrs`, path: "./rules/Telegram.mrs" },
    Games: { ...mrs, url: `${r66}/domain/Games.mrs`, path: "./rules/Games.mrs" },
    PayPal: { ...mrs, url: `${r66}/domain/PayPal.mrs`, path: "./rules/PayPal.mrs" },
    Twitter: { ...mrs, url: `${r66}/domain/Twitter.mrs`, path: "./rules/Twitter.mrs" },
    OpenAI: { ...mrs, url: `${r66}/domain/OpenAI.mrs`, path: "./rules/OpenAI.mrs" },
    AI: { ...mrs, url: `${r66}/domain/AI.mrs`, path: "./rules/AI.mrs" },
    AppleCN: { ...mrs, url: `${r66}/domain/AppleCN.mrs`, path: "./rules/AppleCN.mrs" },
    Apple: { ...mrs, url: `${r66}/domain/Apple.mrs`, path: "./rules/Apple.mrs" },
    Google: { ...mrs, url: `${r66}/domain/Google.mrs`, path: "./rules/Google.mrs" },
    Proxies: { ...mrs, url: `${r66}/domain/Proxy.mrs`, path: "./rules/Proxies.mrs" },
    ChinaDomain: { ...mrs, url: `${r66}/domain/China.mrs`, path: "./rules/ChinaDomain.mrs" },
    ChinaIP: { ...mrsIP, url: `${r66}/ip/China.mrs`, path: "./rules/ChinaIP.mrs" },
    AIIP: { ...mrsIP, url: `${r66}/ip/AI.mrs`, path: "./rules/AIIP.mrs" },
    GoogleIP: { ...mrsIP, url: `${r66}/ip/Google.mrs`, path: "./rules/GoogleIP.mrs" },
    ProxyIP: { ...mrsIP, url: `${r66}/ip/Proxy.mrs`, path: "./rules/ProxyIP.mrs" },
    TelegramIP: { ...mrsIP, url: `${r66}/ip/Telegram.mrs`, path: "./rules/TelegramIP.mrs" },
    PrivateIP: { ...mrsIP, url: `${r66}/ip/Private.mrs`, path: "./rules/PrivateIP.mrs" },
    fakeip_filter: { ...mrs, url: "https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs", path: "./rules/fakeip_filter.mrs" },
    cn_additional: { ...mrs, url: "https://static-file-global.353355.xyz/rules/cn-additional-list.mrs", path: "./rules/cn_additional.mrs" },
  };

  // --- 路由分流规则 (Rules) ---
  
  // 核心路由规则
  // 注意：FCM 服务已交由 Google 策略接管
  newConfig.rules = [
    "AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,ChinaDomain),(RULE-SET,cn_additional),(RULE-SET,ChinaIP,no-resolve)))))),REJECT",
    "RULE-SET,Direct,DIRECT",
    "RULE-SET,Private,DIRECT",
    "RULE-SET,AppleCN,DIRECT",

    "RULE-SET,OpenAI,OpenAI",
    "RULE-SET,AI,AI",
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Google,Google",
    "RULE-SET,Spotify,Spotify",
    "RULE-SET,Telegram,Telegram",
    "RULE-SET,Games,Games",
    "RULE-SET,PayPal,PayPal",
    "RULE-SET,Twitter,X",
    "RULE-SET,Apple,Apple",

    "RULE-SET,Proxies,Proxies",
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,cn_additional,DIRECT",

    "RULE-SET,PrivateIP,DIRECT,no-resolve",
    "RULE-SET,AIIP,AI,no-resolve",
    "RULE-SET,GoogleIP,Google,no-resolve",
    "RULE-SET,TelegramIP,Telegram,no-resolve",
    "RULE-SET,ProxyIP,Proxies,no-resolve",
    "RULE-SET,ChinaIP,DIRECT,no-resolve",

    "GEOIP,CN,DIRECT",
    "MATCH,Final"
  ];

  return newConfig;
}