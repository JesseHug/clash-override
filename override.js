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
  一倍率归入低倍率: true,         // 将1x、1.0x等一倍率节点也归入低倍率组
  生成倍率组: true,               // 是否生成低倍率/高倍率策略组（关闭后界面更简洁）
  过滤非地区节点: true,         // 过滤掉不属于任何地区的节点（Other 组中的杂项节点）
  代理IPV4优先: false,          // 开启后所有订阅节点强制 ipv4-prefer
  代理IPV6优先: false,          // 开启后所有订阅节点强制 ipv6-prefer（与上条互斥，同时开启则不生效）
  链式代理: false,              // 启用后自建节点经机场节点中转（需配置 customizeProxies）
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

// 此处添加自定义节点，填入下方 [] 内（可选，留空则不生成"自建节点"策略组）
// 自定义节点不参与节点过滤、hosts 改写；与订阅节点（标准化后）重名时自动添加"自建-"前缀
// 示例：
// const customizeProxies = [
//   {
//     name: '自建-日本-01',
//     type: 'vmess',
//     server: '5.6.7.8',
//     port: 443,
//     uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
//     alterId: 0,
//     cipher: 'auto',
//     tls: true,
//     network: 'ws',
//     'ws-opts': {
//       path: '/path',
//       headers: { Host: 'example.com' },
//     },
//   },
// ];
const customizeProxies = [];

// 链式代理启用时，自定义节点的 dialer-proxy 引用目标
const dialerProxyName = '链式中转';

// 重名时使用的前缀
const customPrefix = '自建-';

// --- 节点匹配正则定义 ---

// 定义全局排除节点的正则表达式，用于剔除无关或失效的信息节点
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|⚠️|@|\bexpire\b|\bhttps?:\/\/|\.com|\btraffic\b/iu;
const lowRateRegex = /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<![\d.])0\.\d+|下载|低倍|实验性)/;
const oneRateRegex = /(?:(?<![\d.])(?:1|1\.0+)\s*(?:倍|[*×xX✕✖⨉]))|(?:[*×xX✕✖⨉]\s*(?:1|1\.0+)(?![\d.]))/u;
const highRateRegex = /(?:[*×xX✕✖⨉]\s*(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*))|(?:(?<![\d.])(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*)\s*(?:倍|[*×xX✕✖⨉]))/u;

const regionMappings = [
  { key: "HK", flag: "🇭🇰", regex: /🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|Hong\s*Kong/i, icon: "Hong_Kong.png" },
  { key: "SG", flag: "🇸🇬", regex: /🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|Singapore/i, icon: "Singapore.png" },
  { key: "TW", flag: "🇹🇼", regex: /🇹🇼|台湾|(?<![A-Za-z])TW(?:N)?(?![A-Za-z])|Taiwan/i, icon: "Taiwan.png" },
  { key: "JP", flag: "🇯🇵", regex: /🇯🇵|日本|(?<![A-Za-z])JPN?(?![A-Za-z])|Japan/i, icon: "Japan.png" },
  { key: "US", flag: "🇺🇸", regex: /🇺🇸|美国|(?<![A-Za-z])USA?(?![A-Za-z])|America|United\s*States/i, icon: "United_States.png" },
  { key: "MO", flag: "🇲🇴", regex: /🇲🇴|澳门|(?<![A-Za-z])(?:MO|MAC)(?![A-Za-z])|Macao|Macau/i, icon: "Macao.png" },
  { key: "EU", flag: "🇪🇺", regex: /🇪🇺|法国|德国|英国|荷兰|意大利|西班牙|匈牙利|乌克兰|(?<![A-Za-z])(?:FR|DE|GB|UK|NL|EU|IT|ES|HU|UA)(?![A-Za-z])|Europe|Frankfurt|London|Paris|Amsterdam|Milan|Madrid|Kyiv/i, icon: "European_Union.png" }
];

// --- 域名匹配工具函数 ---

