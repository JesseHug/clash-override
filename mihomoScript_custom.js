/**
 * mihomo配置覆写脚本（全量版）
 * 作者：AIsouler
 * 原仓库：https://github.com/AIsouler/MyClash
 * 脚本链接：https://raw.githubusercontent.com/AIsouler/MyClash/main/Script/mihomoScript.js
 * 友情推荐，非常好用、省电且内存占用低的代理软件：https://github.com/appshubcc/Bettbox
 */

// --- 静态配置区域 ---

/**
 * 分流策略组启用配置，若不需要某个策略组，请设为 false
 * true = 启用
 * false = 禁用
 */
const ruleOptionsEnable = {
  OpenAI: true, AI: true, YouTube: true, Google: true, Spotify: true,
  Telegram: true, Games: true, PayPal: true, Twitter: true, Apple: true, Proxies: true
};

/**
 * 全局排除高倍率节点配置
 * 该配置用于启用全局排除高倍率节点功能
 * true = 启用
 * false = 禁用
 */
const excludeHighRateProxiesEnable = false;

// 定义全局排除节点的正则表达式，用于排除非地区的信息节点
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|traffic|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/iu;

// 预定义 rules
const rules = [
  'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,ChinaDomain),(RULE-SET,cn_additional),(RULE-SET,ChinaIP,no-resolve)))))),REJECT',
  'RULE-SET,Direct,DIRECT',
  'RULE-SET,Private,DIRECT',
  'RULE-SET,PrivateIP,DIRECT,no-resolve',
  'RULE-SET,AppleCN,DIRECT'
];

