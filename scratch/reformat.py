import sys

with open(r'D:\Projects\sub\override.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace block 1
old1 = """// ==========================================
// ★ 核心开关区域 ★
// ==========================================
const excludeHighRateProxiesEnable = false;

// ==========================================
// ★ 节点匹配正则定义 ★
// ==========================================
const excludeFilter ="""
new1 = """// --- 静态配置区域 ---

/**
 * 全局排除高倍率节点配置
 * 该配置用于启用全局排除高倍率节点功能
 * true = 启用
 * false = 禁用
 */
const excludeHighRateProxiesEnable = false;

// --- 节点匹配正则定义 ---

// 定义全局排除节点的正则表达式，用于剔除无关或失效的信息节点
const excludeFilter ="""
content = content.replace(old1, new1)

# Replace block 2
old2 = """  // 基础节点结构校验函数（防止烂节点导致内核崩溃）
  const checkProxy = (proxy) => {"""
new2 = """  // --- 节点过滤与校验 ---

  /**
   * 基础节点结构校验函数
   * 1. 踢出因机场疏漏导致缺少 server/port 等关键字段的坏节点
   * 2. 自动屏蔽 127.0.0.1、0.0.0.0 等占位假节点
   * 以防止 Mihomo 内核加载配置时崩溃
   */
  const checkProxy = (proxy) => {"""
content = content.replace(old2, new2)

old3 = """  // ==========================================
  // 1. 节点过滤与倍率剔除逻辑
  // ==========================================
"""
new3 = """  // 执行节点有效性校验、屏蔽词剔除以及倍率拦截\n"""
content = content.replace(old3, new3)

old4 = """  // ==========================================
  // 2. 基础网络配置
  // ==========================================
"""
new4 = """  // --- 基础网络与内核特性配置 ---\n"""
content = content.replace(old4, new4)

old5 = """  // ==========================================
  // 3. 严谨 DNS 提取策略 (防污染)
  // ==========================================
"""
new5 = """  // --- DNS 提取策略与 Hosts 映射 ---

  // 读取订阅中的 DNS 配置，提取并保留机场私有 DNS (nameserver-policy)
  // 完美解决高端协议机场因公用 DNS 导致无法解析节点落地 IP 的问题\n"""
content = content.replace(old5, new5)

old6 = """  // ==========================================
  // 4. 构建策略组
  // ==========================================
"""
new6 = """  // --- 策略组构建 ---\n"""
content = content.replace(old6, new6)

old7 = """  // ==========================================
  // 5. Rule Providers (纯净 666OS 体系)
  // ==========================================
"""
new7 = """  // --- Rule Providers (666OS 体系) ---
  
  // 完全抛弃臃肿的 MetaCubeX Dat 数据库，采用按需下发的 MRS 规则集
  // 极大幅度降低内存占用并实现精准分流\n"""
content = content.replace(old7, new7)

old8 = """  // ==========================================
  // 6. 路由分流规则 (FCM 彻底交由 Google 规则处理)
  // ==========================================
"""
new8 = """  // --- 路由分流规则 (Rules) ---
  
  // 基于 666OS 设计哲学的核心路由规则
  // 注意：FCM 服务由于大陆环境特殊性，已交由 Google 兜底策略接管\n"""
content = content.replace(old8, new8)

with open(r'D:\Projects\sub\override.js', 'w', encoding='utf-8') as f:
    f.write(content)