function matchDomainPattern(pattern, domains) {
  pattern = pattern.toLowerCase();

  // 精确匹配
  if (!pattern.includes('*') && !pattern.startsWith('+.') && !pattern.startsWith('.')) {
    return typeof domains === 'string' ? domains.toLowerCase() === pattern : domains.has(pattern);
  }

  // 通配匹配：统一转为数组遍历（字符串时直接构建单元素数组，避免 Set 中转）
  const domainList = typeof domains === 'string' ? [domains.toLowerCase()] : [...domains];

  // +.example.com
  if (pattern.startsWith('+.')) {
    const suffix = pattern.slice(2);
    return domainList.some((domain) => domain === suffix || domain.endsWith(`.${suffix}`));
  }

  // .example.com
  if (pattern.startsWith('.')) {
    const suffix = pattern.slice(1);
    return domainList.some((domain) => domain !== suffix && domain.endsWith(`.${suffix}`));
  }

  // *.example.com、example.*.com 等
  const patternParts = pattern.split('.');
  return domainList.some((domain) => {
    const domainParts = domain.split('.');
    return (
      patternParts.length === domainParts.length &&
      patternParts.every((part, index) => part === '*' || part === domainParts[index])
    );
  });
}

// hosts 匹配优先级：精确 > +. > . > *（同级按出现顺序）
function hostSpecificity(pattern) {
  if (pattern.startsWith('+.')) return 2;
  if (pattern.startsWith('.')) return 1;
  if (pattern.includes('*')) return 0;
  return 3;
}

