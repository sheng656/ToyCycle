# ToyCycle — Implementation Plan / 实施计划

[中文](#中文版) | [English](#english-version)

---

## 中文版

> "孩子成长很快，玩具不该被浪费。"

### ✅ 已确认决策

| 问题 | 决策 |
|------|------|
| MVP 目标市场 | 中国市场 |
| MVP 语言 | 中文，Day 1 搭建 `next-intl` i18n 架构，不写死文本 |
| 地图服务 | 高德地图 AMap JS API 2.0（Mapbox 在中国被禁，ORS 数据差）|
| 支付 | 微信支付 + 支付宝（MVP），Stripe（国际扩展时）|
| CSS 框架 | Tailwind CSS (v4) |
| 设计系统 | "Tactile-Modern" (来自 Stitch MCP), Quicksand + Nunito Sans |
| 数据库 | 新建 Supabase 项目 |
| 域名 | toycycle.sheng.nz |
| 未来扩展 | 新西兰/国际 → Mapbox + Stripe + 英文 i18n |

---

### 地图服务选型

| 对比 | 高德地图 (AMap) | Mapbox | OpenRouteService |
|------|----------------|--------|-----------------|
| 中国可用性 | ✅ 原生支持 | ❌ 被禁 | ⚠️ 可用但数据差 |
| 坐标系 | GCJ-02（合规）| WGS-84（不合规）| WGS-84（不合规）|
| 等时圈 | 公交原生 + 驾车/步行自定义计算 | 原生 API | 原生 API |
| 新西兰 | ❌ | ✅ 最佳 | ✅ 可用 |

> 设计 `MapProvider` 抽象接口，MVP 用高德实现，国际扩展时接入 Mapbox，无需重构业务逻辑。

---

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 15 (App Router) + React 19 | SSR/SSG，SEO 友好 |
| 样式 | Tailwind CSS | 快速 UI 开发 |
| i18n | next-intl | Day 1 国际化，不写死文本 |
| 后端/数据库 | Supabase | Auth, PostgreSQL, Storage, Realtime |
| 地图 (MVP) | 高德地图 AMap JS API 2.0 | GCJ-02 坐标合规 |
| 地图 (未来) | Mapbox GL JS | 新西兰/国际 |
| 支付 (MVP) | 微信支付 + 支付宝 | H5/JSAPI |
| 支付 (未来) | Stripe | 国际 |
| 部署 | Vercel | 与 Next.js 深度集成 |
| 移动端（未来）| React Native / Expo | 复用核心逻辑 |

---

### Phase 1 — MVP

**原则：做得小，做得精。**

#### 功能清单

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 🌐 i18n 架构 | next-intl + [locale] 路由，所有文本走翻译文件 | P0 |
| 🔐 注册/登录 | Email + OAuth（微信登录）| P0 |
| 🧸 发布玩具 | 标题、描述、照片（最多5张）、品类、年龄段、成色、估值 | P0 |
| 🗺️ 地图附近展示 | 高德地图 + 等时圈（15 分钟步行/车程）| P0 |
| 💬 实时聊天 | 用户间 1v1 聊天 | P0 |
| 🔄 交换请求 | 发起/接受/拒绝交换请求 | P0 |
| 💰 玩具币 | 虚拟积分系统，注册赠送 50 积分 | P0 |
| 💳 微信/支付宝 | H5 支付集成 | P0 |
| 👤 个人资料 | 头像、昵称、位置、发布/交换历史 | P0 |

#### i18n 架构 (Day 1)

所有用户可见文本通过 `next-intl` 翻译函数获取，不写死字符串：

```
src/
├── i18n/                  # 语言配置
│   ├── config.ts          # locales: ['zh'], defaultLocale: 'zh'
│   ├── request.ts         # 按 locale 加载 messages
│   └── routing.ts         # localePrefix: 'as-needed'
├── messages/
│   ├── zh.json            # 中文翻译（MVP）
│   └── en.json            # 英文占位（Phase 4）
└── app/
    └── [locale]/          # 所有页面在 [locale] 下
```

```tsx
// ❌ 写死文本
<button>发布玩具</button>

// ✅ 通过 next-intl
const t = useTranslations('toys');
<button>{t('listToy')}</button>
```

#### 等时圈实现（高德地图）

高德无原生驾车/步行等时圈 API，通过采样 + 路径规划 + Turf.js 凸包实现：

```
用户位置 → 8-16 方向采样点
    ↓ 批量 AMap.Driving / AMap.Walking
    ↓ 筛选 ≤15 分钟可达的点
    ↓ Turf.js 生成凸包多边形
    ↓ AMap.Polygon 渲染
```

#### 玩具币（Toy Credits）

> 积分不等同现金，不可提现——避免金融监管风险。

| 事件 | 积分变动 |
|------|---------|
| 新用户注册 | +50 积分 |
| 送出玩具 | +对应估值积分 |
| 接收玩具 | -对应估值积分 |
| 平台手续费 | 每笔 -5~10% |
| 充值购买 | 微信/支付宝付费 |

---

### Phase 2 — 增长

| 功能 | 描述 |
|------|------|
| 🔔 愿望清单 & 智能匹配 | "我在找奥特曼系列"→附近上架时自动推送 |
| 💳 订阅 | 免费 / Plus (¥29.9/月) / 家庭版 (¥59.9/月) |
| 🛡️ 信任与安全 | 成色标准、信用评分、举报机制 |
| 👶 年龄标签 | 按儿童年龄筛选 |

---

### Phase 3 — 智能化

| 功能 | 描述 |
|------|------|
| 🤖 AI 辅助估值 | 拍照→自动识别品类、品牌、成色；建议价格 ±30% |
| 🌱 环保仪表盘 | "你已减少 18kg 塑料废弃，节省 ¥2,100" |
| 🔗 成长流转链 | "这个乐高已陪伴了 4 个家庭 🏠→🏠→🏠→🏠" |

---

### Phase 4 — 国际化 & 扩展

- 英文翻译 + 新西兰市场适配（Mapbox + Stripe）
- 多品类：婴儿用品 → 童书 → 桌游 → 运动器材
- 移动端：React Native / Expo

---

### 商业模式

```
免费版          → 基础功能，每月最多 3 次交换
Plus (¥29.9/月) → 无限交换，优先热门玩具，每月免 2 次手续费
家庭版(¥59.9/月)→ Plus + 家庭多账号 + 每月额外 100 积分
平台手续费       → 每次交换扣估值的 5-10% 积分
积分充值         → 微信/支付宝购买
```

---

## English Version

> "Kids outgrow toys fast. Toys shouldn't go to waste."

### ✅ Confirmed Decisions

| Decision | Choice |
|----------|--------|
| MVP Market | China |
| MVP Language | Chinese; Day 1 `next-intl` i18n architecture (no hardcoded strings) |
| Map Service | AMap JS API 2.0 (Mapbox banned in China, ORS poor data quality) |
| Payments | WeChat Pay + Alipay (MVP); Stripe (international expansion) |
| CSS Framework | Tailwind CSS (v4) |
| Design System | "Tactile-Modern" (via Stitch MCP), Quicksand + Nunito Sans |
| Database | New Supabase project |
| Domain | toycycle.sheng.nz |
| Future | NZ / International → Mapbox + Stripe + English i18n |

---

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 15 (App Router) + React 19 | SSR/SSG, SEO-friendly |
| Styling | Tailwind CSS | Rapid UI development |
| i18n | next-intl | Day 1 internationalisation, no hardcoded strings |
| Backend / DB | Supabase | Auth, PostgreSQL, Storage, Realtime |
| Maps (MVP) | AMap JS API 2.0 (Gaode) | GCJ-02 compliant for China |
| Maps (future) | Mapbox GL JS | NZ / International |
| Payments (MVP) | WeChat Pay + Alipay | H5 / JSAPI |
| Payments (future) | Stripe | International |
| Deployment | Vercel | Deep Next.js integration |
| Mobile (future) | React Native / Expo | Code sharing with web |

---

### Phase 1 — MVP

**Principle: Build small, build right.**

| Feature | Description | Priority |
|---------|-------------|----------|
| 🌐 i18n Architecture | next-intl + `[locale]` routing; all text from translation files | P0 |
| 🔐 Auth | Email + OAuth (WeChat Login) | P0 |
| 🧸 List Toy | Title, description, photos (max 5), category, age range, condition, value | P0 |
| 🗺️ Map Discovery | AMap + isochrone (15-min walk or drive) | P0 |
| 💬 Real-time Chat | 1-on-1 messaging | P0 |
| 🔄 Exchange Requests | Send / accept / decline | P0 |
| 💰 Toy Credits | Virtual credits; 50 on signup | P0 |
| 💳 WeChat/Alipay | H5 payment integration | P0 |
| 👤 Profile | Avatar, name, location, history | P0 |

#### Map Provider Abstraction

A `MapProvider` interface abstracts the map service, allowing AMap (MVP) and Mapbox (future) to be swapped without changing business logic.

#### Isochrone (AMap)

AMap lacks a native driving/walking isochrone API. We compute it via directional sampling + `AMap.Driving`/`AMap.Walking` + Turf.js convex hull.

---

### Phase 2 — Growth

| Feature | Description |
|---------|-------------|
| 🔔 Wishlist & Matching | "Looking for Ultraman" → auto-notify on nearby listing |
| 💳 Subscriptions | Free / Plus (¥29.9/mo) / Family (¥59.9/mo) |
| 🛡️ Trust & Safety | Condition standards, credit score, report system |
| 👶 Age Tags | Filter by child's age range |

---

### Phase 3 — Smart Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Valuation | Photo → auto-detect brand, category, condition; ±30% price suggestion |
| 🌱 Eco Dashboard | "You've prevented 18kg plastic waste, saved ¥2,100" |
| 🔗 Growth Chain | "This LEGO has brought joy to 4 families 🏠→🏠→🏠→🏠" |

---

### Phase 4 — International Expansion

- English i18n + NZ market (Mapbox + Stripe)
- Multi-category: baby gear → books → board games → sports equipment
- Mobile: React Native / Expo for Android + iOS

---

### Business Model

```
Free            → Basic access, max 3 exchanges/month
Plus (¥29.9/mo) → Unlimited exchanges, priority listings, 2 fee waivers/month
Family(¥59.9/mo)→ All Plus + multi-account family group + 100 bonus Credits/month
Platform fee    → 5–10% of estimated value per exchange (in Credits)
Credit top-up   → Purchase via WeChat Pay / Alipay
```

---

*Last updated: May 2026*