// 定义地区策略组
const regionDefinitions = [
  { name: 'HK', regex: /🇭🇰|港|HK|[Hh]ong\s*[Kk]ong/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png' },
  { name: 'SG', regex: /🇸🇬|坡|SG|[Ss]ingapore/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png' },
  { name: 'TW', regex: /🇹🇼|台|TW|[Tt]aiwan/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png' },
  { name: 'JP', regex: /🇯🇵|日|JP|[Jj]apan/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png' },
  { name: 'US', regex: /🇺🇸|美|US|[Uu]nited\s*[Ss]tates/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png' },
  { name: 'KR', regex: /🇰🇷|韩|KR|KOR|[Kk]orea/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png' },
  { name: 'EU', regex: /🇪🇺|法|德|英|荷|FR|DE|GB|UK|NL|EU|Europe|Frankfurt|London|Paris|Amsterdam/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/European_Union.png' },
  { name: '低倍率节点', regex: /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<!\d)0\.[0-5]|下载|低倍|实验性)/, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Available_1.png' },
  { name: '高倍率节点', regex: /(?:[*×xX✕✖⨉]\s*(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?\s*(?:倍|[*×xX✕✖⨉]))/u, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png' }
];

// Rule Providers 通用配置
const ruleProviderCommonDomain = {
  type: 'http',
  format: 'mrs',
  interval: 86400,
  behavior: 'domain',
};
const ruleProviderCommonIpcidr = {
  type: 'http',
  format: 'mrs',
  interval: 86400,
  behavior: 'ipcidr',
};

// 定义基础 Rule Providers
const baseRuleProviders = {
  Direct: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Direct.mrs', path: './ruleset/Direct.mrs' },
  Private: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Private.mrs', path: './ruleset/Private.mrs' },
  PrivateIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Private.mrs', path: './ruleset/PrivateIP.mrs' },
  AppleCN: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/AppleCN.mrs', path: './ruleset/AppleCN.mrs' },
  ChinaDomain: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/China.mrs', path: './ruleset/ChinaDomain.mrs' },
  ChinaIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/China.mrs', path: './ruleset/ChinaIP.mrs' },
  fakeip_filter: { ...ruleProviderCommonDomain, url: 'https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs', path: './ruleset/fakeip_filter.mrs' },
  cn_additional: { ...ruleProviderCommonDomain, url: 'https://static-file-global.353355.xyz/rules/cn-additional-list.mrs', path: './ruleset/cn_additional.mrs' }
};

// 策略组公共配置
const groupBaseOption = {
  interval: 600,
  timeout: 3000,
  url: 'https://g.cn/generate_204',
  lazy: true,
  'max-failed-times': 3,
  'empty-fallback': 'REJECT',
};

// select策略组通用配置
const selectBaseOption = {
  ...groupBaseOption,
  type: 'select',
  hidden: false,
};

// url-test策略组通用配置
const urlTestBaseOption = {
  ...groupBaseOption,
  type: 'url-test',
  tolerance: 50,
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png',
  hidden: true,
};

// load-balance策略组通用配置
const loadBalanceBaseOption = {
  ...groupBaseOption,
  type: 'load-balance',
  strategy: 'sticky-sessions',
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Round_Robin.png',
  hidden: true,
};

// 定义分流策略组配置
const serviceConfigs = [
  { name: 'OpenAI', defaultSelected: 'US', providers: { OpenAI: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/OpenAI.mrs', path: './ruleset/OpenAI.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png', rules: ['RULE-SET,OpenAI,OpenAI'] },
  { name: 'AI', defaultSelected: 'US', providers: { AI: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/AI.mrs', path: './ruleset/AI.mrs' }, AIIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/AI.mrs', path: './ruleset/AIIP.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png', rules: ['RULE-SET,AI,AI', 'RULE-SET,AIIP,AI,no-resolve'] },
  { name: 'YouTube', providers: { YouTube: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/YouTube.mrs', path: './ruleset/YouTube.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png', rules: ['RULE-SET,YouTube,YouTube'] },
  { name: 'Google', providers: { Google: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Google.mrs', path: './ruleset/Google.mrs' }, GoogleIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Google.mrs', path: './ruleset/GoogleIP.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png', rules: ['RULE-SET,Google,Google', 'RULE-SET,GoogleIP,Google,no-resolve'] },
  { name: 'Spotify', defaultSelected: 'TW', direct: true, providers: { Spotify: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Spotify.mrs', path: './ruleset/Spotify.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png', rules: ['RULE-SET,Spotify,Spotify'] },
  { name: 'Telegram', providers: { Telegram: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Telegram.mrs', path: './ruleset/Telegram.mrs' }, TelegramIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Telegram.mrs', path: './ruleset/TelegramIP.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram_X.png', rules: ['RULE-SET,Telegram,Telegram', 'RULE-SET,TelegramIP,Telegram,no-resolve'] },
  { name: 'Games', direct: true, providers: { Games: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Games.mrs', path: './ruleset/Games.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Game.png', rules: ['RULE-SET,Games,Games'] },
  { name: 'PayPal', direct: true, providers: { PayPal: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/PayPal.mrs', path: './ruleset/PayPal.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/PayPal.png', rules: ['RULE-SET,PayPal,PayPal'] },
  { name: 'Twitter', providers: { Twitter: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Twitter.mrs', path: './ruleset/Twitter.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/X.png', rules: ['RULE-SET,Twitter,Twitter'] },
  { name: 'Apple', direct: true, providers: { Apple: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Apple.mrs', path: './ruleset/Apple.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png', rules: ['RULE-SET,Apple,Apple'] },
  { name: 'Proxies', providers: { ProxiesProvider: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Proxy.mrs', path: './ruleset/Proxies.mrs' }, ProxyIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Proxy.mrs', path: './ruleset/ProxyIP.mrs' } }, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png', rules: ['RULE-SET,ProxiesProvider,Proxies', 'RULE-SET,ProxyIP,Proxies,no-resolve'] }
];

// 定义创建地区策略组的函数
function createRegionGroup(name, icon, proxies) {
  const urlTestName = `${name}-自动选择`;
  return [
    {
      ...urlTestBaseOption,
      name: urlTestName,
      proxies,
    },
    {
      ...selectBaseOption,
      name,
      icon,
      proxies: [urlTestName, ...proxies],
    },
  ];
}

// --- 主入口 ---

function main(config) {
  const newConfig = {};

  const highRateRegex = excludeHighRateProxiesEnable
    ? regionDefinitions.find((r) => r.name === '高倍率节点')?.regex
    : null;

  // 过滤节点列表
  const filteredProxies = (config.proxies || []).filter((proxy) => {
    const type = String(proxy.type ?? '').toLowerCase();
    return (
      type !== 'direct' && type !== 'reject' && !excludeFilter.test(proxy.name) && !highRateRegex?.test(proxy.name)
    );
  });

  // 验证节点列表是否存在代理节点
  if (!filteredProxies.length) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  // --- 构建地区组和倍率组 ---

  // 节点分类
  const regionGroups = Object.fromEntries(regionDefinitions.map((r) => [r.name, { ...r, proxies: [] }]));
  const otherProxies = [];

  for (const proxy of filteredProxies) {
    let matched = false;
    for (const region of regionDefinitions) {
      if (region.regex.test(proxy.name)) {
        regionGroups[region.name].proxies.push(proxy.name);

        // 如果匹配到的是地区组（非倍率组），则标记为已分类
        if (region.name !== '低倍率节点' && region.name !== '高倍率节点') {
          matched = true;
        }
      }
    }

    // 未匹配到地区组（不包含倍率组）的归为其他节点
    if (!matched) {
      otherProxies.push(proxy.name);
    }
  }

  // 构建地区策略组
  const generatedRegionGroups = regionDefinitions
    .filter((r) => regionGroups[r.name].proxies.length > 0)
    .flatMap((r) => createRegionGroup(r.name, r.icon, regionGroups[r.name].proxies));

  if (otherProxies.length > 0) {
    generatedRegionGroups.push(
      ...createRegionGroup(
        'Other',
        'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/World_Map.png',
        otherProxies,
      ),
    );
  }

  // --- 构建分流策略组 ---

  const functionalGroups = [];
  const finalRules = [...rules];
  const finalRuleProviders = { ...baseRuleProviders };

  // 筛选类型为 select 的地区策略组
  const groupNamesOfSelect = generatedRegionGroups.filter((g) => g.type === 'select').map((g) => g.name);

  // 生成基础策略组
  functionalGroups.push(
    {
      ...selectBaseOption,
      name: 'Proxies',
      proxies: ['Auto', ...groupNamesOfSelect],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png',
    },
    
    {
      ...urlTestBaseOption,
      name: 'Auto',
      'include-all': true,
    },
    
  );

  // 构建分流策略组
  for (const svc of serviceConfigs) {
    if (!ruleOptionsEnable[svc.name]) continue;

    // 添加分流策略组对应的 Rule 和 Rule Providers
    finalRules.push(...svc.rules);
    Object.assign(finalRuleProviders, svc.providers || {});

    // 添加分流策略组对应的节点列表
    const groupProxies = svc.reject
      ? ['REJECT', 'REJECT-DROP', 'PASS']
      : ['Proxies', ...(svc.direct ? ['DIRECT'] : []), ...groupNamesOfSelect];

    functionalGroups.push({
      ...selectBaseOption,
      name: svc.name,
      icon: svc.icon,
      proxies: groupProxies,
      ...(svc.defaultSelected !== undefined && {
        'default-selected': svc.defaultSelected,
      }),
    });
  }

  // 添加其他策略组
  functionalGroups.push(
    {
      ...selectBaseOption,
      name: 'Final',
      proxies: ['Proxies', 'DIRECT'],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Stack.png',
    },
    
  );

  

  // --- 添加基础配置 ---

  // ---DNS配置---

  // 读取订阅中的 DNS 配置，保留订阅中的私有 DNS
  // 用以解决部分机场使用私有 DNS 导致无法解析节点的问题
  const originalDnsConfig = config.dns || {};

  // 过滤常见的公共 DNS
  const commonDnsRegex =
    /(223\.5\.5\.5|223\.6\.6\.6|119\.29\.29\.29|1\.12\.12\.12|120\.53\.53\.53|114\.114\.114\.114|180\.76\.76\.76|1\.1\.1\.1|1\.0\.0\.1|8\.8\.8\.8|8\.8\.4\.4|94\.140\.14\.14|94\.140\.15\.15|127\.0\.0\.1|alidns|doh\.pub|dot\.pub|dnspod|dns\.baidu|dns\.google|cloudflare|adguard|system)/i;

  const originalProxyServerNameserver = (originalDnsConfig['proxy-server-nameserver'] || []).filter(
    (dns) => !commonDnsRegex.test(String(dns)),
  );

  // 合并 nameserver-policy 和 proxy-server-nameserver-policy
  // 部分机场会把节点域名解析器写到 nameserver-policy 中
  const originalPolicyNameserver = {};

  for (const policy of [
    originalDnsConfig['proxy-server-nameserver-policy'] || {}, // 优先遍历此项配置
    originalDnsConfig['nameserver-policy'] || {},
  ]) {
    for (const [rule, dns] of Object.entries(policy)) {
      const dnsList = Array.isArray(dns) ? dns : [dns];

      // 只要有一个匹配公共 DNS，就跳过整个规则
      if (dnsList.some((item) => commonDnsRegex.test(String(item)))) {
        continue;
      }

      originalPolicyNameserver[rule] = dns;
    }
  }

  // 国内外 DNS 定义
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
    'proxy-server-nameserver': [...chinaDNS, ...originalProxyServerNameserver],
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

  // ---hosts 配置---

  // 收集所有节点域名
  const proxyDomains = new Set(
    filteredProxies.filter((proxy) => typeof proxy.server === 'string').map((proxy) => proxy.server.toLowerCase()),
  );

  // 提取订阅 hosts 中与节点域名对应的记录
  const originalHosts = config.hosts || {};
  const proxyHosts = {};

  for (const [host, value] of Object.entries(originalHosts)) {
    if (proxyDomains.has(host.toLowerCase())) {
      proxyHosts[host] = value;
    }
  }

  newConfig['hosts'] = {
    'dns.alidns.com': ['223.5.5.5', '223.6.6.6'],
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'dns.cloudflare.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],

    // 解决谷歌商店无法下载的问题
    'services.googleapis.cn': ['services.googleapis.com'],

    // 屏蔽哔哩哔哩PCDN，解决访问视频卡顿问题
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],

    // 保留机场用于节点解析的 hosts
    ...proxyHosts,
  };

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

  newConfig['profile'] = {
    'store-selected': true,
    'store-fake-ip': true,
  };

  newConfig['ntp'] = {
    enable: true,
    'write-to-system': false,
    server: 'ntp.aliyun.com',
    port: 123,
    interval: 60,
  };

  newConfig['tun'] = {
    enable: true,
    stack: 'system',
    'auto-route': true,
    'strict-route': true,
    'auto-redirect': true,
    'auto-detect-interface': true,
    'dns-hijack': ['any:53', 'tcp://any:53'],
  };

  // 添加节点
  newConfig['proxies'] = [
    ...filteredProxies,
    {
      name: '🇨🇳 直连 | IPv4优先',
      type: 'direct',
      'ip-version': 'ipv4-prefer',
    },
    {
      name: '🇨🇳 直连 | IPv6优先',
      type: 'direct',
      'ip-version': 'ipv6-prefer',
    },
    {
      name: '🇨🇳 直连 | 双栈',
      type: 'direct',
    },
  ];

  newConfig['proxy-groups'] = [...functionalGroups, ...generatedRegionGroups];
  newConfig['rule-providers'] = finalRuleProviders;

  newConfig['rules'] = [
    ...finalRules,
    'RULE-SET,ChinaDomain,DIRECT',
    'RULE-SET,cn_additional,DIRECT',
    'RULE-SET,ChinaIP,DIRECT,no-resolve',
    'GEOIP,CN,DIRECT',
    'MATCH,Final'
  ];

  return newConfig;
}