// 根据订阅 hosts 映射改写节点 server，改写后无需再复制 hosts 进新配置。
// 支持链式映射（如 a→b、b→c 时节点 a 改写为 c）；
// 回环映射（a→b、b→a）由内核校验拒绝，此处仅以已访问集合防御性终止
function applyHostsToProxies(proxies, hosts) {
  if (!hosts || typeof hosts !== 'object') return proxies;

  // 全部有效条目按匹配优先级排序（链式解析需保留中继条目，故不按节点域名预过滤）
  const hostEntries = Object.entries(hosts)
    .filter(
      ([, value]) => (typeof value === 'string' && value.length > 0) || (Array.isArray(value) && value.length > 0),
    )
    .sort((a, b) => hostSpecificity(b[0]) - hostSpecificity(a[0]));

  if (hostEntries.length === 0) return proxies;

  // 取映射目标（数组取首个非空字符串），无有效目标时返回 null
  const targetOf = (value) => {
    if (Array.isArray(value)) value = value.find((v) => typeof v === 'string' && v.length > 0);
    return typeof value === 'string' && value.length > 0 ? value : null;
  };

  // 解析结果缓存：相同节点域名只解析一次，后续直接复用
  const resolveCache = new Map();

  // 解析单个节点域名：沿链式映射逐级改写至最终目标，无匹配时原样返回
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

// 剥离 DNS 地址的 # 策略组后缀；#direct（忽略大小写，可带 & 参数）时整条保留，
// 避免误删内核原生支持的 DIRECT 出口标记
function stripDnsSuffix(dns) {
  const str = String(dns);
  const hashIndex = str.indexOf('#');
  if (hashIndex === -1) return str;

  const suffix = str.slice(hashIndex + 1).toLowerCase();
  if (suffix === 'direct' || suffix.startsWith('direct&')) return str;

  return str.slice(0, hashIndex);
}

// --- 正则缓存加速 ---
const proxyRegionCache = new Map();
const anyRegionRegex = new RegExp(regionMappings.map((r) => '(?:' + r.regex.source + ')').join('|'), 'i');

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

  const builtinTypes = new Set(['direct', 'reject', 'rematch']);

  let filteredRawProxies = originalProxies.filter(proxy => {
    if (!checkProxy(proxy)) return false;
    if (builtinTypes.has(String(proxy.type ?? '').toLowerCase())) return false;
    if (excludeFilter.test(proxy.name)) return false;
    if (ruleOptionsEnable.过滤高倍率节点 && highRateRegex.test(proxy.name)) return false;
    return true;
  });

  const renameMap = new Map();

  const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;

  const normalizedProxies = filteredRawProxies.map(proxy => {
    const oldName = proxy.name;
    const matchedRegions = getMatchedRegions(oldName);

    // 提取已有国旗，移除国旗和多余空格
    const existingFlag = oldName.match(flagRegex)?.[0];
    const nameWithoutFlag = oldName.replace(flagRegex, '').replace(/\s+/g, ' ').trim();

    // 如果已有国旗则复用，否则从地区匹配取
    const regionFlag = existingFlag || matchedRegions.find((r) => r.flag)?.flag;
    const newName = regionFlag ? `${regionFlag} ${nameWithoutFlag}` : nameWithoutFlag;

    // 预缓存标准化后的名称，供后续 buildRegionGroups 复用
    if (newName !== oldName) {
      proxyRegionCache.set(newName, matchedRegions);
      renameMap.set(oldName, newName);
      return { ...proxy, name: newName };
    }
    return proxy;
  });

  // 去重：标准化后可能出现同名节点（如去掉重复国旗后撞名），保留首个，避免内核冲突
  const hasDuplicateNames = new Set(normalizedProxies.map((p) => p.name)).size !== normalizedProxies.length;
  let deduplicatedProxies = normalizedProxies;
  if (hasDuplicateNames) {
    deduplicatedProxies = [];
    const uniqueNames = new Set();
    for (const proxy of normalizedProxies) {
      if (uniqueNames.has(proxy.name)) continue;
      uniqueNames.add(proxy.name);
      deduplicatedProxies.push(proxy);
    }
  }

  // 标准化后的节点名称集合（用于判断 dialer-proxy 引用目标是否仍有效）
  const normalizedProxyNames = new Set(deduplicatedProxies.map((p) => p.name));

  // 修复 dialer-proxy 引用：节点被重命名或移除后，更新/删除引用，避免内核报错
  let proxies = deduplicatedProxies.map(proxy => {
    const target = proxy['dialer-proxy'];
    if (!target) return proxy;
    // 目标节点被重命名 → 更新引用
    if (renameMap.has(target)) return { ...proxy, 'dialer-proxy': renameMap.get(target) };
    // 目标节点存活且未重命名 → 引用依然有效
    if (normalizedProxyNames.has(target)) return proxy;
    // 目标节点被过滤移除（或引用目标本就不存在）→ 删除引用
    const copy = { ...proxy };
    delete copy['dialer-proxy'];
    return copy;
  });

  const isAllDirectOrReject = proxies.every(p => p.type?.toLowerCase() === 'direct' || p.type?.toLowerCase() === 'reject');
  if (!proxies.length || isAllDirectOrReject) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  // 最后对节点进行排序，确保多 provider（如 [一], [二], [三] 或 [1], [2]）时按数字顺序排列
  // 解决 clash 内核因 provider 异步下载完成导致的节点乱序问题
  const numMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
  const getPrefixRank = (name) => {
    const match = name.match(/^\[([一二三四五六七八九十\d]+)\]/);
    if (match) {
      const val = match[1];
      return numMap[val] !== undefined ? numMap[val] : parseInt(val, 10);
    }
    return 99999;
  };

  proxies.sort((a, b) => {
    const rankA = getPrefixRank(a.name);
    const rankB = getPrefixRank(b.name);
    if (rankA !== rankB) return rankA - rankB;
    return 0;
  });

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
    'alidns', 'doh.pub', 'dot.pub', 'dns.pub', 'dnspod', 'dns.baidu',
    'dns.google', 'cloudflare', 'quad9', 'opendns', 'nextdns', 'adguard',
    'system',
  ];

  // 预编译为单个正则，避免逐个遍历数组进行子串匹配
  let commonDnsRegex = new RegExp(commonDnsList.map((dns) => dns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] ?? [];
  const listenValue = originalDnsConfig['listen'];

  // hosts 改写条件：
  // 1. proxy-server-nameserver 仅 1 条且该 DNS 包含非空的 listen 值（旧写法：如 198.18.0.1:53）
  // 2. proxy-server-nameserver 仅 1 条且包含 127.0.0.1，且 listen 包含 0.0.0.0（新写法：本地监听）
  const matchesLocalDnsListener =
    proxyServerNameservers.length === 1 &&
    typeof listenValue === 'string' &&
    listenValue.includes('0.0.0.0') &&
    proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes('127.0.0.1'));

  const shouldRewriteByHosts =
    proxyServerNameservers.length === 1 &&
    typeof listenValue === 'string' &&
    listenValue.length > 0 &&
    (proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes(listenValue.toLowerCase())) ||
      matchesLocalDnsListener);

  // 根据订阅 hosts 改写节点 server 为映射后的地址（域名或 IP）
  const mappedProxies = shouldRewriteByHosts ? applyHostsToProxies(proxies, config.hosts) : proxies;

  // 原节点域名（改写前）
  const originalProxyDomains = new Set(
    proxies.filter((p) => typeof p.server === 'string').map((p) => p.server.toLowerCase())
  );

  // 合并改写前/后的节点域名；未执行 hosts 改写时两者一致，直接复用原域名集合避免冗余操作
  const proxyDomains = shouldRewriteByHosts
    ? new Set([
        ...originalProxyDomains,
        ...mappedProxies.filter((p) => typeof p.server === 'string').map((p) => p.server.toLowerCase()),
      ])
    : originalProxyDomains;

  // 命中触发条件时，私有 DNS 提取时直接置空，避免本地监听 DNS 被误留为私有 DNS
  const privateProxyServerNameservers = shouldRewriteByHosts ? [] : proxyServerNameservers;

  const isCommonDns = (dns) => commonDnsRegex.test(String(dns));

  // 提取私有 DNS（先剥离 # 策略组后缀，再判断是否为公共 DNS）
  const privateDNS = [
    ...new Set(
      [...(originalDnsConfig['nameserver'] ?? []), ...privateProxyServerNameservers]
        .map(stripDnsSuffix)
        .filter((dns) => dns.length > 0 && !isCommonDns(dns)),
    ),
  ];

  // 提取节点域名对应的 DNS 配置（剥离 # 策略组后缀）
  const proxyServerPolicy = Object.fromEntries(
    [originalDnsConfig['nameserver-policy'] ?? {}, originalDnsConfig['proxy-server-nameserver-policy'] ?? {}]
      .flatMap(Object.entries)
      .filter(([domain]) => matchDomainPattern(domain, proxyDomains))
      .map(([domain, dns]) => [
        domain,
        Array.isArray(dns) ? dns.map(stripDnsSuffix).filter((d) => d.length > 0) : stripDnsSuffix(dns),
      ])
      .filter(([, dns]) => !(Array.isArray(dns) && dns.length === 0))
  );

  // 继承机场自带的 fake-ip-filter（部分机场节点域名需走真实 IP 解析）
  const originalFakeIpFilter = originalDnsConfig['fake-ip-filter'] ?? [];
  const proxyFakeIpFilter = originalFakeIpFilter.filter((pattern) => matchDomainPattern(String(pattern), proxyDomains));

  const chinaDNS = ['223.5.5.5', '119.29.29.29'];
  const chinaDohDNS = ['https://223.5.5.5/dns-query#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
  const foreignDNS = ['https://cloudflare-dns.com/dns-query#Proxies', 'https://dns.google/dns-query#Proxies'];

  const dns = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    'fake-ip-filter': ['rule-set:Private', 'rule-set:fakeip_filter', ...proxyFakeIpFilter],
    'proxy-server-nameserver': privateDNS.length > 0 ? privateDNS : chinaDohDNS,
    ...(Object.keys(proxyServerPolicy).length > 0 && {
      'proxy-server-nameserver-policy': proxyServerPolicy,
    }),
    'default-nameserver': chinaDNS,
    nameserver: foreignDNS,
    'nameserver-policy': {
      'rule-set:cn': chinaDNS,
    },
    'direct-nameserver': ['system', ...chinaDNS],
  };

  const hosts = {
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': ['services.googleapis.com'],
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
  };

  return { dns, hosts, proxies: mappedProxies };
}

