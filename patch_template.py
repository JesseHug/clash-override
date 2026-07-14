import re

with open('AIsouler_mihomoScript.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(
    r'const ruleOptionsEnable = \{.*?\};',
    lambda m: '''const ruleOptionsEnable = {
  OpenAI: true, AI: true, YouTube: true, Google: true, Spotify: true,
  Telegram: true, Games: true, PayPal: true, Twitter: true, Apple: true, Proxies: true
};''',
    text, flags=re.DOTALL)

text = re.sub(
    r'const excludeFilter =.*?;',
    lambda m: r'const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|traffic|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/iu;',
    text, flags=re.DOTALL)

text = re.sub(
    r'const rules = \[.*?\];',
    lambda m: '''const rules = [
  'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,ChinaDomain),(RULE-SET,cn_additional),(RULE-SET,ChinaIP,no-resolve)))))),REJECT',
  'RULE-SET,Direct,DIRECT',
  'RULE-SET,Private,DIRECT',
  'RULE-SET,PrivateIP,DIRECT,no-resolve',
  'RULE-SET,AppleCN,DIRECT'
];''',
    text, flags=re.DOTALL)

text = re.sub(
    r'const regionDefinitions = \[.*?\];',
    lambda m: r'''const regionDefinitions = [
  { name: 'HK', regex: /🇭🇰|港|HK|[Hh]ong\s*[Kk]ong/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png' },
  { name: 'SG', regex: /🇸🇬|坡|SG|[Ss]ingapore/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png' },
  { name: 'TW', regex: /🇹🇼|台|TW|[Tt]aiwan/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png' },
  { name: 'JP', regex: /🇯🇵|日|JP|[Jj]apan/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png' },
  { name: 'US', regex: /🇺🇸|美|US|[Uu]nited\s*[Ss]tates/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png' },
  { name: 'KR', regex: /🇰🇷|韩|KR|KOR|[Kk]orea/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png' },
  { name: 'EU', regex: /🇪🇺|法|德|英|荷|FR|DE|GB|UK|NL|EU|Europe|Frankfurt|London|Paris|Amsterdam/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/European_Union.png' },
  { name: '低倍率节点', regex: /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<!\d)0\.[0-5]|下载|低倍|实验性)/, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Available_1.png' },
  { name: '高倍率节点', regex: /(?:[*×xX✕✖⨉]\s*(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?\s*(?:倍|[*×xX✕✖⨉]))/u, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png' }
];''',
    text, flags=re.DOTALL)

text = re.sub(
    r'const baseRuleProviders = \{.*?\n\};\n\n// 策略组公共配置',
    lambda m: '''const baseRuleProviders = {
  Direct: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Direct.mrs', path: './ruleset/Direct.mrs' },
  Private: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Private.mrs', path: './ruleset/Private.mrs' },
  PrivateIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Private.mrs', path: './ruleset/PrivateIP.mrs' },
  AppleCN: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/AppleCN.mrs', path: './ruleset/AppleCN.mrs' },
  ChinaDomain: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/China.mrs', path: './ruleset/ChinaDomain.mrs' },
  ChinaIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/China.mrs', path: './ruleset/ChinaIP.mrs' },
  fakeip_filter: { ...ruleProviderCommonDomain, url: 'https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs', path: './ruleset/fakeip_filter.mrs' },
  cn_additional: { ...ruleProviderCommonDomain, url: 'https://static-file-global.353355.xyz/rules/cn-additional-list.mrs', path: './ruleset/cn_additional.mrs' }
};

// 策略组公共配置''',
    text, flags=re.DOTALL)

text = re.sub(
    r'const serviceConfigs = \[.*?\];',
    lambda m: '''const serviceConfigs = [
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
];''',
    text, flags=re.DOTALL)

text = text.replace("name: '默认代理'", "name: 'Proxies'")
text = text.replace("proxies: [...groupNamesOfSelect, '手动选择', '自动选择', '负载均衡']", "proxies: ['Auto', ...groupNamesOfSelect]")

text = text.replace("name: '自动选择'", "name: 'Auto'")
text = text.replace("name: '漏网之鱼'", "name: 'Final'")
text = text.replace("proxies: ['默认代理', '直连']", "proxies: ['Proxies', 'DIRECT']")
text = text.replace("['默认代理', '手动选择', '自动选择', '负载均衡', ...groupNamesOfSelect, ...(svc.direct ? ['直连'] : [])]", "['Proxies', ...(svc.direct ? ['DIRECT'] : []), ...groupNamesOfSelect]")
text = text.replace("['REJECT', 'REJECT-DROP', 'PASS']", "['REJECT', 'REJECT-DROP', 'PASS']")

text = re.sub(r'\{\s*\.\.\.selectBaseOption,\s*name:\s*\'手动选择\'.*?\},', '', text, flags=re.DOTALL)
text = re.sub(r'\{\s*\.\.\.loadBalanceBaseOption,\s*name:\s*\'负载均衡\'.*?\},', '', text, flags=re.DOTALL)

text = re.sub(r'\{\s*\.\.\.selectBaseOption,\s*name:\s*\'直连\'.*?\},', '', text, flags=re.DOTALL)
text = re.sub(r'// 构建 GLOBAL 全局策略组.*?const globalGroup = \{.*?\};', '', text, flags=re.DOTALL)
text = text.replace("newConfig['proxy-groups'] = [globalGroup, ...functionalGroups, ...generatedRegionGroups];", "newConfig['proxy-groups'] = [...functionalGroups, ...generatedRegionGroups];")

text = text.replace("'其他节点'", "'Other'")
text = text.replace("'rule-set:cn'", "'rule-set:ChinaDomain,cn_additional'")
text = text.replace("https://dns.cloudflare.com/dns-query#默认代理", "https://dns.cloudflare.com/dns-query#Proxies")
text = text.replace("https://dns.google/dns-query#默认代理", "https://dns.google/dns-query#Proxies")
text = text.replace("'rule-set:private', 'rule-set:fakeip_filter'", "'rule-set:Private', 'rule-set:fakeip_filter'")

text = re.sub(
    r"newConfig\['rules'\] = \[\s*'RULE-SET,github,默认代理',\s*\.\.\.finalRules,\s*// 兜底规则\s*'RULE-SET,gfw,默认代理',\s*'RULE-SET,cn_additional,直连',\s*'RULE-SET,cn_ip,直连',\s*'MATCH,漏网之鱼',\s*\];",
    lambda m: '''newConfig['rules'] = [
    ...finalRules,
    'RULE-SET,ChinaDomain,DIRECT',
    'RULE-SET,cn_additional,DIRECT',
    'RULE-SET,ChinaIP,DIRECT,no-resolve',
    'GEOIP,CN,DIRECT',
    'MATCH,Final'
  ];''',
    text, flags=re.DOTALL
)

with open('mihomoScript_custom.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied successfully.")
