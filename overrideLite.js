/**
 * mihomo 极简配置覆写脚本 (Lite)
 * 仓库：https://github.com/JesseHug/clash-override
 * 特点：仅保留【国内】、【国外】、【AI】三大核心策略组（加自动测速与兜底）
 * 适用于：Bettbox / Clash Verge Rev / Mihomo Party 等客户端的脚本覆写
 */

// 直连节点
const directProxies = [
  { name: '🇨🇳 直连 | 双栈', type: 'direct' },
  { name: '🇨🇳 直连 | IPv4优先', type: 'direct', 'ip-version': 'ipv4-prefer' },
  { name: '🇨🇳 直连 | IPv6优先', type: 'direct', 'ip-version': 'ipv6-prefer' },
];

// 排除广告、通知、流量等无关节点
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用(?:官网|地址|网址|域名|发布|群|渠道)|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\.me\/\+|\bexpire\b|\bhttps?:\/\/|\.com|\btraffic\b/iu;

function matchDomainPattern(pattern, domains) {
  pattern = pattern.toLowerCase();
  if (!pattern.includes('*') && !pattern.startsWith('+.') && !pattern.startsWith('.')) {
    return typeof domains === 'string' ? domains.toLowerCase() === pattern : domains.has(pattern);
  }
  const domainList = typeof domains === 'string' ? [domains.toLowerCase()] : [...domains];
  if (pattern.startsWith('+.')) {
    const suffix = pattern.slice(2);
    return domainList.some((domain) => domain === suffix || domain.endsWith(`.${suffix}`));
  }
  if (pattern.startsWith('.')) {
    const suffix = pattern.slice(1);
    return domainList.some((domain) => domain !== suffix && domain.endsWith(`.${suffix}`));
  }
  const patternParts = pattern.split('.');
  return domainList.some((domain) => {
    const domainParts = domain.split('.');
    return (
      patternParts.length === domainParts.length &&
      patternParts.every((part, index) => part === '*' || part === domainParts[index])
    );
  });
}

function hostSpecificity(pattern) {
  if (pattern.startsWith('+.')) return 2;
  if (pattern.startsWith('.')) return 1;
  if (pattern.includes('*')) return 0;
  return 3;
}

function applyHostsToProxies(proxies, hosts) {
  if (!hosts || typeof hosts !== 'object') return proxies;
  const hostEntries = Object.entries(hosts)
    .filter(([, value]) => (typeof value === 'string' && value.length > 0) || (Array.isArray(value) && value.length > 0))
    .sort((a, b) => hostSpecificity(b[0]) - hostSpecificity(a[0]));

  if (hostEntries.length === 0) return proxies;
  const targetOf = (value) => {
    if (Array.isArray(value)) value = value.find((v) => typeof v === 'string' && v.length > 0);
    return typeof value === 'string' && value.length > 0 ? value : null;
  };

  const resolveCache = new Map();
  const resolve = (server) => {
    const cached = resolveCache.get(server);
    if (cached !== undefined) return cached;
    const seen = new Set();
    let current = server.toLowerCase();
    let result = server;
    while (!seen.has(current)) {
      seen.add(current);
      const entry = hostEntries.find(([pattern]) => matchDomainPattern(pattern, current));
      const target = entry && targetOf(entry[1]);
      if (!target) break;
      result = target;
      current = target.toLowerCase();
    }
    resolveCache.set(server, result);
    return result;
  };

  return proxies.map((proxy) => {
    if (typeof proxy.server !== 'string') return proxy;
    const server = resolve(proxy.server);
    return server === proxy.server ? proxy : { ...proxy, server };
  });
}

function filterAndNormalizeProxies(config) {
  const seen = new Set();
  const proxies = (config && Array.isArray(config.proxies) ? config.proxies : [])
    .filter((p) => p && typeof p.name === 'string' && !excludeFilter.test(p.name))
    .map((p) => {
      let name = p.name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      let uniqueName = name;
      let counter = 1;
      while (seen.has(uniqueName)) {
        uniqueName = `${name} (${counter++})`;
      }
      seen.add(uniqueName);
      return { ...p, name: uniqueName };
    });

  return applyHostsToProxies(proxies, config && config.hosts);
}

