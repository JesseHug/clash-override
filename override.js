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

// CDN 基础路径统一配置 (fastly.jsdelivr.net)
const iconBaseUrl = 'https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/';
const iconQureBaseUrl = 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/';
const iconCustomBaseUrl = 'https://fastly.jsdelivr.net/gh/JesseHug/clash-override@master/Icons/svg/';
const ruleSetBaseUrl = 'https://fastly.jsdelivr.net/gh/appshubcc/bett-rules@meta/geo/';

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
  FCM: true,              // Google FCM 推送（默认直连）

  PayPal: true,           // PayPal 支付
  Netflix: true,          // Netflix 流媒体
  Emby: true,             // Emby 媒体服务
  Meta: true,             // Meta 服务 (Facebook/Instagram/WhatsApp)
  IPTV: true,             // IPTV 直播源 (Cathy 等，默认直连)

  // 非分流策略配置
  极简国内外分流模式: false,      // 是否启用极简国内外分流模式
  屏蔽代理QUIC流量: false,      // 是否屏蔽非国内目标的 QUIC 流量（防止视频卡顿）
  显示默认隐藏的策略组: false,  // 显示隐藏的地区 url-test 自动选择组
  生成地区自动选择组: true,     // 为每个地区生成隐藏的 url-test 自动选择组
  隐藏地区手动选择组: false,    // 隐藏地区 select 手动选择组（仍然存在，只是不显示）
  过滤高倍率节点: false,        // 全局排除高倍率节点（2x 及以上）
  一倍率归入低倍率: true,         // 将1x、1.0x等一倍率节点也归入低倍率组
  生成高低倍率组: true,         // 是否生成低倍率/高倍率策略组（关闭后界面更简洁）
  生成家宽节点组: true,         // 是否生成家宽（住宅/原生 IP）节点策略组
  过滤低倍率节点: false,        // 是否全局排除低倍率节点
  过滤重复节点: false,          // 是否按连接目标（服务器地址+端口）过滤重复节点
  过滤非地区节点: true,         // 过滤掉不属于任何地区的节点（Other 组中的杂项节点）
  代理IPV4优先: false,          // 开启后所有订阅节点强制 ipv4-prefer
  代理IPV6优先: false,          // 开启后所有订阅节点强制 ipv6-prefer（与上条互斥，同时开启则不生效）
  链式代理: false,              // 是否启用链式代理（中转节点与落地节点策略组）
};

// 专门用于适配 Bettbox GUI 读取开关图标的定义
const serviceConfigs = [
  { name: 'Google', icon: `${iconBaseUrl}Google.svg` },
  { name: 'YouTube', icon: `${iconBaseUrl}YouTube.svg` },
  { name: 'Spotify', icon: `${iconBaseUrl}Spotify.svg` },
  { name: 'Telegram', icon: `${iconBaseUrl}Telegram.svg` },
  { name: 'Games', icon: `${iconBaseUrl}Steam.svg` },
  { name: 'PayPal', icon: `${iconBaseUrl}PayPal.svg` },
  { name: 'X', icon: `${iconBaseUrl}Twitter.svg` },
  { name: 'OpenAI', icon: `${iconBaseUrl}OpenAI.svg` },
  { name: 'AI', icon: `${iconQureBaseUrl}AI.png` },
  { name: 'Apple', icon: `${iconBaseUrl}Apple.svg` },
  { name: 'Netflix', icon: `${iconBaseUrl}Netflix.svg` },
  { name: 'Emby', icon: `${iconBaseUrl}Emby.svg` },
  { name: 'Meta', icon: `${iconBaseUrl}Meta.svg` },
  { name: 'FCM', icon: `${iconBaseUrl}Fcm.svg` },
  { name: 'IPTV', icon: `${iconCustomBaseUrl}IPTV.svg` },
];

/**
 * 适配 Bettbox 策略组开关
 * 声明哪些开关属于策略组：基础策略组 + 全部分流策略组。
 */
Compatible_With_Bettbox.policyGroupOptions = serviceConfigs.map((svc) => svc.name);

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

// 重名时使用的前缀
const customPrefix = '自建-';

// --- 节点匹配正则定义 ---