// 处理自定义节点：标准化名称、与订阅节点重名时添加前缀、内部去重，
// 并构建"自建节点"（或链式代理时的"链式落地"）策略组。
// 自定义节点不参与订阅节点过滤，也不参与 hosts 改写及 DNS 域名处理
function buildCustomizeGroups(filteredProxies) {
  const chainEnabled = ruleOptionsEnable['\u94fe\u5f0f\u4ee3\u7406'];

  if (!customizeProxies.length) {
    return { customProxies: [], customProxyNames: [], customGroup: null, chainGroup: null };
  }

  const usedNames = new Set(filteredProxies.map((p) => p.name));
  const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;

  const customList = [];
  for (const proxy of customizeProxies) {
    // 简易标准化：清理国旗和空格
    const oldName = proxy.name;
    const matchedRegions = getMatchedRegions(oldName);
    const existingFlag = oldName.match(flagRegex)?.[0];
    const nameWithoutFlag = oldName.replace(flagRegex, '').replace(/\s+/g, ' ').trim();
    const regionFlag = existingFlag || matchedRegions.find((r) => r.flag)?.flag;
    let name = regionFlag ? `${regionFlag} ${nameWithoutFlag}` : nameWithoutFlag;

    // 重名时添加前缀并重新标准化（国旗自动回到最前），直至名称唯一
    while (usedNames.has(name)) {
      const flag = name.match(flagRegex)?.[0];
      const rest = name.replace(flagRegex, '').replace(/\s+/g, ' ').trim();
      name = flag ? `${flag} ${customPrefix}${rest}` : `${customPrefix}${rest}`;
    }
    usedNames.add(name);

    let customProxy = name === proxy.name ? proxy : { ...proxy, name };
    // 链式代理启用时强制添加/覆盖 dialer-proxy，使自定义节点经"链式中转"策略组中转
    if (chainEnabled && customProxy['dialer-proxy'] !== dialerProxyName) {
      customProxy = { ...customProxy, 'dialer-proxy': dialerProxyName };
    }
    customList.push(customProxy);
  }

  const ico = "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color";
  const customGroup = {
    name: chainEnabled ? '\u94fe\u5f0f\u843d\u5730' : '\u81ea\u5efa\u8282\u70b9',
    type: 'select',
    proxies: customList.map((p) => p.name),
    icon: `${ico}/Server.png`,
  };

  // 链式代理：构建"链式中转"策略组（仅包含订阅节点，不含自定义节点，避免 dialer-proxy 回环）
  const filteredProxyNames = filteredProxies.map((p) => p.name);
  const chainGroup = (chainEnabled && customList.length > 0)
    ? {
        name: dialerProxyName,
        type: 'select',
        proxies: filteredProxyNames,
        icon: `${ico}/Bypass.png`,
      }
    : null;

  return {
    customProxies: customList,
    customProxyNames: customList.map((p) => p.name),
    customGroup,
    chainGroup,
  };
}

