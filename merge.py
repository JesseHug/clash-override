import re

with open('AIsouler_mihomoScript.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace ruleOptionsEnable
new_rule_options = """const ruleOptionsEnable = {
  OpenAI: true,
  AI: true,
  YouTube: true,
  Google: true,
  Spotify: true,
  Telegram: true,
  Games: true,
  PayPal: true,
  Twitter: true,
  Apple: true,
  Proxies: true
};"""
content = re.sub(r'const ruleOptionsEnable = \{.*?\};', lambda m: new_rule_options, content, flags=re.DOTALL)

# 2. Replace excludeFilter
new_exclude = """const excludeFilter = /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|traffic|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|⚠️|@|Expire|http|com/iu;"""
content = re.sub(r'const excludeFilter =.*?;', lambda m: new_exclude, content, flags=re.DOTALL)

# 3. Replace rules
new_rules = """const rules = [
  'AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,ChinaDomain),(RULE-SET,cn_additional),(RULE-SET,ChinaIP,no-resolve)))))),REJECT',
  'RULE-SET,Direct,直连',
  'RULE-SET,Private,直连',
  'RULE-SET,PrivateIP,直连,no-resolve',
  'RULE-SET,AppleCN,直连',
];"""
content = re.sub(r'const rules = \[.*?\];', lambda m: new_rules, content, flags=re.DOTALL)

# 4. Replace regionDefinitions
new_regions = """const regionDefinitions = [
  { name: 'HK', regex: /🇭🇰|港|HK|[Hh]ong\s*[Kk]ong/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png' },
  { name: 'SG', regex: /🇸🇬|坡|SG|[Ss]ingapore/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png' },
  { name: 'TW', regex: /🇹🇼|台|TW|[Tt]aiwan/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png' },
  { name: 'JP', regex: /🇯🇵|日|JP|[Jj]apan/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png' },
  { name: 'US', regex: /🇺🇸|美|US|[Uu]nited\s*[Ss]tates/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png' },
  { name: 'KR', regex: /🇰🇷|韩|KR|KOR|[Kk]orea/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png' },
  { name: 'EU', regex: /🇪🇺|法|德|英|荷|FR|DE|GB|UK|NL|EU|Europe|Frankfurt|London|Paris|Amsterdam/i, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/European_Union.png' },
  { name: '低倍率节点', regex: /^(?!.*(?:剩|期|客户端|软件)).*(?:(?<!\d)0\.[0-5]|下载|低倍|实验性)/, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Available_1.png' },
  { name: '高倍率节点', regex: /(?:[*×xX✕✖⨉]\s*(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?\s*(?:倍|[*×xX✕✖⨉]))/u, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png' }
];"""
content = re.sub(r'const regionDefinitions = \[.*?\];', lambda m: new_regions, content, flags=re.DOTALL)

# 5. Replace baseRuleProviders
new_base_providers = """const baseRuleProviders = {
  Direct: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Direct.mrs', path: './ruleset/Direct.mrs' },
  Private: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Private.mrs', path: './ruleset/Private.mrs' },
  PrivateIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Private.mrs', path: './ruleset/PrivateIP.mrs' },
  AppleCN: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/AppleCN.mrs', path: './ruleset/AppleCN.mrs' },
  ChinaDomain: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/China.mrs', path: './ruleset/ChinaDomain.mrs' },
  ChinaIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/China.mrs', path: './ruleset/ChinaIP.mrs' },
  fakeip_filter: { ...ruleProviderCommonDomain, url: 'https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs', path: './ruleset/fakeip_filter.mrs' },
  cn_additional: { ...ruleProviderCommonDomain, url: 'https://static-file-global.353355.xyz/rules/cn-additional-list.mrs', path: './ruleset/cn_additional.mrs' },
};"""
content = re.sub(r'const baseRuleProviders = \{.*?\n\};\n\n// 策略组公共配置', lambda m: new_base_providers + '\n\n// 策略组公共配置', content, flags=re.DOTALL)

# 6. Replace serviceConfigs
new_service_configs = """const serviceConfigs = [
  {
    name: 'OpenAI', defaultSelected: 'US',
    providers: { OpenAI: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/OpenAI.mrs', path: './ruleset/OpenAI.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png',
    rules: ['RULE-SET,OpenAI,OpenAI']
  },
  {
    name: 'AI', defaultSelected: 'US',
    providers: { 
      AI: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/AI.mrs', path: './ruleset/AI.mrs' },
      AIIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/AI.mrs', path: './ruleset/AIIP.mrs' }
    },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png',
    rules: ['RULE-SET,AI,AI', 'RULE-SET,AIIP,AI,no-resolve']
  },
  {
    name: 'YouTube',
    providers: { YouTube: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/YouTube.mrs', path: './ruleset/YouTube.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png',
    rules: ['RULE-SET,YouTube,YouTube']
  },
  {
    name: 'Google',
    providers: { 
      Google: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Google.mrs', path: './ruleset/Google.mrs' },
      GoogleIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Google.mrs', path: './ruleset/GoogleIP.mrs' }
    },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png',
    rules: ['RULE-SET,Google,Google', 'RULE-SET,GoogleIP,Google,no-resolve']
  },
  {
    name: 'Spotify', defaultSelected: 'TW', direct: true,
    providers: { Spotify: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Spotify.mrs', path: './ruleset/Spotify.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png',
    rules: ['RULE-SET,Spotify,Spotify']
  },
  {
    name: 'Telegram',
    providers: { 
      Telegram: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Telegram.mrs', path: './ruleset/Telegram.mrs' },
      TelegramIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Telegram.mrs', path: './ruleset/TelegramIP.mrs' }
    },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram_X.png',
    rules: ['RULE-SET,Telegram,Telegram', 'RULE-SET,TelegramIP,Telegram,no-resolve']
  },
  {
    name: 'Games', direct: true,
    providers: { Games: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Games.mrs', path: './ruleset/Games.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Game.png',
    rules: ['RULE-SET,Games,Games']
  },
  {
    name: 'PayPal', direct: true,
    providers: { PayPal: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/PayPal.mrs', path: './ruleset/PayPal.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/PayPal.png',
    rules: ['RULE-SET,PayPal,PayPal']
  },
  {
    name: 'Twitter',
    providers: { Twitter: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Twitter.mrs', path: './ruleset/Twitter.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/X.png',
    rules: ['RULE-SET,Twitter,Twitter']
  },
  {
    name: 'Apple', direct: true,
    providers: { Apple: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Apple.mrs', path: './ruleset/Apple.mrs' } },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png',
    rules: ['RULE-SET,Apple,Apple']
  },
  {
    name: 'Proxies',
    providers: { 
      ProxiesProvider: { ...ruleProviderCommonDomain, url: 'https://github.com/666OS/rules/raw/release/mihomo/domain/Proxy.mrs', path: './ruleset/Proxies.mrs' },
      ProxyIP: { ...ruleProviderCommonIpcidr, url: 'https://github.com/666OS/rules/raw/release/mihomo/ip/Proxy.mrs', path: './ruleset/ProxyIP.mrs' }
    },
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png',
    rules: ['RULE-SET,ProxiesProvider,Proxies', 'RULE-SET,ProxyIP,Proxies,no-resolve']
  }
];"""
content = re.sub(r'const serviceConfigs = \[.*?\];', lambda m: new_service_configs, content, flags=re.DOTALL)

# 7. Update ChinaDNS / fallback behavior in the final part to use ChinaDomain and cn_additional if needed.
# (The template uses 'rule-set:cn' in DNS nameserver-policy, we should change it to 'rule-set:ChinaDomain,cn_additional')
content = content.replace("'rule-set:cn': [...chinaDNS]", "'rule-set:ChinaDomain,cn_additional': [...chinaDNS]")
content = content.replace("finalRules.push(...svc.rules);", "finalRules.push(...svc.rules);")
content = content.replace("'rule-set:private', 'rule-set:fakeip_filter'", "'rule-set:Private', 'rule-set:fakeip_filter'")

# Save
with open('mihomoScript_custom.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Merge completed successfully.")