// 定义全局排除节点的正则表达式，用于剔除无关或失效的信息节点
const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用(?:官网|地址|网址|域名|发布|群|渠道)|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\.me\/\+|\bexpire\b|\bhttps?:\/\/|\.com|\btraffic\b/iu;
const lowRateRegex = /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<![\d.])0\.\d+|下载|低倍|实验性|(?<![A-Za-z])free(?![A-Za-z]))/i;
const oneRateRegex = /(?:(?<![\d.])(?:1|1\.0+)\s*(?:倍|[*×xX✕✖⨉]))|(?:[*×xX✕✖⨉]\s*(?:1|1\.0+)(?![\d.]))/i;
const highRateRegex = /(?:[*×xX✕✖⨯⨉]\s*(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*))|(?:(?<![\d.])(?:(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?|1\.[0-9]*[1-9]\d*)\s*(?:倍|[*×xX✕✖⨯⨉]))/i;
const homeRegex = /家宽|住宅|原生\s*IP|家庭宽带|\bISP\b|\bRES\b|residential/i;

/**
 * 零宽/不可见字符：部分机场会在节点名中逐字符插入这类字符（如 H\u200BK），打断地区、倍率等正则匹配。
 * 刻意排除 ZWNJ/ZWJ 及变体选择符，避免破坏连字和 emoji 呈现。
 */
const invisibleCharsRegex = /[\u00AD\u180E\u200B\u200E\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u115F\u1160\u3164\uFFA0]/g;

/**
 * 取节点名「可用于匹配」的形式：剥离零宽/不可见字符
 */
function toMatchableName(name) {
  return typeof name === 'string' ? name.replace(invisibleCharsRegex, '') : name;
}

const regionMappings = [
  { key: "HK", flag: "🇭🇰", regex: /🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|Hong\s*Kong/i, icon: `${iconBaseUrl}HongKong.svg` },
  { key: "SG", flag: "🇸🇬", regex: /🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|Singapore/i, icon: `${iconBaseUrl}Singapore.svg` },
  { key: "TW", flag: "🇹🇼", regex: /🇹🇼|台湾|(?<![A-Za-z])TW(?:N)?(?![A-Za-z])|Taiwan/i, icon: `${iconBaseUrl}Taiwan.svg` },
  { key: "JP", flag: "🇯🇵", regex: /🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|Japan/i, icon: `${iconBaseUrl}Japan.svg` },
  { key: "US", flag: "🇺🇸", regex: /🇺🇸|美国|美西|美东|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|(?<![A-Za-z])USA?(?![A-Za-z])|America|United\s*States/i, icon: `${iconBaseUrl}America.svg` },
  { key: "MO", flag: "🇲🇴", regex: /🇲🇴|澳门|(?<![A-Za-z])(?:MO|MAC)(?![A-Za-z])|Macao|Macau/i, icon: `${iconQureBaseUrl}Macao.png` },
  { key: "EU", flag: "🇪🇺", regex: /🇪🇺|法国|德国|英国|荷兰|意大利|西班牙|匈牙利|乌克兰|(?<![A-Za-z])(?:FR|DE|GB|UK|NL|EU|IT|ES|HU|UA)(?![A-Za-z])|Europe|Frankfurt|London|Paris|Amsterdam|Milan|Madrid|Kyiv/i, icon: `${iconQureBaseUrl}European_Union.png` }
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

/**
 * 预编译节点域名集合，返回「规则模式 → 是否命中」的匹配函数。
 * 精确 / `+.` / `.` 三类模式查预建集合；通配模式按「段数 + 通配位之后的固定后缀」分组后逐段比对，
 * 避免每个模式都遍历一遍整个域名集合（节点多时由 O(模式 × 域名) 降为近似 O(模式)）
 */
function createDomainMatcher(domains) {
  const exact = new Set();
  const suffixes = new Set();
  const properSuffixes = new Set();
  const splitDomains = [];

  for (const raw of domains) {
    const domain = raw.toLowerCase();
    if (exact.has(domain)) continue;
    exact.add(domain);
    const parts = domain.split('.');
    splitDomains.push(parts);
    suffixes.add(domain);
    for (let i = 1; i < parts.length; i++) {
      const suffix = parts.slice(i).join('.');
      suffixes.add(suffix);
      properSuffixes.add(suffix);
    }
  }

  let wildcardIndex = null;
  const candidatesOf = (key) => {
    if (!wildcardIndex) {
      wildcardIndex = new Map();
      for (const parts of splitDomains) {
        for (let i = 0; i <= parts.length; i++) {
          const indexKey = `${parts.length}:${parts.slice(i).join('.')}`;
          const list = wildcardIndex.get(indexKey);
          if (list) list.push(parts);
          else wildcardIndex.set(indexKey, [parts]);
        }
      }
    }
    return wildcardIndex.get(key) || [];
  };

  return (rawPattern) => {
    const pattern = String(rawPattern).toLowerCase();
    if (pattern.startsWith('+.')) return suffixes.has(pattern.slice(2));
    if (pattern.startsWith('.')) return properSuffixes.has(pattern.slice(1));
    if (!pattern.includes('*')) return exact.has(pattern);

    const patternParts = pattern.split('.');
    const key = `${patternParts.length}:${patternParts.slice(patternParts.lastIndexOf('*') + 1).join('.')}`;
    return candidatesOf(key).some((parts) =>
      patternParts.every((part, index) => part === '*' || part === parts[index]),
    );
  };
}

// hosts 匹配优先级：精确 > +. > . > *（同级按出现顺序）
function hostSpecificity(pattern) {
  if (pattern.startsWith('+.')) return 2;
  if (pattern.startsWith('.')) return 1;
  if (pattern.includes('*')) return 0;
  return 3;
}

/**
 * 预编译 hosts 条目，返回「域名 → 命中条目」的查找函数。
 * 精确 / `+.` / `.` 三类按模式建索引，通配模式保底逐个比对；
 * 同类型命中时取 hosts 中靠前者，与「按优先级排序后线性查找」的结果保持一致。
 * 入参需已按 hostSpecificity 降序排列（同一键只保留最先出现的一条）
 */
function createHostFinder(hostEntries) {
  const exact = new Map();
  const plus = new Map();
  const dot = new Map();
  const wildcards = [];

  hostEntries.forEach((entry, index) => {
    const pattern = entry[0].toLowerCase();
    const level = hostSpecificity(pattern);
    if (level === 0) {
      wildcards.push(entry);
      return;
    }
    const [map, key] =
      level === 3 ? [exact, pattern] : level === 2 ? [plus, pattern.slice(2)] : [dot, pattern.slice(1)];
    if (!map.has(key)) map.set(key, { entry, index });
  });

  const firstOf = (map, keys) => {
    let found = null;
    for (const key of keys) {
      const item = map.get(key);
      if (item && (!found || item.index < found.index)) found = item;
    }
    return found?.entry;
  };

  return (domain) => {
    const exactEntry = exact.get(domain)?.entry;
    if (exactEntry) return exactEntry;

    const parts = domain.split('.');
    const suffixes = parts.map((_, i) => parts.slice(i).join('.'));
    return (
      firstOf(plus, suffixes) ??
      firstOf(dot, suffixes.slice(1)) ??
      wildcards.find(([pattern]) => matchDomainPattern(pattern, domain))
    );
  };
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

  const findHost = createHostFinder(hostEntries);
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
      const entry = findHost(current);
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

// 剥离 DNS 地址的 # 策略组后缀；
// 参数包含 direct 或 直连 时，强制规范化为 #DIRECT
function stripDnsSuffix(dns) {
  const str = String(dns);
  const hashIndex = str.indexOf('#');
  if (hashIndex === -1) return str;

  const prefix = str.slice(0, hashIndex).trim();
  const suffix = str.slice(hashIndex + 1).toLowerCase();
  if (suffix.includes('direct') || suffix.includes('直连')) return prefix + '#DIRECT';

  return prefix;
}

/**
 * 判断节点 server 是否为 IP 地址（IPv4 / IPv6），用于从节点域名集合中排除 IP 类型的 server
 */
function isIpAddress(server) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(server) || server.includes(':');
}

/**
 * 简化节点域名策略：将相同 DNS 的节点域名按后缀归类，至少三段的域名可合并为 +. 后缀形式
 */
function simplifyDomainPolicy(policy) {
  const groups = new Map();

  for (const [domain, dns] of Object.entries(policy)) {
    const dnsKey = JSON.stringify(Array.isArray(dns) ? [...dns].sort() : dns);

    if (domain.startsWith('+.') || domain.startsWith('.') || domain.includes('*')) {
      groups.set(`keep:${domain}`, [{ domain, dns, dnsKey }]);
      continue;
    }

    const parts = domain.split('.');

    if (parts.length < 3) {
      groups.set(`keep:${domain}`, [{ domain, dns, dnsKey }]);
      continue;
    }

    const suffix = parts.slice(-2).join('.');

    if (!groups.has(suffix)) {
      groups.set(suffix, []);
    }

    groups.get(suffix).push({ domain, dns, dnsKey });
  }

  const result = {};

  for (const [, domains] of groups) {
    const firstDnsKey = domains[0].dnsKey;
    const sameDns = domains.every(({ dnsKey }) => dnsKey === firstDnsKey);

    if (domains.length >= 2 && sameDns) {
      const suffix = domains[0].domain.split('.').slice(-2).join('.');
      result[`+.${suffix}`] = domains[0].dns;
    } else {
      for (const { domain, dns } of domains) {
        result[domain] = dns;
      }
    }
  }

  return result;
}

// --- 正则缓存加速 ---
const proxyRegionCache = new Map();
const anyRegionRegex = new RegExp(regionMappings.map((r) => '(?:' + r.regex.source + ')').join('|'), 'i');

function getMatchedRegions(proxyName) {
  if (proxyRegionCache.has(proxyName)) {
    return proxyRegionCache.get(proxyName);
  }

  // 移除空白字符、零宽字符及不可见字符，避免干扰地区/国旗正则匹配
  const cleanName = toMatchableName(proxyName);
  const regions = anyRegionRegex.test(cleanName)
    ? regionMappings.filter((region) => region.regex.test(cleanName))
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
  const originalGroups = config['proxy-groups'] || [];
  const originalGroupMap = new Map(originalGroups.map(g => [g.name, g]));

  const chainEnabled = Boolean(ruleOptionsEnable.链式代理);

  // 识别参与链式代理的节点集合（无论是来自 Sub-Store、FLYX 还是其他前置工具，均需识别并免受误过滤）
  const rawLandingNodes = originalProxies.filter(p => Boolean(p && p['dialer-proxy']));
  const rawDialerTargets = new Set(rawLandingNodes.map(p => p['dialer-proxy']));
  const rawRelayGroup = originalGroupMap.get('中转节点');
  const rawLandingGroup = originalGroupMap.get('落地节点');

  const chainNodeNames = new Set();
  for (const p of rawLandingNodes) chainNodeNames.add(p.name);
  for (const t of rawDialerTargets) chainNodeNames.add(t);
  if (rawRelayGroup && Array.isArray(rawRelayGroup.proxies)) {
    for (const n of rawRelayGroup.proxies) chainNodeNames.add(n);
  }
  if (rawLandingGroup && Array.isArray(rawLandingGroup.proxies)) {
    for (const n of rawLandingGroup.proxies) chainNodeNames.add(n);
  }

  const builtinTypes = new Set(['direct', 'reject', 'rematch']);

  let filteredRawProxies = originalProxies.filter(proxy => {
    if (!checkProxy(proxy)) return false;
    if (builtinTypes.has(String(proxy.type ?? '').toLowerCase())) return false;
    // 参与链式代理的节点不因关键词误杀（但倍率过滤仍生效）
    const isChainNode = chainNodeNames.has(proxy.name);
    const cleanForFilter = toMatchableName(proxy.name);
    if (!isChainNode && excludeFilter.test(cleanForFilter)) return false;
    if (ruleOptionsEnable.过滤低倍率节点 && lowRateRegex.test(cleanForFilter)) return false;
    if (ruleOptionsEnable.过滤高倍率节点 && highRateRegex.test(cleanForFilter)) return false;
    return true;
  });

  const renameMap = new Map();

  const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;

  const normalizedProxies = filteredRawProxies.map(proxy => {
    const oldName = proxy.name;
    const matchedRegions = getMatchedRegions(oldName);

    // 提取已有国旗，移除国旗、零宽/不可见字符和多余空格
    const existingFlag = oldName.match(flagRegex)?.[0];
    const nameWithoutFlag = oldName.replace(flagRegex, '').replace(invisibleCharsRegex, '').replace(/\s+/g, ' ').trim();

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

  // 去重处理：
  // 1. 若开启 过滤重复节点，按连接目标 (server + port) 去重，剔除完全相同的物理服务器节点
  // 2. 无论是否开启该选项，均按节点名称 (name) 去重，防止重名导致内核冲突
  const filterDuplicateTarget = ruleOptionsEnable.过滤重复节点;
  const uniqueTargets = new Set();
  const uniqueNames = new Set();
  const deduplicatedProxies = [];

  for (const proxy of normalizedProxies) {
    // 按连接目标 (server:port) 去重
    if (filterDuplicateTarget && typeof proxy.server === 'string' && proxy.port) {
      const targetKey = `${proxy.server.toLowerCase().trim()}:${proxy.port}`;
      if (uniqueTargets.has(targetKey)) continue;
      uniqueTargets.add(targetKey);
    }

    // 按节点名称去重
    if (uniqueNames.has(proxy.name)) continue;
    uniqueNames.add(proxy.name);

    deduplicatedProxies.push(proxy);
  }

  // 标准化后的节点名称集合（用于判断 dialer-proxy 引用目标是否仍有效）
  // 标准化后的节点名称集合（用于判断 dialer-proxy 引用目标是否仍有效）
  const normalizedProxyNames = new Set(deduplicatedProxies.map((p) => p.name));

  // 建立核心名称查找映射，用于跨前缀（如 Sub-Store 注入的 [自建]）精准匹配原始策略组中的节点
  const getCoreName = (name) => {
    return String(name || '')
      .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '')
      .replace(/\[自建\]|自建-|\[.*?\]/g, '')
      .replace(invisibleCharsRegex, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };

  const coreNameToNormalizedMap = new Map();
  for (const p of deduplicatedProxies) {
    const core = getCoreName(p.name);
    if (core && !coreNameToNormalizedMap.has(core)) {
      coreNameToNormalizedMap.set(core, p.name);
    }
  }

  const resolveNodeName = (name) => {
    if (!name || typeof name !== 'string') return null;
    if (normalizedProxyNames.has(name)) return name;
    if (renameMap.has(name)) return renameMap.get(name);
    const core = getCoreName(name);
    if (core && coreNameToNormalizedMap.has(core)) return coreNameToNormalizedMap.get(core);
    return null;
  };

  // 合法的策略组目标：包括原配置中的所有策略组名称，以及通用链式策略组（中转节点、链式中转）
  const validGroupTargets = new Set([
    ...originalGroupMap.keys(),
    '中转节点',
    '链式中转'
  ]);

  // 修复并保留 dialer-proxy 引用：
  // 无论是否启用"链式代理"选项，Sub-Store 或前置订阅自带的节点链式代理均完整保留；
  // 节点重命名后同步更新 target 引用，确保不会断链
  let proxies = deduplicatedProxies.map(proxy => {
    const target = proxy['dialer-proxy'];
    if (!target) return proxy;
    // 目标节点被重命名或模糊匹配到新名称 → 更新引用
    const resolvedTarget = resolveNodeName(target);
    if (resolvedTarget) return { ...proxy, 'dialer-proxy': resolvedTarget };
    // 目标是指向合法的策略组（如 FLYX 的"中转节点"）→ 引用有效，保留
    if (validGroupTargets.has(target)) return proxy;
    // 仅当目标在所有节点与策略组中都彻底不存在（死引用）时，才删除以防内核报错
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

  // 探测并构建链式代理策略组信息：
  // 1. 若开启"链式代理"开关：汇总构建【中转节点】与【落地节点】策略组，并将落地节点注入各分流组
  // 2. 若未开启该开关：节点的 dialer-proxy 引用（Sub-Store 等注入）完整保留；
  //    仅在有节点明确引用"中转节点"策略组时兜底补齐中转组，防止内核报错
  const needRelayGroup = proxies.some(p => p['dialer-proxy'] === '中转节点') || Boolean(rawRelayGroup);
  const hasChain = chainEnabled ? (Boolean(rawRelayGroup) || Boolean(rawLandingGroup) || proxies.some(p => Boolean(p['dialer-proxy']))) : Boolean(needRelayGroup);
  let chainInfo = null;

  if (hasChain) {
    // 落地节点名称集合（避免将落地节点本身放入中转组造成自身回环）
    const dialerLandingNodes = proxies.filter(p => Boolean(p['dialer-proxy']));
    const landingNodeNames = new Set(dialerLandingNodes.map(p => p.name));

    // 1. 中转节点列表：优先从原始"中转节点"策略组提取（支持模糊匹配跨越 [自建] 等前缀）
    let relayProxies = [];
    if (rawRelayGroup && Array.isArray(rawRelayGroup.proxies)) {
      relayProxies = rawRelayGroup.proxies
        .map(n => resolveNodeName(n))
        .filter(n => n && normalizedProxyNames.has(n) && !landingNodeNames.has(n));
    }
    // 其次从节点引用的非策略组单节点提取
    if (relayProxies.length === 0) {
      const singleTargets = proxies
        .map(p => p['dialer-proxy'])
        .filter(t => t && normalizedProxyNames.has(t) && !landingNodeNames.has(t));
      relayProxies = [...new Set(singleTargets)];
    }
    // 若仍然为空且存在 dialer-proxy: "中转节点"，兜底放入所有非落地节点（若全为落地则放全部）以防内核报错
    if (relayProxies.length === 0 && proxies.length > 0) {
      const nonLanding = [...normalizedProxyNames].filter(n => !landingNodeNames.has(n));
      relayProxies = nonLanding.length > 0 ? nonLanding : [...normalizedProxyNames];
    }

    // 2. 落地节点列表：从原始"落地节点"策略组提取，或者取所有含有 dialer-proxy 的节点
    let landingProxies = [];
    if (rawLandingGroup && Array.isArray(rawLandingGroup.proxies)) {
      landingProxies = rawLandingGroup.proxies
        .map(n => resolveNodeName(n))
        .filter(n => n && normalizedProxyNames.has(n));
    }
    const dialerLandingProxyNames = dialerLandingNodes.map(p => p.name);
    landingProxies = [...new Set([...landingProxies, ...dialerLandingProxyNames])];

    const chainGroups = [];

    // 中转节点策略组：必须保证存在，防止 dialer-proxy: 中转节点 报 not found
    if (relayProxies.length > 0 || rawRelayGroup || proxies.some(p => p['dialer-proxy'] === '中转节点')) {
      chainGroups.push({
        name: '中转节点',
        type: 'select',
        icon: `${iconBaseUrl}Bypass.svg`,
        proxies: relayProxies.length > 0 ? relayProxies : ['DIRECT']
      });
    }

    // 落地节点策略组（在开启链式代理或原订阅显式包含落地节点组时生成）
    let landingGroupName = null;
    if ((chainEnabled && landingProxies.length > 0) || rawLandingGroup) {
      landingGroupName = '落地节点';
      chainGroups.push({
        name: landingGroupName,
        type: 'select',
        icon: `${iconBaseUrl}Server.svg`,
        proxies: landingProxies.length > 0 ? landingProxies : ['DIRECT']
      });
    }

    chainInfo = {
      chainGroups,
      landingGroupName,
      relayGroupName: '中转节点'
    };
  }

  return { proxies, chainInfo };
}

function buildDnsAndHostsConfig(config, proxies) {
  const originalDnsConfig = config.dns ?? {};
  
  // 常见的公共 DNS，用于过滤订阅中的公共 DNS
  const commonDnsList = [
    // ==================== 国内 ====================
    // 阿里 AliDNS（阿里云）
    '223.5.5.5', '223.6.6.6', '2400:3200::1', '2400:3200:baba::1', 'alidns',
    // 腾讯 DNSPod（腾讯云）
    '119.29.29.29', '119.28.28.28', '182.254.116.116', '182.254.118.118', '1.12.12.12', '120.53.53.53',
    '2402:4e00::', 'doh.pub', 'dot.pub', 'dns.pub', 'dnspod',
    // 114DNS（南京信风）
    '114.114.114.114', '114.114.115.115', '114.114.114.119', '114.114.115.119', '114.114.114.110', '114.114.115.110',
    // 百度 BaiduDNS
    '180.76.76.76', '2400:da00::6666', 'dns.baidu',
    // CNNIC SDNS（中国互联网络信息中心）
    '1.2.4.8', '210.2.4.8', '2001:dc7:1000::1', 'cnnic',
    // 360 安全 DNS
    '101.226.4.6', '218.30.118.6', '123.125.81.6', '140.207.198.6', '2400:8800:1::6', '2400:8800:2::6', 'doh.360', 'dot.360', 'dns.360',
    // 火山引擎（字节跳动）
    '180.184.1.1', '180.184.2.2',
    // OneDNS（微步在线，拦截版/纯净版/家庭版）
    '117.50.11.11', '117.50.22.22', '52.80.66.66', '117.50.10.10', '52.80.52.52', '117.50.60.30', '52.80.60.30', 'onedns.net',
    // 清华大学 TUNA
    '101.6.6.6', '2001:da8::666',
    // 下一代互联网国家工程中心（IPv6 公共 DNS）
    '240c::6666', '240c::6644',
    // 中国科学技术大学（教育网防污染）
    '202.141.162.123', '202.141.178.13',

    // ==================== 国外 ====================
    // Cloudflare
    '1.1.1.1', '1.0.0.1', '1.1.1.2', '1.0.0.2', '1.1.1.3', '1.0.0.3',
    '2606:4700:4700::1111', '2606:4700:4700::1001', '2606:4700:4700::1112', '2606:4700:4700::1002',
    '2606:4700:4700::1113', '2606:4700:4700::1003',
    'dns.cloudflare', 'cloudflare-dns', 'one.one.one.one',
    // Google Public DNS
    '8.8.8.8', '8.8.4.4', '2001:4860:4860::8888', '2001:4860:4860::8844', 'dns.google',
    // Quad9
    '9.9.9.9', '9.9.9.10', '9.9.9.11', '149.112.112.112', '149.112.112.10', '149.112.112.11',
    '2620:fe::fe', '2620:fe::9', 'quad9',
    // Cisco OpenDNS（含 FamilyShield）
    '208.67.222.222', '208.67.220.220', '208.67.222.123', '208.67.220.123',
    '2620:119:35::35', '2620:119:53::53', '2620:119:35::123', '2620:119:53::123', 'opendns',
    // AdGuard DNS（含家庭版）
    '94.140.14.14', '94.140.15.15', '94.140.14.15', '94.140.15.16',
    '2a10:50c0::ad1:ff', '2a10:50c0::ad2:ff', '2a10:50c0::bad1:ff', '2a10:50c0::bad2:ff', 'adguard',
    // Control D
    '76.76.2.0', '76.76.10.0', '76.76.19.19', '76.223.122.150',
    // CleanBrowsing（含安全/家庭版）
    '185.228.168.9', '185.228.169.9', '185.228.168.10', '185.228.169.11', '185.228.168.168', '185.228.169.168', '2a0d:2a00:1::2', '2a0d:2a00:2::2',
    // Yandex DNS
    '77.88.8.8', '77.88.8.1', '2a02:6b8::feed:0ff', '2a02:6b8:0:1::feed:0ff',
    // Neustar UltraDNS
    '156.154.70.1', '156.154.71.1', '156.154.70.2', '156.154.71.2', '2610:a1:1018::1', '2610:a1:1019::1',
    // Mullvad DNS
    '194.242.2.2', '2a07:e340::2',
    // Hurricane Electric
    '74.82.42.42', '2001:470:20::2',
    // NextDNS
    'nextdns',
    // Apple
    'dns.apple',
  ];

  // 预编译为单个正则，避免逐个遍历数组进行子串匹配
  let commonDnsRegex = new RegExp(commonDnsList.map((dns) => dns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] ?? [];
  const listenValue = originalDnsConfig['listen'];

  const shouldRewriteByHosts =
    proxyServerNameservers.length === 1 &&
    typeof listenValue === 'string' &&
    listenValue.length > 0 &&
    (proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes(listenValue.toLowerCase())) ||
      (listenValue.includes('0.0.0.0') &&
        proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes('127.0.0.1'))));

  // 根据订阅 hosts 改写节点 server 为映射后的地址（域名或 IP）
  const mappedProxies = shouldRewriteByHosts ? applyHostsToProxies(proxies, config.hosts) : proxies;

  // 节点域名集合
  const proxyDomains = new Set(
    mappedProxies
      .filter((p) => typeof p.server === 'string')
      .map((p) => p.server.toLowerCase())
      .filter((server) => !isIpAddress(server)),
  );

  const matchProxyDomain = createDomainMatcher(proxyDomains);

  // 命中触发条件时，私有 DNS 提取时直接置空，避免本地监听 DNS 被误留为私有 DNS
  const privateProxyServerNameservers = shouldRewriteByHosts ? [] : proxyServerNameservers;

  const isCommonDns = (dns) => {
    const value = String(dns).trim().toLowerCase();
    if (value === 'system' || value === 'system://') return true;

    return commonDnsRegex.test(value);
  };

  // 提取私有 DNS（先剥离 # 策略组后缀，再判断是否为公共 DNS）
  const privateDNS = [
    ...new Set(
      [...(originalDnsConfig['nameserver'] ?? []), ...privateProxyServerNameservers]
        .map(stripDnsSuffix)
        .filter((dns) => dns.length > 0 && !isCommonDns(dns)),
    ),
  ];

  // 提取节点域名对应的 DNS 配置（剥离 # 策略组后缀）
  const matchedProxyPolicy = Object.fromEntries(
    [originalDnsConfig['nameserver-policy'] ?? {}, originalDnsConfig['proxy-server-nameserver-policy'] ?? {}]
      .flatMap(Object.entries)
      .filter(([domain]) => matchProxyDomain(domain))
      .map(([domain, dns]) => [
        domain,
        Array.isArray(dns) ? dns.map(stripDnsSuffix).filter((d) => d.length > 0) : stripDnsSuffix(dns),
      ])
      .filter(([, dns]) => !(Array.isArray(dns) && dns.length === 0))
  );

  // 无节点专属 DNS 策略且存在私有 DNS 时，将节点域名统一映射到私有 DNS
  if (privateDNS.length > 0 && Object.keys(matchedProxyPolicy).length === 0) {
    for (const domain of proxyDomains) {
      matchedProxyPolicy[domain] = privateDNS;
    }
  }

  // 压缩相同 DNS 的节点二级子域策略为 +.domain.com 规则（仅当所有节点均被命中时才泛域名化，避免误伤同主域其他节点）
  const matchedPolicyDomains = Object.keys(matchedProxyPolicy);
  const proxyServerPolicy =
    proxyDomains.size === matchedPolicyDomains.length &&
    matchedPolicyDomains.every((domain) => proxyDomains.has(domain.toLowerCase()))
      ? simplifyDomainPolicy(matchedProxyPolicy)
      : matchedProxyPolicy;

  // 继承机场自带的 fake-ip-filter（部分机场节点域名需走真实 IP 解析）
  const originalFakeIpFilter = originalDnsConfig['fake-ip-filter'] ?? [];
  const proxyFakeIpFilter = originalFakeIpFilter.filter((pattern) => matchProxyDomain(String(pattern)));

  const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
  const foreignDNS = ['https://cloudflare-dns.com/dns-query#Proxies', 'https://dns.google/dns-query#Proxies'];
  const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
  const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];

  const dns = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    'fake-ip-filter': [
      'rule-set:Private',
      'rule-set:fakeip_filter',
      'rule-set:cn',
      ...(ruleOptionsEnable['FCM'] ? ['rule-set:GoogleFCM'] : []),
      ...proxyFakeIpFilter,
    ],
    'default-nameserver': defaultDNS,
    'proxy-server-nameserver': proxyServerDNS,
    ...(Object.keys(proxyServerPolicy).length > 0 && {
      'proxy-server-nameserver-policy': proxyServerPolicy,
    }),
    nameserver: foreignDNS,
    'nameserver-policy': {
      'rule-set:Private': 'system',
      'rule-set:douyin': ['180.184.1.1', '180.184.2.2'],
      'rule-set:cn': chinaDNS,
    },
    'direct-nameserver': chinaDNS,
    'direct-nameserver-follow-policy': true,
  };

  const hosts = {
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': 'services.googleapis.com',
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
  };

  return { dns, hosts, proxies: mappedProxies };
}

// 处理自定义节点：标准化名称、与订阅节点重名时添加前缀、内部去重，
// 并构建"自建节点"或"链式落地"策略组。
// 自定义节点不参与订阅节点过滤，也不参与 hosts 改写及 DNS 域名处理
function buildCustomizeGroups(filteredProxies) {
  const chainEnabled = Boolean(ruleOptionsEnable.链式代理);
  const customGroupName = chainEnabled ? '链式落地' : '自建节点';
  const dialerProxyName = '链式中转';

  if (!customizeProxies.length) {
    return { customProxies: [], customProxyNames: [], customGroup: null, customChainGroup: null, customGroupName };
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

    const normalizedProxy = name === proxy.name ? proxy : { ...proxy, name };
    customList.push(
      chainEnabled
        ? { ...normalizedProxy, 'dialer-proxy': dialerProxyName }
        : normalizedProxy,
    );
  }

  const customGroup = {
    name: customGroupName,
    type: 'select',
    proxies: customList.map((p) => p.name),
    icon: `${iconBaseUrl}Server.svg`,
  };

  const filteredProxyNames = filteredProxies.map((p) => p.name);
  const customChainGroup = chainEnabled
    ? {
        name: dialerProxyName,
        type: 'select',
        icon: `${iconBaseUrl}Bypass.svg`,
        proxies: filteredProxyNames.length > 0 ? filteredProxyNames : ['DIRECT'],
      }
    : null;

  return {
    customProxies: customList,
    customProxyNames: customList.map((p) => p.name),
    customGroup,
    customChainGroup,
    customGroupName,
  };
}

function buildRegionGroups(proxies, customProxies) {
  const allProxies = [...proxies, ...customProxies];
  const pNames = allProxies.map(p => p.name);
  const getNodes = (reg) => {
    const res = pNames.filter(name => {
      const cleanName = toMatchableName(name);
      return reg.test(cleanName);
    });
    return res.length > 0 ? res : ["DIRECT"];
  };

  const healthCheckUrl = "https://www.apple.com/library/test/success.html";
  const autoBaseOption = { type: "url-test", url: healthCheckUrl, interval: 300, tolerance: 50, lazy: true, timeout: 3000, "max-failed-times": 3, "exclude-type": "DIRECT", "empty-fallback": "REJECT" };
  const ico = iconQureBaseUrl.slice(0, -1);

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
      regionGroups.push({ name: r.key, type: "select", icon: r.icon.startsWith("http") ? r.icon : `${ico}/${r.icon}`, proxies: groupProxies, ...(ruleOptionsEnable.隐藏地区手动选择组 ? { hidden: true } : {}) });
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

  const generateRateGroupEnabled = ruleOptionsEnable.生成高低倍率组 ?? ruleOptionsEnable.生成倍率组;
  if (generateRateGroupEnabled) {
    const finalLowRateRegex = ruleOptionsEnable.一倍率归入低倍率 
      ? new RegExp(`^(?!.*(?:剩|期|客户端|软件))(?!.*(?:${highRateRegex.source})).*$`, 'i') 
      : lowRateRegex;
    const nodesLowRate = getNodes(finalLowRateRegex);
    const nodesHighRate = getNodes(highRateRegex);
    if (nodesLowRate[0] !== "DIRECT") {
      activeRegions.push("低倍率节点");
      regionAutoGroups.push({ name: "低倍率节点-自动选择", proxies: nodesLowRate, hidden: true, ...autoBaseOption });
      regionGroups.push({ name: "低倍率节点", type: "select", icon: "https://fastly.jsdelivr.net/gh/lixing0016/lige-icon@main/icon/05icon/liuliang(4).png", proxies: ["低倍率节点-自动选择", ...nodesLowRate] });
    }
    if (nodesHighRate[0] !== "DIRECT") {
      activeRegions.push("高倍率节点");
      regionAutoGroups.push({ name: "高倍率节点-自动选择", proxies: nodesHighRate, hidden: true, ...autoBaseOption });
      regionGroups.push({ name: "高倍率节点", type: "select", icon: "https://fastly.jsdelivr.net/gh/lixing0016/lige-icon@main/icon/05icon/lightning(2).png", proxies: ["高倍率节点-自动选择", ...nodesHighRate] });
    }
  }

  if (ruleOptionsEnable.生成家宽节点组) {
    const nodesHome = getNodes(homeRegex);
    if (nodesHome[0] !== "DIRECT") {
      activeRegions.push("家宽节点");
      regionAutoGroups.push({ name: "家宽节点-自动选择", proxies: nodesHome, hidden: true, ...autoBaseOption });
      regionGroups.push({ name: "家宽节点", type: "select", icon: `${iconCustomBaseUrl}Home.svg`, proxies: ["家宽节点-自动选择", ...nodesHome] });
    }
  }

  return { regionGroups, regionAutoGroups, activeRegions, coreRegions, pNames, autoBaseOption, ico };
}

function buildProxyGroups(regionData, customInfo) {
  const { regionGroups, regionAutoGroups, activeRegions, coreRegions, pNames, autoBaseOption, ico } = regionData;
  const customProxyNames = (customInfo && customInfo.customProxyNames) || [];
  const customGroup = (customInfo && customInfo.customGroup) || null;
  const customChainGroup = (customInfo && customInfo.customChainGroup) || null;
  const customGroupName = (customInfo && customInfo.customGroupName) || null;
  const chainInfo = (customInfo && customInfo.chainInfo) || null;
  const masterName = "Auto";

  const allProxiesNames = [...pNames, ...customProxyNames];

  const landingGroups = [];
  if (chainInfo && chainInfo.landingGroupName) landingGroups.push(chainInfo.landingGroupName);
  if (customGroup && customGroupName === '链式落地') landingGroups.push(customGroupName);

  const chainGroups = (chainInfo && chainInfo.chainGroups) || [];

  const buildGroup = (name, iconTarget, groupProxies, extra = {}) => {
    if (!groupProxies) groupProxies = ["Proxies", "默认代理", ...landingGroups, ...activeRegions];
    const icon = iconTarget.startsWith("http") ? iconTarget : `${ico}/${iconTarget}.png`;
    const res = { name, type: "select", icon, proxies: groupProxies, ...extra };
    if (res['default-selected'] !== undefined && !groupProxies.includes(res['default-selected'])) {
      delete res['default-selected'];
    }
    return res;
  };

  const defaultProxyGroup = {
    name: "默认代理",
    type: "select",
    icon: `${iconBaseUrl}Global.svg`,
    proxies: allProxiesNames.length > 0 ? allProxiesNames : ["DIRECT"]
  };

  const proxiesList = [
    masterName,
    "默认代理",
    ...landingGroups,
    ...activeRegions
  ];

  const groups = [
    buildGroup("Proxies", `${iconBaseUrl}Proxy.svg`, proxiesList),
    ...chainGroups, // FLYX【落地节点】与【中转节点】策略组
    ...(customGroup && customGroupName === '链式落地' ? [customGroup] : []), // 自建链式落地组
    ...(customChainGroup ? [customChainGroup] : []), // 自建链式中转组
    ...(ruleOptionsEnable.Google ? [buildGroup("Google", `${iconBaseUrl}Google.svg`)] : []),
    ...(ruleOptionsEnable.YouTube ? [buildGroup("YouTube", `${iconBaseUrl}YouTube.svg`, ["Proxies", "默认代理", ...landingGroups, ...activeRegions], { "default-selected": "MO" })] : []),
    ...(ruleOptionsEnable.Spotify ? [buildGroup("Spotify", `${iconBaseUrl}Spotify.svg`, ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions], { "default-selected": "TW" })] : []),
    ...(ruleOptionsEnable.Telegram ? [buildGroup("Telegram", `${iconBaseUrl}Telegram.svg`)] : []),
    ...(ruleOptionsEnable.Games ? [buildGroup("Games", `${iconBaseUrl}Steam.svg`, ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions])] : []),
    ...(ruleOptionsEnable.PayPal ? [buildGroup("PayPal", `${iconBaseUrl}PayPal.svg`, ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions])] : []),
    ...(ruleOptionsEnable.X ? [buildGroup("X", `${iconBaseUrl}Twitter.svg`)] : []),
    ...(ruleOptionsEnable.OpenAI ? [buildGroup("OpenAI", `${iconBaseUrl}OpenAI.svg`, ["Proxies", "默认代理", ...landingGroups, ...activeRegions], { "default-selected": "US" })] : []),
    ...(ruleOptionsEnable.AI ? [buildGroup("AI", "AI", ["Proxies", "默认代理", ...landingGroups, ...activeRegions], { "default-selected": "US" })] : []),
    ...(ruleOptionsEnable.Apple ? [buildGroup("Apple", `${iconBaseUrl}Apple.svg`, ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions])] : []),
    ...(ruleOptionsEnable.Netflix ? [buildGroup("Netflix", `${iconBaseUrl}Netflix.svg`, ["Proxies", "默认代理", ...landingGroups, ...activeRegions])] : []),
    ...(ruleOptionsEnable.Emby ? [buildGroup("Emby", `${iconBaseUrl}Emby.svg`, ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions])] : []),
    ...(ruleOptionsEnable.Meta ? [buildGroup("Meta", `${iconBaseUrl}Meta.svg`, ["Proxies", "默认代理", ...landingGroups, ...activeRegions])] : []),
    ...(ruleOptionsEnable.FCM ? [{ name: "FCM", type: "select", icon: `${iconBaseUrl}Fcm.svg`, proxies: ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions], ...(["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions].includes("直连") ? { "default-selected": "直连" } : {}) }] : []),
    ...(ruleOptionsEnable.IPTV ? [{ name: "IPTV", type: "select", icon: `${iconCustomBaseUrl}IPTV.svg`, proxies: ["直连", "Proxies", "默认代理", ...landingGroups, ...activeRegions], ...(["直连", "Proxies", "默认代理", ...landingGroups, ...activeRegions].includes("直连") ? { "default-selected": "直连" } : {}) }] : []),
    
    // Final 策略组加入所有 activeRegions
    buildGroup("Final", "Final", ["Proxies", "直连", "默认代理", ...landingGroups, ...activeRegions]),

    {
      name: "直连",
      type: "select",
      icon: `${iconBaseUrl}China.svg`,
      proxies: [...directProxies.map(p => p.name)]
    },

    { name: masterName, icon: `${iconBaseUrl}Auto.svg`, proxies: coreRegions, ...autoBaseOption },
    defaultProxyGroup,
    ...(customGroup && customGroupName !== '链式落地' ? [customGroup] : []),
    ...regionGroups,
    ...regionAutoGroups
  ];

  return groups;
}

function main(config) {
  const newConfig = {};

  const { proxies, chainInfo } = filterAndNormalizeProxies(config);
  
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
  const { customProxies, customProxyNames, customGroup } = buildCustomizeGroups(mappedProxies);

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
  newConfig['tun'] = { enable: true, stack: 'mips', 'auto-route': true, 'strict-route': true, 'auto-redirect': true, 'auto-detect-interface': true, 'dns-hijack': ['any:53', 'tcp://any:53'] };

  const regionData = buildRegionGroups(finalMappedProxies, customProxies);
  const { activeRegions } = regionData;
  newConfig["proxy-groups"] = buildProxyGroups(regionData, { customProxyNames: customProxyNames, customGroup: customGroup, chainInfo: chainInfo });

  // --- Rule Providers (优先 bett-rules) ---
  const mrs = { type: "http", behavior: "domain", format: "mrs", interval: 86400 };
  const mrsIP = { type: "http", behavior: "ipcidr", format: "mrs", interval: 86400 };

  newConfig["rule-providers"] = {
    Private: { ...mrs, url: `${ruleSetBaseUrl}geosite/private.mrs`, path: "./rules/Private.mrs", "path-in-bundle": "geo/geosite/private.mrs" },
    ...(ruleOptionsEnable.YouTube ? { YouTube: { ...mrs, url: `${ruleSetBaseUrl}geosite/youtube.mrs`, path: "./rules/YouTube.mrs" } } : {}),
    ...(ruleOptionsEnable.Spotify ? {
      Spotify: { ...mrs, url: `${ruleSetBaseUrl}geosite/spotify.mrs`, path: "./rules/Spotify.mrs" },
      SpotifyIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/spotify.mrs`, path: "./rules/SpotifyIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Telegram ? {
      Telegram: { ...mrs, url: `${ruleSetBaseUrl}geosite/telegram.mrs`, path: "./rules/Telegram.mrs" },
      TelegramIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/telegram.mrs`, path: "./rules/TelegramIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Games ? {
      GamesCN: { ...mrs, url: `${ruleSetBaseUrl}geosite/category-games@cn.mrs`, path: "./rules/GamesCN.mrs" },
      Games: { ...mrs, url: `${ruleSetBaseUrl}geosite/category-games-!cn.mrs`, path: "./rules/Games.mrs" },
      SteamIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/steam.mrs`, path: "./rules/SteamIP.mrs", "path-in-bundle": "geo/geoip/steam.mrs" }
    } : {}),
    ...(ruleOptionsEnable.PayPal ? { PayPal: { ...mrs, url: `${ruleSetBaseUrl}geosite/paypal.mrs`, path: "./rules/PayPal.mrs" } } : {}),
    ...(ruleOptionsEnable.X ? {
      Twitter: { ...mrs, url: `${ruleSetBaseUrl}geosite/twitter.mrs`, path: "./rules/Twitter.mrs" },
      TwitterIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/twitter.mrs`, path: "./rules/TwitterIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.OpenAI ? { OpenAI: { ...mrs, url: `${ruleSetBaseUrl}geosite/openai.mrs`, path: "./rules/OpenAI.mrs" } } : {}),
    ...(ruleOptionsEnable.AI ? {
      AI: { ...mrs, url: `${ruleSetBaseUrl}geosite/category-ai-!cn.mrs`, path: "./rules/AI.mrs" },
      AIIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/ai.mrs`, path: "./rules/AIIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Apple ? {
      AppleCN: { ...mrs, url: `${ruleSetBaseUrl}geosite/apple@cn.mrs`, path: "./rules/AppleCN.mrs" },
      Apple: { ...mrs, url: `${ruleSetBaseUrl}geosite/apple.mrs`, path: "./rules/Apple.mrs" },
      AppleIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/apple.mrs`, path: "./rules/AppleIP.mrs", "path-in-bundle": "geo/geoip/apple.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Netflix ? {
      Netflix: { ...mrs, url: `${ruleSetBaseUrl}geosite/netflix.mrs`, path: "./rules/Netflix.mrs" },
      NetflixIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/netflix.mrs`, path: "./rules/NetflixIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Emby ? {
      Emby: { ...mrs, url: `${ruleSetBaseUrl}geosite/category-emby.mrs`, path: "./rules/Emby.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Meta ? {
      Meta: { ...mrs, url: `${ruleSetBaseUrl}geosite/meta.mrs`, path: "./rules/Meta.mrs" },
      MetaIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/facebook.mrs`, path: "./rules/MetaIP.mrs" }
    } : {}),
    ...(ruleOptionsEnable.Google ? {
      Google: { ...mrs, url: `${ruleSetBaseUrl}geosite/google.mrs`, path: "./rules/Google.mrs" },
      GoogleIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/google.mrs`, path: "./rules/GoogleIP.mrs" },
      Gemini: { ...mrs, url: `${ruleSetBaseUrl}geosite/google-gemini.mrs`, path: "./rules/Gemini.mrs" }
    } : {}),
    ...(ruleOptionsEnable.FCM ? { GoogleFCM: { ...mrs, url: `${ruleSetBaseUrl}geosite/googlefcm.mrs`, path: "./rules/googlefcm.mrs", "path-in-bundle": "geo/geosite/googlefcm.mrs" } } : {}),
    MicrosoftCN: { ...mrs, url: `${ruleSetBaseUrl}geosite/microsoft@cn.mrs`, path: "./rules/MicrosoftCN.mrs" },
    NvidiaCN: { ...mrs, url: `${ruleSetBaseUrl}geosite/nvidia@cn.mrs`, path: "./rules/NvidiaCN.mrs" },
    Synology: { ...mrs, url: `${ruleSetBaseUrl}geosite/synology.mrs`, path: "./rules/Synology.mrs" },
    'geolocation-!cn': { ...mrs, url: `${ruleSetBaseUrl}geosite/geolocation-!cn.mrs`, path: "./rules/geolocation-!cn.mrs" },
    'geolocation-cn': { ...mrs, url: `${ruleSetBaseUrl}geosite/geolocation-cn.mrs`, path: "./rules/geolocation-cn.mrs" },
    ChinaIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/cn.mrs`, path: "./rules/ChinaIP.mrs" },
    PrivateIP: { ...mrsIP, url: `${ruleSetBaseUrl}geoip/private.mrs`, path: "./rules/PrivateIP.mrs", "path-in-bundle": "geo/geoip/private.mrs" },
    fakeip_filter: { ...mrs, url: `${ruleSetBaseUrl}geosite/fakeip-filter.mrs`, path: "./rules/fakeip_filter.mrs", "path-in-bundle": "geo/geosite/fakeip-filter.mrs" },
    cn: { ...mrs, url: `${ruleSetBaseUrl}geosite/cn.mrs`, path: "./rules/cn.mrs" },
    douyin: { ...mrs, url: `${ruleSetBaseUrl}geosite/douyin.mrs`, path: "./rules/douyin.mrs", "path-in-bundle": "geo/geosite/douyin.mrs" },
    ...(ruleOptionsEnable.IPTV ? {
      cathy_domain: { ...mrs, url: "https://fastly.jsdelivr.net/gh/marcuccilli/Cathy@main/cathy_mihomo_domain.mrs", path: "./rules/cathy_domain.mrs" },
      cathy_ip: { ...mrsIP, url: "https://fastly.jsdelivr.net/gh/marcuccilli/Cathy@main/cathy_mihomo_ipcidr.mrs", path: "./rules/cathy_ip.mrs" },
      iptv_domain: { ...mrs, url: "https://fastly.jsdelivr.net/gh/marcuccilli/gary@main/iptv_mihomo_domain.mrs", path: "./rules/iptv_domain.mrs" },
      iptv_ip: { ...mrsIP, url: "https://fastly.jsdelivr.net/gh/marcuccilli/gary@main/iptv_mihomo_ipcidr.mrs", path: "./rules/iptv_ip.mrs" },
    } : {}),
  };

  const blockForeignQuic = [
    'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,cn),(RULE-SET,ChinaIP,no-resolve)))))),REJECT'
  ];
  const quicEnabled = ruleOptionsEnable.屏蔽代理QUIC流量 ?? ruleOptionsEnable.屏蔽国外QUIC;

  newConfig.rules = [
    // 公共 DNS 直连过滤
    "IP-CIDR,223.5.5.5/32,直连,no-resolve",
    "IP-CIDR,223.6.6.6/32,直连,no-resolve",
    "IP-CIDR,119.29.29.29/32,直连,no-resolve",
    "IP-CIDR,180.184.1.1/32,直连,no-resolve",
    "IP-CIDR,180.184.2.2/32,直连,no-resolve",
    "IP-CIDR,114.114.114.114/32,直连,no-resolve",
    "IP-CIDR,114.114.115.115/32,直连,no-resolve",

    "RULE-SET,Private,直连",
    "RULE-SET,geolocation-cn,直连",
    ...(ruleOptionsEnable.Games ? ["RULE-SET,GamesCN,直连"] : []),
    ...(ruleOptionsEnable.Apple ? ["RULE-SET,AppleCN,直连"] : []),
    "RULE-SET,MicrosoftCN,直连",
    "RULE-SET,NvidiaCN,直连",
    "RULE-SET,Synology,直连",
    "DOMAIN,fsend.cn,直连",
    "DOMAIN,international-gfe.download.nvidia.com,直连",
    "DOMAIN-SUFFIX,ctaiot.com,直连",
    "DOMAIN-SUFFIX,hdslb.com,直连",

    // 显式定义规则集下载域名规则，避免出现鸡蛋问题
    "DOMAIN-SUFFIX,github.com,Proxies",
    "DOMAIN-SUFFIX,githubusercontent.com,Proxies",
    "DOMAIN-SUFFIX,jsdelivr.net,Proxies",
    "DOMAIN-SUFFIX,jsdelivr.com,Proxies",
    ...(quicEnabled ? blockForeignQuic : []),
    ...(ruleOptionsEnable.FCM ? ["RULE-SET,GoogleFCM,FCM"] : []),
    ...(ruleOptionsEnable.OpenAI ? ["RULE-SET,OpenAI,OpenAI"] : []),
    ...(ruleOptionsEnable.AI ? [
      "RULE-SET,AI,AI",
      "DOMAIN,cdn.usefathom.com,AI",
      "DOMAIN-SUFFIX,intercom.io,AI",
      "DOMAIN-SUFFIX,intercomcdn.com,AI"
    ] : []),
    ...(ruleOptionsEnable.YouTube ? ["RULE-SET,YouTube,YouTube"] : []),
    ...(ruleOptionsEnable.Google ? ["RULE-SET,Google,Google", "RULE-SET,Gemini,Google"] : []),
    ...(ruleOptionsEnable.Spotify ? ["RULE-SET,Spotify,Spotify"] : []),
    ...(ruleOptionsEnable.Telegram ? ["RULE-SET,Telegram,Telegram"] : []),
    ...(ruleOptionsEnable.Games ? ["RULE-SET,Games,Games"] : []),
    ...(ruleOptionsEnable.PayPal ? ["RULE-SET,PayPal,PayPal"] : []),
    ...(ruleOptionsEnable.X ? ["RULE-SET,Twitter,X"] : []),
    ...(ruleOptionsEnable.Apple ? ["RULE-SET,Apple,Apple"] : []),
    ...(ruleOptionsEnable.Netflix ? ["RULE-SET,Netflix,Netflix"] : []),
    ...(ruleOptionsEnable.Emby ? ["RULE-SET,Emby,Emby"] : []),
    ...(ruleOptionsEnable.Meta ? ["RULE-SET,Meta,Meta"] : []),
    ...(ruleOptionsEnable.IPTV ? [
      "RULE-SET,cathy_domain,IPTV",
      "RULE-SET,iptv_domain,IPTV"
    ] : []),
    ...(activeRegions.includes("US") ? ["DOMAIN-SUFFIX,nodeseek.com,US"] : ["DOMAIN-SUFFIX,nodeseek.com,Proxies"]),
    "RULE-SET,geolocation-!cn,Proxies",

    // 代理（IP类，无 no-resolve，延后至域名规则之后，按解析结果兜底匹配）
    ...(ruleOptionsEnable.Google ? ["RULE-SET,GoogleIP,Google"] : []),
    ...(ruleOptionsEnable.Spotify ? ["RULE-SET,SpotifyIP,Spotify"] : []),
    ...(ruleOptionsEnable.Telegram ? ["RULE-SET,TelegramIP,Telegram"] : []),
    ...(ruleOptionsEnable.Games ? ["RULE-SET,SteamIP,Games"] : []),
    ...(ruleOptionsEnable.X ? ["RULE-SET,TwitterIP,X"] : []),
    ...(ruleOptionsEnable.Apple ? ["RULE-SET,AppleIP,Apple"] : []),
    ...(ruleOptionsEnable.Netflix ? ["RULE-SET,NetflixIP,Netflix"] : []),
    ...(ruleOptionsEnable.Meta ? ["RULE-SET,MetaIP,Meta"] : []),
    ...(ruleOptionsEnable.AI ? ["RULE-SET,AIIP,AI"] : []),
    ...(ruleOptionsEnable.IPTV ? [
      "RULE-SET,cathy_ip,IPTV",
      "RULE-SET,iptv_ip,IPTV"
    ] : []),
    "RULE-SET,ChinaIP,直连",
    "GEOIP,CN,直连",
    "RULE-SET,PrivateIP,直连",
    "MATCH,Final"
  ];

  return newConfig;
}