function buildRegionGroups(proxies, customProxies) {
  const allProxies = [...proxies, ...customProxies];
  const pNames = allProxies.map(p => p.name);
  const getNodes = (reg) => {
    const res = pNames.filter(name => reg.test(name));
    return res.length > 0 ? res : ["DIRECT"];
  };

  const healthCheckUrl = "https://g.cn/generate_204";
  const autoBaseOption = { type: "url-test", url: healthCheckUrl, interval: 300, tolerance: 50, lazy: true, timeout: 3000, "max-failed-times": 3, "exclude-type": "DIRECT", "empty-fallback": "REJECT" };
  const ico = "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color";

  const regionGroups = [];
  const regionAutoGroups = [];
  const activeRegions = [];
  const coreRegions = []; // 仅包含国家/地区组，不含倍率组，用于 Auto url-test 自动选择
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

  if (ruleOptionsEnable.生成倍率组) {
    const finalLowRateRegex = ruleOptionsEnable.一倍率归入低倍率 
      ? new RegExp(`^(?!.*(?:剩|期|客户端|软件))(?!.*(?:${highRateRegex.source})).*$`, 'u') 
      : lowRateRegex;
    const nodesLowRate = getNodes(finalLowRateRegex);
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
  }

  return { regionGroups, regionAutoGroups, activeRegions, coreRegions, pNames, autoBaseOption, ico };
}

function buildProxyGroups(regionData, customInfo) {
  const { regionGroups, regionAutoGroups, activeRegions, coreRegions, pNames, autoBaseOption, ico } = regionData;
  const customProxyNames = (customInfo && customInfo.customProxyNames) || [];
  const customGroup = (customInfo && customInfo.customGroup) || null;
  const chainGroup = (customInfo && customInfo.chainGroup) || null;
  const masterName = "Auto";

  const allProxiesNames = [...customProxyNames, ...pNames];

  const buildGroup = (name, iconName, groupProxies, extra) => {
    if (!groupProxies) groupProxies = ["Proxies", ...activeRegions];
    if (!extra) extra = {};
    return { name, type: "select", icon: ico + "/" + iconName + ".png", proxies: groupProxies, ...extra };
  };

  const groups = [
    buildGroup("Proxies", "Global", [masterName, ...activeRegions, ...allProxiesNames]),
    ...(ruleOptionsEnable.Google ? [buildGroup("Google", "Google")] : []),
    ...(ruleOptionsEnable.YouTube ? [buildGroup("YouTube", "YouTube", ["Proxies", ...activeRegions], { "default-selected": "MO" })] : []),
    ...(ruleOptionsEnable.Spotify ? [buildGroup("Spotify", "Spotify", ["Proxies", "直连", ...activeRegions], { "default-selected": "TW" })] : []),
    ...(ruleOptionsEnable.Telegram ? [buildGroup("Telegram", "Telegram_X")] : []),
    ...(ruleOptionsEnable.Games ? [buildGroup("Games", "Game", ["Proxies", "直连", ...activeRegions])] : []),
    ...(ruleOptionsEnable.PayPal ? [buildGroup("PayPal", "PayPal", ["Proxies", "直连", ...activeRegions])] : []),
    ...(ruleOptionsEnable.X ? [buildGroup("X", "X")] : []),
    ...(ruleOptionsEnable.OpenAI ? [buildGroup("OpenAI", "ChatGPT", ["Proxies", ...activeRegions], { "default-selected": "US" })] : []),
    ...(ruleOptionsEnable.AI ? [buildGroup("AI", "AI", ["Proxies", ...activeRegions], { "default-selected": "US" })] : []),
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

    { name: masterName, icon: ico + "/Auto.png", proxies: coreRegions, ...autoBaseOption },
    ...(customGroup ? [customGroup] : []),
    ...(chainGroup ? [chainGroup] : []),
    ...regionGroups,
    ...regionAutoGroups
  ];

  return groups;
}