function main(config) {
  const newConfig = {};
  const proxies = filterAndNormalizeProxies(config);
  const proxyNames = proxies.map((p) => p.name);

  // 基础配置
  newConfig['mixed-port'] = 7890;
  newConfig['allow-lan'] = true;
  newConfig['ipv6'] = true;
  newConfig['mode'] = 'rule';
  newConfig['log-level'] = 'warning';
  newConfig['unified-delay'] = true;
  newConfig['tcp-concurrent'] = true;
  newConfig['find-process-mode'] = 'strict';
  newConfig['keep-alive-interval'] = 60;

  // 外部控制
  newConfig['external-controller'] = '127.0.0.1:9090';
  newConfig['external-ui'] = 'ui';
  newConfig['external-ui-url'] = 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip';
  newConfig['external-ui-name'] = 'zashboard';

  newConfig['profile'] = { 'store-selected': true, 'store-fake-ip': true };
  newConfig['ntp'] = { enable: true, 'write-to-system': false, server: 'ntp.aliyun.com', port: 123, interval: 60 };
  newConfig['tun'] = {
    enable: false,
    stack: 'mips',
    'auto-route': true,
    'strict-route': true,
    'auto-redirect': true,
    'auto-detect-interface': true,
    'dns-hijack': ['any:53', 'tcp://any:53'],
  };

  newConfig['sniffer'] = {
    enable: true,
    sniff: {
      TLS: { ports: [443, 8443] },
      HTTP: { ports: [80, '8080-8880'], 'override-destination': true },
    },
    'skip-domain': ['Mijia Cloud', '+.push.apple.com'],
  };

  // Hosts
  newConfig['hosts'] = {
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'services.googleapis.cn': 'services.googleapis.com',
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
  };

  // DNS
  const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
  const foreignDNS = ['https://cloudflare-dns.com/dns-query#国外', 'https://dns.google/dns-query#国外'];
  const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
  const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];

  newConfig['dns'] = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    'fake-ip-filter': ['rule-set:private', 'rule-set:fakeip_filter', 'rule-set:geolocation-cn'],
    'default-nameserver': defaultDNS,
    'proxy-server-nameserver': proxyServerDNS,
    nameserver: foreignDNS,
    'nameserver-policy': {
      'rule-set:private': 'system',
      'rule-set:douyin': ['system', '180.184.1.1', '180.184.2.2'],
      'rule-set:cn': chinaDNS,
    },
    'direct-nameserver': chinaDNS,
    'direct-nameserver-follow-policy': true,
  };

  // 节点清单
  newConfig['proxies'] = [...proxies, ...directProxies];

  // 策略组定义 (仅保留 国内、国外、AI、自动选择、漏网之鱼)
  const icoSvg = 'https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg';
  const autoGroup = {
    name: '自动选择',
    type: 'url-test',
    url: 'https://www.apple.com/library/test/success.html',
    interval: 300,
    tolerance: 50,
    lazy: true,
    timeout: 3000,
    'max-failed-times': 3,
    'empty-fallback': 'REJECT',
    proxies: proxyNames.length > 0 ? proxyNames : ['DIRECT'],
    icon: `${icoSvg}/Auto.svg`,
  };

  const foreignGroup = {
    name: '国外',
    type: 'select',
    proxies: ['自动选择', '🇨🇳 直连 | 双栈', ...proxyNames],
    icon: `${icoSvg}/Proxy.svg`,
  };

  const chinaGroup = {
    name: '国内',
    type: 'select',
    proxies: ['🇨🇳 直连 | 双栈', '🇨🇳 直连 | IPv4优先', '🇨🇳 直连 | IPv6优先', '国外'],
    icon: `${icoSvg}/China.svg`,
  };

  const aiGroup = {
    name: 'AI',
    type: 'select',
    proxies: ['国外', '自动选择', ...proxyNames],
    icon: `${icoSvg}/OpenAI.svg`,
  };

  const finalGroup = {
    name: '漏网之鱼',
    type: 'select',
    proxies: ['国外', '国内'],
    icon: `${icoSvg}/Stack.svg`,
  };

  newConfig['proxy-groups'] = [foreignGroup, chinaGroup, aiGroup, autoGroup, finalGroup];

  // 规则集
  const mrs = { type: 'http', behavior: 'domain', format: 'mrs', interval: 86400 };
  const mrsIP = { type: 'http', behavior: 'ipcidr', format: 'mrs', interval: 86400 };
  const rBett = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta';

  newConfig['rule-providers'] = {
    private: { ...mrs, url: `${rBett}/geo/geosite/private.mrs`, path: './ruleset/private.mrs' },
    private_ip: { ...mrsIP, url: `${rBett}/geo/geoip/private.mrs`, path: './ruleset/private_ip.mrs' },
    'geolocation-cn': { ...mrs, url: `${rBett}/geo/geosite/geolocation-cn.mrs`, path: './ruleset/geolocation-cn.mrs' },
    cn_ip: { ...mrsIP, url: `${rBett}/geo/geoip/cn.mrs`, path: './ruleset/cn_ip.mrs' },
    cn_additional: { ...mrs, url: 'https://static-file-global.353355.xyz/rules/cn-additional-list.mrs', path: './ruleset/cn-additional-list.mrs' },
    cn: { ...mrs, url: `${rBett}/geo/geosite/cn.mrs`, path: './ruleset/cn.mrs' },
    douyin: { ...mrs, url: `${rBett}/geo/geosite/douyin.mrs`, path: './ruleset/douyin.mrs' },
    fakeip_filter: { ...mrs, url: `${rBett}/geo/geosite/fakeip-filter.mrs`, path: './ruleset/fakeip-filter.mrs' },
    games_cn: { ...mrs, url: `${rBett}/geo/geosite/category-games@cn.mrs`, path: './ruleset/category-games@cn.mrs' },
    epicgames: { ...mrs, url: `${rBett}/geo/geosite/epicgames.mrs`, path: './ruleset/epicgames.mrs' },
    apple_cn: { ...mrs, url: `${rBett}/geo/geosite/apple@cn.mrs`, path: './ruleset/apple@cn.mrs' },
    microsoft_cn: { ...mrs, url: `${rBett}/geo/geosite/microsoft@cn.mrs`, path: './ruleset/microsoft@cn.mrs' },
    'category-ads': { ...mrs, url: `${rBett}/geo/geosite/category-ads.mrs`, path: './ruleset/category-ads.mrs' },
    openai: { ...mrs, url: `${rBett}/geo/geosite/openai.mrs`, path: './ruleset/openai.mrs' },
    ai: { ...mrs, url: `${rBett}/geo/geosite/category-ai-!cn.mrs`, path: './ruleset/ai.mrs' },
    ai_ip: { ...mrsIP, url: `${rBett}/geo/geoip/ai.mrs`, path: './ruleset/ai_ip.mrs' },
    'geolocation-!cn': { ...mrs, url: `${rBett}/geo/geosite/geolocation-!cn.mrs`, path: './ruleset/geolocation-!cn.mrs' },
    iptv_domain: { ...mrs, url: 'https://cdn.jsdmirror.com/gh/marcuccilli/gary@main/iptv_mihomo_domain.mrs', path: './ruleset/iptv_domain.mrs' },
    iptv_ip: { ...mrsIP, url: 'https://cdn.jsdmirror.com/gh/marcuccilli/gary@main/iptv_mihomo_ipcidr.mrs', path: './ruleset/iptv_ip.mrs' },
  };

  // 路由分流规则
  newConfig['rules'] = [
    'DOMAIN,github.com,国外',
    'DOMAIN,raw.githubusercontent.com,国外',
    'DOMAIN,cdn.jsdelivr.net,国外',
    'DOMAIN,cdn.jsdmirror.com,国外',

    'IP-CIDR,223.5.5.5/32,国内,no-resolve',
    'IP-CIDR,223.6.6.6/32,国内,no-resolve',
    'IP-CIDR,119.29.29.29/32,国内,no-resolve',
    'IP-CIDR,180.184.1.1/32,国内,no-resolve',
    'IP-CIDR,180.184.2.2/32,国内,no-resolve',
    'IP-CIDR,114.114.114.114/32,国内,no-resolve',
    'IP-CIDR,114.114.115.115/32,国内,no-resolve',
    'IP-CIDR,1.12.12.12/32,国内,no-resolve',
    'IP-CIDR,120.53.53.53/32,国内,no-resolve',

    'RULE-SET,private,国内',
    'RULE-SET,private_ip,国内,no-resolve',

    'RULE-SET,geolocation-cn,国内',
    'RULE-SET,cn_additional,国内',
    'RULE-SET,games_cn,国内',
    'RULE-SET,epicgames,国内',
    'RULE-SET,apple_cn,国内',
    'RULE-SET,microsoft_cn,国内',
    'DOMAIN,fsend.cn,国内',
    'DOMAIN,international-gfe.download.nvidia.com,国内',
    'DOMAIN-SUFFIX,ctaiot.com,国内',

    'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,cn_additional),(RULE-SET,cn_ip,no-resolve)))))),REJECT',
    'RULE-SET,category-ads,REJECT',

    'RULE-SET,openai,AI',
    'RULE-SET,ai,AI',
    'RULE-SET,ai_ip,AI,no-resolve',

    'RULE-SET,iptv_domain,国外',
    'RULE-SET,iptv_ip,国外,no-resolve',

    'RULE-SET,geolocation-!cn,国外',
    'RULE-SET,cn_ip,国内',
    'MATCH,漏网之鱼',
  ];

  return newConfig;
}
