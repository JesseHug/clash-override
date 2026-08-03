/**
 * mihomo 配置覆写脚本
 * 仓库：https://github.com/JesseHug/clash-override
 * 核心基建：基于标准脚本模板（包含 DNS 防污染与 Hosts 映射）
 * 策略与规则：url-test 测速、地区分组、倍率过滤
 * 说明：移除 Smart/GeoData，部分策略组已硬编码 default-selected
 */

// --- 静态配置区域 ---

// 适配 Bettbox 自定义配置参数
const Compatible_With_Bettbox = { ruleOptionsEnable: true };

/**
 * 自定义配置选项
 * true = 启用
 * false = 禁用
 */
const ruleOptionsEnable = {
  // 分流策略组
  Google: true,           // Google 服务
  YouTube: true,          // YouTube 视频
  Spotify: true,          // Spotify 音乐
  Telegram: true,         // Telegram 通讯
  Games: true,            // 游戏平台 (Steam/Epic等)
  X: true,                // X (Twitter)
  OpenAI: true,           // OpenAI 及其服务
  AI: true,               // 其他 AI 服务
  Apple: true,            // Apple 服务

  PayPal: false,          // PayPal 支付
  Netflix: false,         // Netflix 流媒体
  Emby: false,            // Emby 媒体服务

  // 非分流策略配置
  屏蔽国外QUIC: true,           // 屏蔽国外 QUIC 流量（防止视频卡顿）
  显示默认隐藏的策略组: false,  // 显示隐藏的地区 url-test 自动选择组
  生成地区自动选择组: true,     // 为每个地区生成隐藏的 url-test 自动选择组
  隐藏地区手动选择组: false,    // 隐藏地区 select 手动选择组（仍然存在，只是不显示）
  过滤高倍率节点: false,        // 全局排除高倍率节点（2x 及以上）
  过滤非地区节点: true,         // 过滤掉不属于任何地区的节点（Other 组中的杂项节点）
};