function main(config) {
  const newConfig = {};

  const proxies = filterAndNormalizeProxies(config);
  
  newConfig['mixed-port'] = 7890;
  newConfig['allow-lan'] = true;
  newConfig['ipv6'] = true;
  newConfig['mode'] = 'rule';
  newConfig['log-level'] = 'info';
  newConfig['bind-address'] = '*';
  newConfig['unified-delay'] = true;
  newConfig['tcp-concurrent'] = true;
  newConfig['keep-alive-interval'] = 60;
  newConfig['find-process-mode'] = 'strict';
  newConfig['external-controller'] = '127.0.0.1:9090';
  newConfig['external-ui'] = 'ui';
  newConfig['external-ui-url'] = 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip';
  newConfig['profile'] = { 'store-selected': true, 'store-fake-ip': true };

  // dns 和 hosts 相关处理（仅订阅节点参与 hosts 改写）
  const { dns, hosts, proxies: mappedProxies } = buildDnsAndHostsConfig(config, proxies);
  newConfig['dns'] = dns;
  newConfig['hosts'] = hosts;

  // 处理自定义节点（标准化、解决重名、构建策略组）
  const { customProxies, customProxyNames, customGroup, chainGroup } = buildCustomizeGroups(mappedProxies);

  // IP 版本偏好：给订阅节点注入 ip-version（自定义节点和直连节点不受影响）
  const ipv4Prefer = ruleOptionsEnable['代理IPV4优先'];
  const ipv6Prefer = ruleOptionsEnable['代理IPV6优先'];
  let finalMappedProxies = mappedProxies;
  if ((ipv4Prefer || ipv6Prefer) && !(ipv4Prefer && ipv6Prefer)) {
    const ipVersion = ipv4Prefer ? 'ipv4-prefer' : 'ipv6-prefer';
    finalMappedProxies = mappedProxies.map(p => {
      if (p.type === 'direct') return p;
      return { ...p, 'ip-version': ipVersion };
    });
  }

  newConfig['proxies'] = [...finalMappedProxies, ...customProxies, ...directProxies];

  newConfig['ntp'] = { enable: true, 'write-to-system': false, server: 'ntp.aliyun.com', port: 123, interval: 60 };
  newConfig['tun'] = { enable: true, stack: 'system', 'auto-route': true, 'strict-route': true, 'auto-redirect': true, 'auto-detect-interface': true, 'dns-hijack': ['any:53', 'tcp://any:53'] };

  const regionData = buildRegionGroups(finalMappedProxies, customProxies);
  newConfig["proxy-groups"] = buildProxyGroups(regionData, { customProxyNames: customProxyNames, customGroup: customGroup, chainGroup: chainGroup });

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
    fakeip_filter: { ...mrs, url: "https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs", path: "./rules/fakeip_filter.mrs" },
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
      "RULE-SET,Emby,Emby",
      "RULE-SET,EmbyIP,Emby"
    ] : []),
    "RULE-SET,gfw,Proxies",
    "RULE-SET,geolocation-cn,直连",
    "RULE-SET,cn_additional,直连",
    ...(ruleOptionsEnable.AI ? ["RULE-SET,AIIP,AI,no-resolve"] : []),
    ...(ruleOptionsEnable.Google ? ["RULE-SET,GoogleIP,Google,no-resolve"] : []),
    ...(ruleOptionsEnable.Telegram ? ["RULE-SET,TelegramIP,Telegram,no-resolve"] : []),
    "RULE-SET,ProxyIP,Proxies,no-resolve",
    "RULE-SET,ChinaIP,直连",
    "GEOIP,CN,直连",
    "RULE-SET,PrivateIP,直连",
    "MATCH,Final"
  ];

  return newConfig;
}