const main = (config) => {
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;
  config["keep-alive-interval"] = 1800;
  config["geodata-mode"] = true;
  config["find-process-mode"] = "strict";

  config["geox-url"] = {
    geoip: "https://ghfast.top/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat",
    mmdb: "https://ghfast.top/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country.mmdb"
  };

  const proxies = config.proxies ? config.proxies.map(p => p.name) : [];

  const junkFilter = /剩余|流量|traffic|邮箱|工单|通知|客服|官网|邀请|到期|已用|次数|USE|USED|TOTAL|EXPIRE|Panel|Channel|Author|群|返利|循环|获取|订阅|机场/i;
  const getNodes = (reg) => {
    const res = proxies.filter(name => reg.test(name) && !junkFilter.test(name));
    return res.length > 0 ? res : ["DIRECT"];
  };

  const nodesHK = getNodes(/港|HK|HongKong|Hong Kong/i);
  const nodesSG = getNodes(/坡|SG|Singapore/i);
  const nodesTW = getNodes(/台|TW|Taiwan/i);
  const nodesJP = getNodes(/日|JP|Japan/i);
  const nodesUS = getNodes(/美|US|UnitedStates|United States/i);
  const nodesKR = getNodes(/韩|KR|KOR|Korea/i);
  const nodesEU = getNodes(/法|德|英|荷|FR|DE|GB|UK|NL|EU|Europe|Frankfurt|London|Paris|Amsterdam/i);
  const nodesOther = proxies.filter(n =>
    !/港|HK|HongKong|坡|SG|Singapore|台|TW|Taiwan|日|JP|Japan|美|US|UnitedStates|韩|KR|KOR|Korea|法|FR|德|DE|英|GB|UK|NL|EU|Europe/i.test(n)
    && !junkFilter.test(n)
  );

  const ico = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color";
  config["proxy-groups"] = [
    { name: "Proxies", type: "select", icon: ico + "/Global.png", proxies: ["Fallback", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other", ...proxies] },
    { name: "YouTube", type: "select", icon: `${ico}/YouTube.png`, proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Spotify", type: "select", icon: `${ico}/Spotify.png`, proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Telegram", type: "select", icon: `${ico}/Telegram_X.png`, proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Steam", type: "select", icon: `${ico}/Game.png`, proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "PayPal", type: "select", icon: `${ico}/PayPal.png`, proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "X", type: "select", icon: `${ico}/X.png`, proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "OpenAI", type: "select", icon: `${ico}/ChatGPT.png`, proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "AI", type: "select", icon: `${ico}/AI.png`, proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Netflix", type: "select", icon: `${ico}/Netflix.png`, proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Apple", type: "select", icon: `${ico}/Apple.png`, proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Speedtest", type: "select", icon: `${ico}/Speedtest.png`, proxies: ["DIRECT", "Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Final", type: "select", icon: `${ico}/Final.png`, proxies: ["Proxies", "DIRECT"] },

    { name: "Fallback", type: "fallback", icon: `${ico}/Auto.png`, proxies: ["HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"], url: "http://www.gstatic.com/generate_204", interval: 600 },
    { name: "HK", type: "fallback", icon: `${ico}/Hong_Kong.png`, proxies: nodesHK, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "SG", type: "fallback", icon: `${ico}/Singapore.png`, proxies: nodesSG, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "TW", type: "fallback", icon: `${ico}/Taiwan.png`, proxies: nodesTW, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "JP", type: "fallback", icon: `${ico}/Japan.png`, proxies: nodesJP, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "US", type: "fallback", icon: `${ico}/United_States.png`, proxies: nodesUS, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "KR", type: "fallback", icon: `${ico}/Korea.png`, proxies: nodesKR, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "EU", type: "fallback", icon: `${ico}/European_Union.png`, proxies: nodesEU, url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 },
    { name: "Other", type: "fallback", icon: `${ico}/Europe_Map.png`, proxies: nodesOther.length > 0 ? nodesOther : ["DIRECT"], url: "http://www.gstatic.com/generate_204", interval: 600, "fallback-interval": 60, lazy: true, "max-failures": 3, timeout: 3000 }
  ];

  const originalProviders = config["rule-providers"] || {};
  const requiredDnsProviders = {};

  if (config.dns && config.dns["fake-ip-filter"]) {
    config.dns["fake-ip-filter"].forEach(item => {
      if (item.startsWith("rule-set:")) {
        const ruleName = item.replace("rule-set:", "");
        if (originalProviders[ruleName]) {
          requiredDnsProviders[ruleName] = originalProviders[ruleName];
        }
      }
    });
  }

  const mrs = { type: "http", behavior: "domain", format: "mrs", interval: 86400 };
  const mrsIP = { type: "http", behavior: "ipcidr", format: "mrs", interval: 86400 };
  const r66 = "https://github.com/666OS/rules/raw/release/mihomo";

  const myRuleProviders = {
    // Unbreak / LocalAreaNetwork 已替换为 666OS
    Direct: { ...mrs, url: `${r66}/domain/Direct.mrs` },
    Private: { ...mrs, url: `${r66}/domain/Private.mrs` },
    YouTube: { ...mrs, url: `${r66}/domain/YouTube.mrs` },
    Netflix: { ...mrs, url: `${r66}/domain/Netflix.mrs` },
    Spotify: { ...mrs, url: `${r66}/domain/Spotify.mrs` },
    Telegram: { ...mrs, url: `${r66}/domain/Telegram.mrs` },
    Steam: { ...mrs, url: `${r66}/domain/Games.mrs` },
    PayPal: { ...mrs, url: `${r66}/domain/PayPal.mrs` },
    Twitter: { ...mrs, url: `${r66}/domain/Twitter.mrs` },
    OpenAI: { ...mrs, url: `${r66}/domain/OpenAI.mrs` },
    AI: { ...mrs, url: `${r66}/domain/AI.mrs` },
    AppleCN: { ...mrs, url: `${r66}/domain/AppleCN.mrs` },
    Apple: { ...mrs, url: `${r66}/domain/Apple.mrs` },
    // 【新增】Google 域名规则集
    Google: { ...mrs, url: `${r66}/domain/Google.mrs` },
    Speedtest: { ...mrs, url: `${r66}/domain/Speedtest.mrs` },
    Proxies: { ...mrs, url: `${r66}/domain/Proxy.mrs` },
    ChinaDomain: { ...mrs, url: `${r66}/domain/China.mrs` },
    ChinaIP: { ...mrsIP, url: `${r66}/ip/China.mrs` },
    AIIP: { ...mrsIP, url: `${r66}/ip/AI.mrs` },
    NetflixIP: { ...mrsIP, url: `${r66}/ip/Netflix.mrs` },
    // 【新增】Google IP 规则集
    GoogleIP: { ...mrsIP, url: `${r66}/ip/Google.mrs` },
    ProxyIP: { ...mrsIP, url: `${r66}/ip/Proxy.mrs` },
    // 新增：fake-ip 过滤 + 国内域名补充（wwqgtxx 源）
    fakeip_filter: { ...mrs, url: "https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs" },
    cn_additional: { ...mrs, url: "https://static-file-global.353355.xyz/rules/cn-additional-list.mrs" },
  };

  config["rule-providers"] = { ...requiredDnsProviders, ...myRuleProviders };

  // DNS fake-ip-filter 加入 fakeip_filter 规则集
  if (config.dns && Array.isArray(config.dns["fake-ip-filter"])) {
    config.dns["fake-ip-filter"].push("rule-set:fakeip_filter");
  }

  config.rules = [
    // 私有网络 & 直连
    "RULE-SET,Direct,DIRECT",
    "RULE-SET,Private,DIRECT",

    // 禁用国外 QUIC（UDP/443），防止 YouTube/Netflix 视频卡顿
    "AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,ChinaDomain),(RULE-SET,ChinaIP,no-resolve)))))),REJECT",

    // 测速
    "RULE-SET,Speedtest,Speedtest",

    // 流媒体 & 应用分流
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Netflix,Netflix",
    "RULE-SET,Spotify,Spotify",
    "RULE-SET,Telegram,Telegram",
    "RULE-SET,Steam,Steam",
    "RULE-SET,PayPal,PayPal",
    "RULE-SET,Twitter,X",

    // AI
    "RULE-SET,OpenAI,OpenAI",
    "RULE-SET,AI,AI",

    // Apple（国内直连，国外代理）
    "RULE-SET,AppleCN,DIRECT",
    "RULE-SET,Apple,Apple",

    // Google 分流至 Proxies（解决 Play Store 下载）
    "RULE-SET,Google,Proxies",

    // 国外网站兜底
    "RULE-SET,Proxies,Proxies",

    // 国内直连
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,cn_additional,DIRECT",

    // IP 规则（no-resolve：不主动触发 DNS，仅已知 IP 时匹配）
    "RULE-SET,NetflixIP,Netflix,no-resolve",
    "RULE-SET,AIIP,AI,no-resolve",
    "RULE-SET,GoogleIP,Proxies,no-resolve",
    "RULE-SET,ProxyIP,Proxies,no-resolve",
    "RULE-SET,ChinaIP,DIRECT,no-resolve",

    // GeoIP 兜底
    "GEOIP,CN,DIRECT",
    "MATCH,Final"
  ];

  return config;
};
