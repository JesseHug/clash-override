/**
 * mihomo配置覆写脚本（极致轻量定制版）
 * 仓库：https://github.com/JesseHug/clash-override
 * 核心基建：最新标准脚本模板（严谨 DNS 防污染、新增防 PCDN Hosts 映射）
 * 策略与规则：纯净 url-test 自动测速、地区优选、倍率过滤、AI防劫持、FCM直接指向Proxies
 * 优化说明：彻底剥离 Smart/GeoData；AI 与 Spotify 策略组已硬编码强制指定默认选区
 */

// ==========================================
// ★ 核心开关区域 ★
// ==========================================
const excludeHighRateProxiesEnable = false;

// ==========================================
// ★ 节点匹配正则定义 ★
// ==========================================
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/u;
const lowRateRegex = /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<!\d)0\.[0-5]|下载|低倍)/;
const highRateRegex = /(?:[*×xX✕✖⨉]\s*(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?\s*(?:倍|[*×xX✕✖⨉]))/u;

function main(config) {
  const newConfig = {};

  // ==========================================
  // 1. 节点过滤与倍率剔除逻辑
  // ==========================================
  if (Array.isArray(config.proxies)) {
    config.proxies = config.proxies.filter(proxy => {
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

  // ==========================================
  // 2. 基础网络配置
  // ==========================================
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

  // ==========================================
  // 3. 严谨 DNS 提取策略 (防污染)
  // ==========================================
  const originalDnsConfig = config.dns || {};

  const commonDnsRegex =
    /(223\.5\.5\.5|223\.6\.6\.6|119\.29\.29\.29|1\.12\.12\.12|120\.53\.53\.53|114\.114\.114\.114|180\.76\.76\.76|1\.1\.1\.1|1\.0\.0\.1|8\.8\.8\.8|8\.8\.4\.4|94\.140\.14\.14|94\.140\.15\.15|alidns|doh\.pub|dot\.pub|dnspod|dns\.baidu|dns\.google|cloudflare|adguard|system)/i;

  const originalProxyServerNameserver = (originalDnsConfig['proxy-server-nameserver'] || []).filter(
    (dns) => !commonDnsRegex.test(String(dns)),
  );

  const originalPolicyNameserver = {};

  for (const policy of [
    originalDnsConfig['proxy-server-nameserver-policy'] || {},
    originalDnsConfig['nameserver-policy'] || {},
  ]) {
    for (const [rule, dns] of Object.entries(policy)) {
      const dnsList = Array.isArray(dns) ? dns : [dns];

      if (dnsList.some((item) => commonDnsRegex.test(String(item)))) {
        continue;
      }
      originalPolicyNameserver[rule] = dns;
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
    'proxy-server-nameserver': [
      ...(originalProxyServerNameserver.length > 0 ? originalProxyServerNameserver : chinaDNS),
    ],
    ...(Object.keys(originalPolicyNameserver).length > 0 && {
      'proxy-server-nameserver-policy': originalPolicyNameserver,
    }),
    'default-nameserver': ['223.5.5.5', '119.29.29.29'],
    nameserver: [...foreignDNS],
    'nameserver-policy': {
      'rule-set:ChinaDomain,cn_additional': [...chinaDNS],
    },
    'direct-nameserver': ['system', '223.5.5.5', '119.29.29.29'],
  };

  newConfig['hosts'] = {
    'dns.alidns.com': ['223.5.5.5', '223.6.6.6'],
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'dns.cloudflare.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': ['services.googleapis.com'],
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
  };

  newConfig['ntp'] = { enable: true, 'write-to-system': false, server: 'ntp.aliyun.com', port: 123, interval: 60 };
  newConfig['tun'] = { enable: true, stack: 'system', 'auto-route': true, 'strict-route': true, 'auto-redirect': true, 'auto-detect-interface': true, 'dns-hijack': ['any:53', 'tcp://any:53'] };

  newConfig['proxies'] = [...proxies];

  // ==========================================
  // 4. 构建策略组
  // ==========================================
  const pNames = proxies.map(p => p.name);
  const getNodes = (reg) => {
    const res = pNames.filter(name => reg.test(name));
    return res.length > 0 ? res : ["DIRECT"];
  };

  const healthCheckUrl = "https://g.cn/generate_204";
  const autoBaseOption = { type: "url-test", url: healthCheckUrl, interval: 600, tolerance: 50, lazy: true, timeout: 3000 };
  const ico = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color";

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

  regionMappings.forEach(r => {
    const nodes = getNodes(r.regex);
    if (nodes[0] !== "DIRECT") {
      activeRegions.push(r.key);
      const autoName = `${r.key}-自动选择`;
      regionAutoGroups.push({ name: autoName, proxies: nodes, hidden: true, ...autoBaseOption });
      regionGroups.push({ name: r.key, type: "select", icon: `${ico}/${r.icon}`, proxies: [autoName, ...nodes] });
    }
  });

  const nodesOther = pNames.filter(n => !/港|HK|HongKong|坡|SG|Singapore|台|TW|Taiwan|日|JP|Japan|美|US|UnitedStates|韩|KR|KOR|Korea|法|FR|德|DE|英|GB|UK|NL|EU|Europe/i.test(n) && !lowRateRegex.test(n) && !highRateRegex.test(n));
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

  newConfig["proxy-groups"] = [
    { name: "Proxies", type: "select", icon: ico + "/Global.png", proxies: [masterName, ...activeRegions, ...pNames] },
    { name: "Google", type: "select", icon: `${ico}/Google.png`, proxies: ["Proxies", ...activeRegions] },
    { name: "YouTube", type: "select", icon: `${ico}/YouTube.png`, proxies: ["Proxies", ...activeRegions] },

    // 【修改点】：硬编码锁定 Spotify 为 TW
    { name: "Spotify", type: "select", icon: `${ico}/Spotify.png`, proxies: ["Proxies", "DIRECT", ...activeRegions], "default-selected": "TW" },

    { name: "Telegram", type: "select", icon: `${ico}/Telegram_X.png`, proxies: ["Proxies", ...activeRegions] },
    { name: "Games", type: "select", icon: `${ico}/Game.png`, proxies: ["Proxies", "DIRECT", ...activeRegions] },
    { name: "PayPal", type: "select", icon: `${ico}/PayPal.png`, proxies: ["Proxies", "DIRECT", ...activeRegions] },
    { name: "X", type: "select", icon: `${ico}/X.png`, proxies: ["Proxies", ...activeRegions] },

    // 【修改点】：硬编码锁定 OpenAI 与 AI 为 US
    { name: "OpenAI", type: "select", icon: `${ico}/ChatGPT.png`, proxies: ["Proxies", ...activeRegions], "default-selected": "US" },
    { name: "AI", type: "select", icon: `${ico}/AI.png`, proxies: ["Proxies", ...activeRegions], "default-selected": "US" },

    { name: "Apple", type: "select", icon: `${ico}/Apple.png`, proxies: ["Proxies", "DIRECT", ...activeRegions] },
    { name: "Final", type: "select", icon: `${ico}/Final.png`, proxies: ["Proxies", "DIRECT"] },

    { name: masterName, icon: `${ico}/Auto.png`, proxies: activeRegions, ...autoBaseOption },
    ...regionGroups,
    ...regionAutoGroups
  ];

  // ==========================================
  // 5. Rule Providers (纯净 666OS 体系)
  // ==========================================
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

  // ==========================================
  // 6. 路由分流规则 (FCM 彻底交由 Google 规则处理)
  // ==========================================
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