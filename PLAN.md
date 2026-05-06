# ToyCycle — Implementation Plan / 实施计划

**English** | [中文](#中文版)

---

## English Version

> "Kids outgrow toys fast. Toys shouldn't go to waste."

### ✅ Confirmed Decisions

| Decision | Choice |
|----------|--------|
| Primary Market | New Zealand first, China expansion post-MVP |
| Map Service | Mapbox + OpenRouteService (Gaode/Amap for China) |
| Payments | Stripe (WeChat Pay / Alipay for China) |
| MVP Language | English; i18n bilingual added later |
| CSS Framework | Tailwind CSS |
| Database | New Supabase project |
| Domain | toycycle.sheng.nz |

---

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 15 (App Router) + React 19 | SSR/SSG, SEO-friendly |
| Styling | Tailwind CSS | Rapid UI development |
| Backend / DB | Supabase | Auth, PostgreSQL, Storage, Realtime |
| Maps | Mapbox GL JS + OpenRouteService | Isochrone computation |
| Deployment | Vercel | Deep Next.js integration |
| Mobile (future) | React Native / Expo | Code sharing with web |

> **Note:** Mapbox free tier: 50,000 map loads/month + 300 Isochrone requests/min. OpenRouteService free tier: 500 Isochrone requests/day. Both work in New Zealand and China.

---

### Phase 1 — MVP

**Principle: Build small, build right.**

#### Feature Set

| Feature | Description | Priority |
|---------|-------------|----------|
| 🔐 Auth | Email + OAuth (Google) | P0 |
| 🧸 List Toy | Title, description, photos (max 5), category, age range, condition, estimated value | P0 |
| 🗺️ Map Discovery | Isochrone-based nearby toy display (15-min walk or drive) | P0 |
| 💬 Real-time Chat | 1-on-1 messaging between users | P0 |
| 🔄 Exchange Requests | Send / accept / decline requests | P0 |
| 💰 Toy Credits | Virtual credit system; new users get 50 credits on signup | P0 |
| 👤 Profile | Avatar, display name, location, listing history | P0 |

#### Project Structure

```
ToyCycle/
├── public/
│   └── icons/                    # PWA icons
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Home — map + nearby toys
│   │   ├── manifest.ts           # PWA manifest
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── toys/
│   │   │   ├── page.tsx          # Browse / search
│   │   │   ├── [id]/page.tsx     # Toy detail
│   │   │   └── new/page.tsx      # List a toy
│   │   ├── chat/
│   │   │   ├── page.tsx          # Conversation list
│   │   │   └── [id]/page.tsx     # Chat window
│   │   ├── exchanges/page.tsx    # Exchange management
│   │   └── profile/
│   │       ├── page.tsx          # Own profile
│   │       └── [id]/page.tsx     # Other user profile
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   ├── map/                  # Map components
│   │   ├── toys/                 # Toy cards, forms
│   │   ├── chat/                 # Chat components
│   │   └── layout/               # Header, Nav, Footer
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts
│   │   ├── map/
│   │   │   ├── mapbox.ts
│   │   │   └── isochrone.ts      # Isochrone API wrapper
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   └── middleware.ts             # Auth guard
├── supabase/
│   └── migrations/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

#### Database Schema (Supabase PostgreSQL)

**Core Tables:**

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles extending Supabase Auth; includes location + credit balance |
| `toys` | Toy listings. `status`: available / reserved / exchanged |
| `toy_images` | Up to 5 images per toy, stored in Supabase Storage |
| `exchange_requests` | `status`: pending / accepted / rejected / completed |
| `conversations` + `messages` | Real-time chat via Supabase Realtime |
| `credit_transactions` | Toy Credits ledger (earn / spend / bonus) |

#### Isochrone (Time-Distance) Geography

This is the core differentiator. **"Time distance" is more intuitive to users than physical radius.**

```
User selects → "15-min walk" or "15-min drive"
                    ↓
   Call Mapbox Isochrone API or OpenRouteService
                    ↓
   Returns GeoJSON polygon (isochrone)
                    ↓
   Render semi-transparent zone on map
                    ↓
   Filter toys using PostGIS ST_Contains
```

**Strategy:** Use OpenRouteService during development (free), Mapbox in production (more accurate, generous free tier).

#### Toy Credits System

> **Credits are NOT redeemable for cash** — this avoids financial regulation, stored-value, and virtual currency legal risk.

| Event | Credits Change |
|-------|---------------|
| New user signup | +50 Credits (cold-start liquidity) |
| Toy listed and accepted | +credits matching estimated value |
| Claiming a toy | −credits matching estimated value |
| Platform fee | −5–10% of value per transaction |

---

### Phase 2 — Growth

| Feature | Description |
|---------|-------------|
| 🔔 Wishlist & Matching | Post "Looking for Ultraman series" → auto-notify when nearby toy is listed |
| 💳 Subscriptions | Free / Plus ($4.99/mo) / Family ($9.99/mo) via Stripe |
| 🛡️ Trust & Safety | Condition standards, cleanliness flag, credit score, report system |
| 👶 Age Tags | Filter by child's age range |

---

### Phase 3 — Smart Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Valuation | Photo → auto-detect brand, category, condition; suggest price range ±30% |
| 🌱 Eco Dashboard | "You've prevented 18kg of plastic waste and saved $320" |
| 🔗 Growth Chain | "This LEGO has brought joy to 4 families 🏠→🏠→🏠→🏠" |

---

### Phase 4 — Platform Expansion

- **Multi-category:** Baby gear → children's books → board games → sports equipment
- **Mobile apps:** React Native / Expo for Android + iOS
- **China market:** Gaode Maps + WeChat/Alipay + Chinese i18n

---

### Business Model

```
Free tier          → Basic access, max 3 exchanges/month
Plus  ($4.99/mo)   → Unlimited exchanges, priority listings, 2 fee waivers/month
Family ($9.99/mo)  → All Plus benefits + multi-account family group + 100 bonus Credits/month
Platform fee       → 5–10% of toy estimated value per exchange (in Credits)
Credit top-up      → Users can purchase extra Credits (future)
```

---

## 中文版

> "孩子成长很快，玩具不该被浪费。"

### ✅ 已确认决策

| 问题 | 决策 |
|------|------|
| 目标市场 | 新西兰优先，MVP 后扩展中国 |
| 地图服务 | Mapbox + OpenRouteService（中国扩展时接入高德）|
| 支付 | Stripe（中国版接入微信/支付宝）|
| MVP 语言 | 英文，后续 i18n 双语 |
| CSS 框架 | Tailwind CSS |
| 数据库 | 新建 Supabase 项目 |
| 域名 | toycycle.sheng.nz |

---

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 15 (App Router) + React 19 | SSR/SSG，SEO 友好 |
| 样式 | Tailwind CSS | 快速 UI 开发 |
| 后端/数据库 | Supabase | Auth, PostgreSQL, Storage, Realtime |
| 地图 | Mapbox GL JS + OpenRouteService | 等时圈计算 |
| 部署 | Vercel | 与 Next.js 深度集成 |
| 移动端（未来）| React Native / Expo | 复用核心逻辑 |

---

### Phase 1 — MVP（最小可行产品）

**原则：做得小，做得精。**

#### 功能清单

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 🔐 注册/登录 | Email + OAuth（Google）| P0 |
| 🧸 发布玩具 | 标题、描述、照片（最多5张）、品类、年龄段、成色、估值 | P0 |
| 🗺️ 地图附近展示 | 基于等时圈（15 分钟步行/车程）展示附近玩具 | P0 |
| 💬 实时聊天 | 用户间 1v1 聊天 | P0 |
| 🔄 交换请求 | 发起/接受/拒绝交换请求 | P0 |
| 💰 玩具币 | 虚拟积分系统，注册赠送 50 积分 | P0 |
| 👤 个人资料 | 头像、昵称、位置、发布/交换历史 | P0 |

#### 等时圈（Isochrone）地理围栏

这是产品的核心差异化功能。**"时间距离"比"物理距离"更符合用户直觉。**

```
用户选择 → "15分钟步行" 或 "15分钟车程"
                ↓
    调用 Mapbox Isochrone API 或 OpenRouteService
                ↓
    返回 GeoJSON 多边形（等时圈）
                ↓
    在地图上渲染半透明区域
                ↓
    使用 PostGIS ST_Contains 过滤区域内玩具
```

**策略：** 开发阶段用 OpenRouteService（完全免费），生产环境用 Mapbox（更精准，免费额度充足）。

#### 玩具币（Toy Credits）系统

> **积分不等同现金，不可提现** — 避免金融监管、储值和虚拟货币法律风险。

| 事件 | 积分变动 |
|------|---------|
| 新用户注册 | +50 积分（冷启动流动性）|
| 送出玩具（被接受）| +对应估值积分 |
| 接收玩具 | -对应估值积分 |
| 平台手续费 | 每笔扣除估值的 5-10% 积分 |

---

### Phase 2 — 增长功能

| 功能 | 描述 |
|------|------|
| 🔔 愿望清单 & 智能匹配 | 发布"我在找奥特曼系列"→附近上架时自动推送通知 |
| 💳 订阅付费 | Free / Plus ($4.99/月) / Family ($9.99/月) via Stripe |
| 🛡️ 信任与安全 | 成色标准化、已清洗标记、信用评分、举报机制 |
| 👶 年龄标签 | 按儿童年龄范围筛选 |

---

### Phase 3 — 智能化功能

| 功能 | 描述 |
|------|------|
| 🤖 AI 辅助估值 | 拍照→自动识别品牌、品类、成色；建议价格区间 ±30% |
| 🌱 环保数据仪表盘 | "你已减少 18kg 塑料废弃物，节省 $320" |
| 🔗 成长流转链 | "这个 LEGO 已陪伴了 4 个家庭 🏠→🏠→🏠→🏠" |

---

### Phase 4 — 平台扩展

- **多品类：** 婴儿用品 → 童书 → 桌游 → 运动器材
- **移动端：** React Native / Expo 开发 Android + iOS 原生应用
- **中国市场：** 高德地图 + 微信/支付宝 + 中文 i18n

---

### 商业模式

```
免费版          → 基础功能，每月最多 3 次交换
Plus ($4.99/月) → 无限次交换，优先看热门玩具，每月免除 2 次手续费
Family($9.99/月)→ 全部 Plus 权益 + 多账号家庭组 + 每月额外 100 积分
平台手续费       → 每次交换扣除估值的 5-10% 积分
积分充值         → 用户可购买额外积分（未来）
```

---

*Last updated: May 2026*