// 专门用于适配 Bettbox GUI 读取开关图标的定义
const serviceConfigs = [
  { name: 'Google', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google.png' },
  { name: 'YouTube', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png' },
  { name: 'Spotify', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png' },
  { name: 'Telegram', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram_X.png' },
  { name: 'Games', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Game.png' },
  { name: 'PayPal', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/PayPal.png' },
  { name: 'X', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/X.png' },
  { name: 'OpenAI', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png' },
  { name: 'AI', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png' },
  { name: 'Apple', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png' },
  { name: 'Netflix', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png' },
  { name: 'Emby', icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Emby.png' },
];

// --- 预定义规则 ---

// 直连节点
const directProxies = [
  { name: '🇨🇳 直连 | 双栈', type: 'direct' },
  { name: '🇨🇳 直连 | IPv4优先', type: 'direct', 'ip-version': 'ipv4-prefer' },
  { name: '🇨🇳 直连 | IPv6优先', type: 'direct', 'ip-version': 'ipv6-prefer' },
];

// --- 节点匹配正则定义 ---

// 定义全局排除节点的正则表达式，用于剔除无关或失效的信息节点
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|traffic|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/iu;
const lowRateRegex = /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<![\d.])0\.\d+|下载|低倍|实验性)/;
const highRateRegex = /(?:[*×xX✕✖⨉]\s*(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*))|(?:(?<![\d.])(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*)\s*(?:倍|[*×xX✕✖⨉]))/u;

const regionMappings = [
  { key: "HK", flag: "🇭🇰", regex: /港|HK|HongKong|Hong Kong/i, icon: "Hong_Kong.png" },
  { key: "SG", flag: "🇸🇬", regex: /坡|SG|Singapore/i, icon: "Singapore.png" },
  { key: "TW", flag: "🇹🇼", regex: /台|TW|Taiwan/i, icon: "Taiwan.png" },
  { key: "JP", flag: "🇯🇵", regex: /日|JP|Japan/i, icon: "Japan.png" },
  { key: "US", flag: "🇺🇸", regex: /美|US|UnitedStates|United States/i, icon: "United_States.png" },
  { key: "MO", flag: "🇲🇴", regex: /澳|MO|Macao|Macau/i, icon: "Macao.png" },
  { key: "EU", flag: "🇪🇺", regex: /法|德|英|荷|FR|DE|GB|UK|NL|EU|Europe|Frankfurt|London|Paris|Amsterdam/i, icon: "European_Union.png" }
];

// --- 域名匹配工具函数 ---

function matchDomainPattern(pattern, domains) {
  pattern = pattern.toLowerCase();

  // 精确匹配
  if (!pattern.includes('*') && !pattern.startsWith('+.') && !pattern.startsWith('.')) {
    return domains.has(pattern);
  }

  // +.example.com
  if (pattern.startsWith('+.')) {
    const suffix = pattern.slice(2);
    for (const domain of domains) {
      if (domain === suffix || domain.endsWith(`.${suffix}`)) {
        return true;
      }
    }
    return false;
  }

  // .example.com
  if (pattern.startsWith('.')) {
    const suffix = pattern.slice(1);
    for (const domain of domains) {
      if (domain !== suffix && domain.endsWith(`.${suffix}`)) {
        return true;
      }
    }
    return false;
  }

  // *.example.com、example.*.com 等
  const patternParts = pattern.split('.');
  for (const domain of domains) {
    const domainParts = domain.split('.');

    // 标签数量必须一致
    if (patternParts.length !== domainParts.length) {
      continue;
    }
    let matched = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] !== '*' && patternParts[i] !== domainParts[i]) {
        matched = false;
        break;
      }
    }

    if (matched) {
      return true;
    }
  }

  return false;
}

// --- 正则缓存加速 ---
const proxyRegionCache = new Map();
const anyRegionRegex = new RegExp(regionMappings.map((r) => r.regex.source).join('|'), 'i');

function getMatchedRegions(proxyName) {
  if (proxyRegionCache.has(proxyName)) {
    return proxyRegionCache.get(proxyName);
  }

  const regions = anyRegionRegex.test(proxyName)
    ? regionMappings.filter((region) => region.regex.test(proxyName))
    : [];
  proxyRegionCache.set(proxyName, regions);

  return regions;
}


// --- 模块化重构 ---

function filterAndNormalizeProxies(config) {
  proxyRegionCache.clear();

  const checkProxy = (proxy) => {
    if (!proxy || typeof proxy !== 'object') return false;
    if (typeof proxy.server !== 'string' || proxy.server.trim() === '') return false;
    if (typeof proxy.port !== 'number' || proxy.port <= 0 || proxy.port > 65535) return false;
    if (typeof proxy.type !== 'string' || proxy.type.trim() === '') return false;
    if (proxy.server === '127.0.0.1' || proxy.server === 'localhost' || proxy.server === '0.0.0.0') return false;
    return true;
  };

  const originalProxies = config.proxies || [];
  const originalProxyNames = new Set(originalProxies.map(p => p.name));

  let filteredRawProxies = originalProxies.filter(proxy => {
    if (!checkProxy(proxy)) return false;
    if (excludeFilter.test(proxy.name)) return false;
    if (ruleOptionsEnable.过滤高倍率节点 && highRateRegex.test(proxy.name)) return false;
    return true;
  });

  const survivingOriginalNames = new Set(filteredRawProxies.map(p => p.name));
  const renameMap = new Map();

  let proxies = filteredRawProxies.map(proxy => {
    const oldName = proxy.name;
    const regions = getMatchedRegions(proxy.name);
    if (regions.length > 0 && !/[\u{1F1E6}-\u{1F1FF}]{2}/u.test(proxy.name)) {
      proxy.name = `${regions[0].flag} ${proxy.name}`;
    }
    if (oldName !== proxy.name) renameMap.set(oldName, proxy.name);
    return proxy;
  });

  proxies = proxies.map(proxy => {
    const target = proxy['dialer-proxy'];
    if (!target) return proxy;
    if (renameMap.has(target)) return { ...proxy, 'dialer-proxy': renameMap.get(target) };
    if (survivingOriginalNames.has(target)) return proxy;
    if (originalProxyNames.has(target)) {
      const copy = { ...proxy };
      delete copy['dialer-proxy'];
      return copy;
    }
    return proxy;
  });

  const isAllDirectOrReject = proxies.every(p => p.type?.toLowerCase() === 'direct' || p.type?.toLowerCase() === 'reject');
  if (!proxies.length || isAllDirectOrReject) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  return proxies;
}

function buildDnsAndHostsConfig(config, proxies) {
  const originalDnsConfig = config.dns ?? {};
  
  const commonDnsList = [
    '223.5.5.5', '223.6.6.6', '119.29.29.29', '1.12.12.12', '120.53.53.53',
    '114.114.114.114', '180.76.76.76', '1.2.4.8', '116.116.116.116',
    '101.226.4.6', '123.125.81.6', '180.184.1.1', '180.184.2.2',
    '1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4', '9.9.9.9',
    '149.112.112.112', '208.67.222.222', '208.67.220.220',
    '94.140.14.14', '94.140.15.15', '76.76.2.0', '76.76.10.0',
    '185.228.168.9', '185.228.169.9', '77.88.8.8', '77.88.8.1',
    '156.154.70.1', '156.154.71.1',
    '127.0.0.1',
    'alidns', 'doh.pub', 'dot.pub', 'dnspod', 'dns.baidu',
    'dns.google', 'cloudflare', 'quad9', 'opendns', 'nextdns', 'adguard',
    'system',
  ];

  const isCommonDns = (dns) => {
    const value = String(dns).toLowerCase();
    return commonDnsList.some((keyword) => value.includes(keyword));
  };

  const proxyDomains = new Set(
    proxies.filter((p) => typeof p.server === 'string').map((p) => p.server.toLowerCase())
  );

  const privateDNS = [
    ...new Set([...(originalDnsConfig['nameserver'] ?? []), ...(originalDnsConfig['proxy-server-nameserver'] ?? [])]),
  ].filter((dns) => !isCommonDns(dns));

  const proxyServerPolicy = {};
  for (const policy of [
    originalDnsConfig['nameserver-policy'] ?? {},
    originalDnsConfig['proxy-server-nameserver-policy'] ?? {},
  ]) {
    for (const [domain, dns] of Object.entries(policy)) {
      if (matchDomainPattern(domain, proxyDomains)) {
        proxyServerPolicy[domain] = dns;
      }
    }
  }

  const chinaDNS = ['https://dns.alidns.com/dns-query#DIRECT', 'https://doh.pub/dns-query#DIRECT'];
  const foreignDNS = ['https://dns.cloudflare.com/dns-query#Proxies', 'https://dns.google/dns-query#Proxies'];

  const dns = {
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
      'rule-set:cn': [...chinaDNS],
    },
    'direct-nameserver': ['system', '223.5.5.5', '119.29.29.29'],
  };

  const originalHosts = config.hosts ?? {};
  const proxyServerHosts = {};
  for (const [domain, value] of Object.entries(originalHosts)) {
    if (matchDomainPattern(domain, proxyDomains)) {
      proxyServerHosts[domain] = value;
    }
  }

  const hosts = {
    'dns.alidns.com': ['223.5.5.5', '223.6.6.6'],
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'dns.cloudflare.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': ['services.googleapis.com'],
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
    ...proxyServerHosts,
  };

  return { dns, hosts };
}

function buildRegionGroups(proxies) {
  const pNames = proxies.map(p => p.name);
  const getNodes = (reg) => {
    const res = pNames.filter(name => reg.test(name));
    return res.length > 0 ? res : ["DIRECT"];
  };

  const healthCheckUrl = "https://g.cn/generate_204";
  const autoBaseOption = { type: "url-test", url: healthCheckUrl, interval: 300, tolerance: 50, lazy: true, timeout: 3000, "max-failed-times": 3 };
  const ico = "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color";

  const regionGroups = [];
  const regionAutoGroups = [];
  const activeRegions = [];
  const coreRegions = [];
  const matchedByRegion = new Set();

  regionMappings.forEach(r => {
    const nodes = getNodes(r.regex);
    if (nodes[0] !== "DIRECT") {
      activeRegions.push(r.key);
      coreRegions.push(r.key);
      nodes.forEach(n => matchedByRegion.add(n));
      const autoName = `${r.key}-自动选择`;
      if (ruleOptionsEnable.生成地区自动选择组) {
        regionAutoGroups.push({ name: autoName, proxies: nodes, hidden: !ruleOptionsEnable.显示默认隐藏的策略组, ...autoBaseOption });
      }
      const groupProxies = ruleOptionsEnable.生成地区自动选择组 ? [autoName, ...nodes] : nodes;
      regionGroups.push({ name: r.key, type: "select", icon: `${ico}/${r.icon}`, proxies: groupProxies, ...(ruleOptionsEnable.隐藏地区手动选择组 ? { hidden: true } : {}) });
    }
  });

  const nodesOther = pNames.filter(n => !matchedByRegion.has(n));
  if (!ruleOptionsEnable.过滤非地区节点 && nodesOther.length > 0) {
    activeRegions.push("Other");
    if (ruleOptionsEnable.生成地区自动选择组) {
      regionAutoGroups.push({ name: "Other-自动选择", proxies: nodesOther, hidden: !ruleOptionsEnable.显示默认隐藏的策略组, ...autoBaseOption });
    }
    const otherGroupProxies = ruleOptionsEnable.生成地区自动选择组 ? ["Other-自动选择", ...nodesOther] : nodesOther;
    regionGroups.push({ name: "Other", type: "select", icon: `${ico}/Europe_Map.png`, proxies: otherGroupProxies, ...(ruleOptionsEnable.隐藏地区手动选择组 ? { hidden: true } : {}) });
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

  return { regionGroups, regionAutoGroups, activeRegions, coreRegions, pNames, autoBaseOption, ico };
}

function buildProxyGroups(proxies, regionData) {
  const { regionGroups, regionAutoGroups, activeRegions, coreRegions, pNames, autoBaseOption, ico } = regionData;
  const masterName = "Auto";

  const buildGroup = (name, iconName, groupProxies = ["Proxies", ...activeRegions], extra = {}) => ({
    name,
    type: "select",
    icon: `${ico}/${iconName}.png`,
    proxies: groupProxies,
    ...extra
  });

  const groups = [
    buildGroup("Proxies", "Global", [masterName, ...activeRegions, ...pNames]),
    ...(ruleOptionsEnable.Google ? [buildGroup("Google", "Google")] : []),
    ...(ruleOptionsEnable.YouTube ? [buildGroup("YouTube", "YouTube", ["Proxies", ...activeRegions], { defaultSelected: "MO" })] : []),
    ...(ruleOptionsEnable.Spotify ? [buildGroup("Spotify", "Spotify", ["Proxies", "直连", ...activeRegions], { defaultSelected: "TW" })] : []),
    ...(ruleOptionsEnable.Telegram ? [buildGroup("Telegram", "Telegram_X")] : []),
    ...(ruleOptionsEnable.Games ? [buildGroup("Games", "Game", ["Proxies", "直连", ...activeRegions])] : []),
    ...(ruleOptionsEnable.PayPal ? [buildGroup("PayPal", "PayPal", ["Proxies", "直连", ...activeRegions])] : []),
    ...(ruleOptionsEnable.X ? [buildGroup("X", "X")] : []),
    ...(ruleOptionsEnable.OpenAI ? [buildGroup("OpenAI", "ChatGPT", ["Proxies", ...activeRegions], { defaultSelected: "US" })] : []),
    ...(ruleOptionsEnable.AI ? [buildGroup("AI", "AI", ["Proxies", ...activeRegions], { defaultSelected: "US" })] : []),
    ...(ruleOptionsEnable.Apple ? [buildGroup("Apple", "Apple", ["Proxies", "直连", ...activeRegions])] : []),
    ...(ruleOptionsEnable.Netflix ? [buildGroup("Netflix", "Netflix", ["Proxies", ...activeRegions])] : []),
    ...(ruleOptionsEnable.Emby ? [buildGroup("Emby", "Emby", ["Proxies", "直连", ...activeRegions])] : []),
    
    // Final 策略组加入所有 activeRegions
    buildGroup("Final", "Final", ["Proxies", "直连", ...activeRegions]),

    {
      name: "直连",
      type: "select",
      icon: `${ico}/China_Map.png`,
      proxies: [...directProxies.map(p => p.name)]
    },

    { name: masterName, icon: `${ico}/Auto.png`, proxies: coreRegions, ...autoBaseOption },
    ...regionGroups,
    ...regionAutoGroups
  ];

  groups.forEach(g => {
    if (g.defaultSelected !== undefined) {
      g["default-selected"] = g.defaultSelected;
      delete g.defaultSelected;
    }
  });

  return groups;
}

function main(config) {
  const newConfig = {};

  const proxies = filterAndNormalizeProxies(config);
  newConfig['proxies'] = [...proxies, ...directProxies];
  
  newConfig['mixed-port'] = 7890;
  newConfig['allow-lan'] = true;
  newConfig['ipv6'] = true;
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
  newConfig['profile'] = { 'store-selected': true, 'store-fake-ip': true };

  const { dns, hosts } = buildDnsAndHostsConfig(config, proxies);
  newConfig['dns'] = dns;
  newConfig['hosts'] = hosts;

  newConfig['ntp'] = { enable: true, 'write-to-system': false, server: 'ntp.aliyun.com', port: 123, interval: 60 };
  newConfig['tun'] = { enable: true, stack: 'system', 'auto-route': true, 'strict-route': true, 'auto-redirect': true, 'auto-detect-interface': true, 'dns-hijack': ['any:53', 'tcp://any:53'] };

  const regionData = buildRegionGroups(proxies);
  newConfig["proxy-groups"] = buildProxyGroups(proxies, regionData);

  // --- Rule Providers (666OS 体系) ---
  const mrs = { type: "http", behavior: "domain", format: "mrs", interval: 86400 };
  const mrsIP = { type: "http", behavior: "ipcidr", format: "mrs", interval: 86400 };
  const r66 = "https://fastly.jsdelivr.net/gh/666OS/rules@release/mihomo";

  newConfig["rule-providers"] = {
    Direct: { ...mrs, url: `${r66}/domain/Direct.mrs`, path: "./rules/Direct.mrs" },
    Private: { ...mrs, url: `${r66}/domain/Private.mrs`, path: "./rules/Private.mrs", "path-in-bundle": "geo/geosite/private.mrs" },
    ...(ruleOptionsEnable.YouTube ? { YouTube: { ...mrs, url: `${r66}/domain/YouTube.mrs`, path: "./rules/YouTube.mrs" } } : {}),
    ...(ruleOptionsEnable.Spotify ? { Spotify: { ...mrs, url: `${r66}/domain/Spotify.mrs`, path: "./rules/Spotify.mrs" } } : {}),
    ...(ruleOptionsEnable.Telegram ? { Telegram: { ...mrs, url: `${r66}/domain/Telegram.mrs`, path: "./rules/Telegram.mrs" } } : {}),
    ...(ruleOptionsEnable.Games ? { Games: { ...mrs, url: `${r66}/domain/Games.mrs`, path: "./rules/Games.mrs" } } : {}),
    ...(ruleOptionsEnable.PayPal ? { PayPal: { ...mrs, url: `${r66}/domain/PayPal.mrs`, path: "./rules/PayPal.mrs" } } : {}),
    ...(ruleOptionsEnable.X ? { Twitter: { ...mrs, url: `${r66}/domain/Twitter.mrs`, path: "./rules/Twitter.mrs" } } : {}),
    ...(ruleOptionsEnable.OpenAI ? { OpenAI: { ...mrs, url: `${r66}/domain/OpenAI.mrs`, path: "./rules/OpenAI.mrs" } } : {}),
    ...(ruleOptionsEnable.AI ? { AI: { ...mrs, url: `${r66}/domain/AI.mrs`, path: "./rules/AI.mrs" } } : {}),
    ...(ruleOptionsEnable.Apple ? {
      AppleCN: { ...mrs, url: `${r66}/domain/AppleCN.mrs`, path: "./rules/AppleCN.mrs" },
      Apple: { ...mrs, url: `${r66}/domain/Apple.mrs`, path: "./rules/Apple.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Netflix ? {
      Netflix: { ...mrs, url: `${r66}/domain/Netflix.mrs`, path: "./rules/Netflix.mrs" },
      NetflixIP: { ...mrsIP, url: `${r66}/ip/Netflix.mrs`, path: "./rules/NetflixIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Emby ? {
      Emby: { ...mrs, url: `${r66}/domain/Emby.mrs`, path: "./rules/Emby.mrs" },
      EmbyIP: { ...mrsIP, url: `${r66}/ip/Emby.mrs`, path: "./rules/EmbyIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Google ? { Google: { ...mrs, url: `${r66}/domain/Google.mrs`, path: "./rules/Google.mrs" } } : {}),
    gfw: { ...mrs, url: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/gfw.mrs", path: "./rules/gfw.mrs" },
    'geolocation-cn': { ...mrs, url: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/geolocation-cn.mrs", path: "./rules/geolocation-cn.mrs" },
    ChinaIP: { ...mrsIP, url: `${r66}/ip/China.mrs`, path: "./rules/ChinaIP.mrs" },
    ...(ruleOptionsEnable.AI ? { AIIP: { ...mrsIP, url: `${r66}/ip/AI.mrs`, path: "./rules/AIIP.mrs" } } : {}),
    ...(ruleOptionsEnable.Google ? { GoogleIP: { ...mrsIP, url: `${r66}/ip/Google.mrs`, path: "./rules/GoogleIP.mrs" } } : {}),
    ProxyIP: { ...mrsIP, url: `${r66}/ip/Proxy.mrs`, path: "./rules/ProxyIP.mrs" },
    ...(ruleOptionsEnable.Telegram ? { TelegramIP: { ...mrsIP, url: `${r66}/ip/Telegram.mrs`, path: "./rules/TelegramIP.mrs" } } : {}),
    PrivateIP: { ...mrsIP, url: `${r66}/ip/Private.mrs`, path: "./rules/PrivateIP.mrs", "path-in-bundle": "geo/geoip/private.mrs" },
    fakeip_filter: { ...mrs, url: "https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs", path: "./rules/fakeip_filter.mrs", "path-in-bundle": "geo/geosite/private.mrs" },
    cn: { ...mrs, url: "https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/direct.mrs", path: "./rules/cn.mrs" },
    cn_additional: { ...mrs, url: "https://static-file-global.353355.xyz/rules/cn-additional-list.mrs", path: "./rules/cn_additional.mrs" },
  };

  newConfig.rules = [
    "RULE-SET,Direct,直连",
    "RULE-SET,Private,直连",
    ...(ruleOptionsEnable.Apple ? ["RULE-SET,AppleCN,直连"] : []),
    "DOMAIN-SUFFIX,hdslb.com,直连",
    ...(ruleOptionsEnable.屏蔽国外QUIC ? [
      "AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,geolocation-cn),(RULE-SET,cn_additional),(RULE-SET,ChinaIP,no-resolve)))))),REJECT"
    ] : []),
    ...(ruleOptionsEnable.OpenAI ? ["RULE-SET,OpenAI,OpenAI"] : []),
    ...(ruleOptionsEnable.AI ? ["RULE-SET,AI,AI"] : []),
    ...(ruleOptionsEnable.YouTube ? ["RULE-SET,YouTube,YouTube"] : []),
    ...(ruleOptionsEnable.Google ? ["RULE-SET,Google,Google"] : []),
    ...(ruleOptionsEnable.Spotify ? ["RULE-SET,Spotify,Spotify"] : []),
    ...(ruleOptionsEnable.Telegram ? ["RULE-SET,Telegram,Telegram"] : []),
    ...(ruleOptionsEnable.Games ? ["RULE-SET,Games,Games"] : []),
    ...(ruleOptionsEnable.PayPal ? ["RULE-SET,PayPal,PayPal"] : []),
    ...(ruleOptionsEnable.X ? ["RULE-SET,Twitter,X"] : []),
    ...(ruleOptionsEnable.Apple ? ["RULE-SET,Apple,Apple"] : []),
    ...(ruleOptionsEnable.Netflix ? [
      "RULE-SET,Netflix,Netflix",
      "RULE-SET,NetflixIP,Netflix"
    ] : []),
    ...(ruleOptionsEnable.Emby ? [
      "DOMAIN-SUFFIX,nubebelle.com,Emby",
      "PROCESS-NAME,com.mb.android,Emby",
      "PROCESS-NAME,tv.emby.embyatv,Emby",
      "PROCESS-NAME,com.hush.yamby,Emby",
      "PROCESS-NAME,com.jellycine.app,Emby",
      "PROCESS-NAME,com.mountains.hills,Emby",
      "RULE-SET,Emby,Emby",
      "RULE-SET,EmbyIP,Emby"
    ] : []),
    "RULE-SET,gfw,Proxies",
    "RULE-SET,geolocation-cn,直连",
    "RULE-SET,cn_additional,直连",
    "RULE-SET,PrivateIP,直连,no-resolve",
    ...(ruleOptionsEnable.AI ? ["RULE-SET,AIIP,AI,no-resolve"] : []),
    ...(ruleOptionsEnable.Google ? ["RULE-SET,GoogleIP,Google,no-resolve"] : []),
    ...(ruleOptionsEnable.Telegram ? ["RULE-SET,TelegramIP,Telegram,no-resolve"] : []),
    "RULE-SET,ProxyIP,Proxies,no-resolve",
    "RULE-SET,ChinaIP,直连",
    "GEOIP,CN,直连",
    "MATCH,Final"
  ];

  return newConfig;
}