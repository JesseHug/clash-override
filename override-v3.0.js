const main = (config) => {
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;

  const proxies = config.proxies ? config.proxies.map(p => p.name) : [];

  const junkFilter = /剩余|流量|邮箱|工单|通知|客服|官网|邀请|到期|已用|次数|USE|USED|TOTAL|EXPIRE|Panel|Channel|Author|群|返利|循环|获取|订阅|机场/i;
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
    !/港|HK|HongKong|坡|SG|Singapore|台|TW|Taiwan|日|JP|Japan|美|US|UnitedStates|韩|KR|KOR|Korea|法|FR|德|DE|英|GB|UK|NL|EU|Europe/i.test(n) && !junkFilter.test(n)
  );

  config["proxy-groups"] = [
    { name: "Proxies", type: "select", proxies: ["Fallback", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other", ...proxies] },
    { name: "YouTube", type: "select", proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Netflix", type: "select", proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Disney", type: "select", proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Spotify", type: "select", proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Bilibili", type: "select", proxies: ["DIRECT", "HK", "TW", "JP", "KR", "Other"] },
    { name: "Telegram", type: "select", proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Steam", type: "select", proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "PayPal", type: "select", proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "OpenAI", type: "select", proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "AI", type: "select", proxies: ["Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Apple", type: "select", proxies: ["Proxies", "DIRECT", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Speedtest", type: "select", proxies: ["DIRECT", "Proxies", "HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"] },
    { name: "Final", type: "select", proxies: ["Proxies", "DIRECT"] },

    { name: "Fallback", type: "fallback", proxies: ["HK", "JP", "SG", "TW", "US", "KR", "EU", "Other"], url: "http://www.gstatic.com/generate_204", interval: 300 },
    { name: "HK", type: "fallback", proxies: nodesHK, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "SG", type: "fallback", proxies: nodesSG, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "TW", type: "fallback", proxies: nodesTW, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "JP", type: "fallback", proxies: nodesJP, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "US", type: "fallback", proxies: nodesUS, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "KR", type: "fallback", proxies: nodesKR, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "EU", type: "fallback", proxies: nodesEU, url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 },
    { name: "Other", type: "fallback", proxies: nodesOther.length > 0 ? nodesOther : ["DIRECT"], url: "http://www.gstatic.com/generate_204", interval: 300, "fallback-interval": 60, lazy: true, "max-failures": 2, timeout: 2000 }
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

  const rp = { type: "http", behavior: "classical", format: "text", interval: 86400 };
  const domainRp = { type: "http", behavior: "domain", format: "text", interval: 86400 };
  const ipcidrRp = { type: "http", behavior: "ipcidr", format: "text", interval: 86400 };
  const baseUrl = "https://raw.githubusercontent.com/AGWA5783/Profiles/master/Surge/Ruleset";

  const myRuleProviders = {
    Unbreak: { ...rp, url: `${baseUrl}/Unbreak.list` },
    YouTube: { ...rp, url: `${baseUrl}/StreamingMedia/Video/YouTube.list` },
    Netflix: { ...rp, url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Netflix.list" },
    Disney: { ...rp, url: `${baseUrl}/StreamingMedia/Video/DisneyPlus.list` },
    Spotify: { ...rp, url: `${baseUrl}/StreamingMedia/Music/Spotify.list` },
    Bahamut: { ...rp, url: `${baseUrl}/StreamingMedia/Video/Bahamut.list` },
    Bilibili: { ...rp, url: `${baseUrl}/StreamingMedia/StreamingSE.list` },
    Telegram: { ...rp, url: `${baseUrl}/Extra/Telegram/Telegram.list` },
    Steam: { ...rp, url: `${baseUrl}/Extra/Game/Steam.list` },
    PayPal: { ...rp, url: `${baseUrl}/Extra/PayPal.list` },
    OpenAI: { ...rp, url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/OpenAi.list" },
    AI: { ...rp, url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/AI.list" },
    AppleCN: { ...domainRp, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/AppleCN.mrs" },
    Apple: { ...domainRp, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Apple.mrs" },
    Speedtest: { ...domainRp, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Speedtest.mrs" },
    Proxies: { ...rp, url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list" },
    ChinaDomain: { ...rp, url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list" },
    ChinaIP: { ...ipcidrRp, url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list" },
    LocalAreaNetwork: { ...rp, url: `${baseUrl}/LocalAreaNetwork.list` }
  };

  config["rule-providers"] = { ...requiredDnsProviders, ...myRuleProviders };

  config.rules = [
    "RULE-SET,LocalAreaNetwork,DIRECT",
    "RULE-SET,Unbreak,DIRECT",
    "RULE-SET,Speedtest,Speedtest",
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Netflix,Netflix",
    "RULE-SET,Disney,Disney",
    "RULE-SET,Spotify,Spotify",
    "RULE-SET,Bilibili,Bilibili",
    "RULE-SET,Telegram,Telegram",
    "RULE-SET,Steam,Steam",
    "RULE-SET,PayPal,PayPal",
    "RULE-SET,OpenAI,OpenAI",
    "RULE-SET,AI,AI",
    "GEOSITE,apple-cn,DIRECT",
    "GEOSITE,apple,Apple",
    "RULE-SET,Proxies,Proxies",
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,ChinaIP,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,Final"
  ];

  return config;
};
