# 🧸 ToyCycle | 玩具循环

[中文](#中文版) | [English](#english-version)

---

## 中文版

**让每一个旧玩具，开启一段新友谊。**

ToyCycle 是一个专注于社区玩具交换的平台。通过地理位置发现邻居家的有趣玩具，利用“玩具币”积分系统实现公平交换，让闲置玩具重新流动起来。

### 🌟 核心功能 (MVP)

- **📍 地图发现**: 基于高德地图 JS API 2.0，实时查看周边 15 分钟生活圈内的玩具。
- **🔄 交换流程**: 完整的“发起申请 - 扣除预留金 - 主人审批 - 结算积分”闭环逻辑。
- **💰 玩具币系统**: 科学的积分体系，新用户注册即领 50 积分，保障交换的公平性。
- **👤 个人仪表盘**: 管理“我的玩具”、审批收到的申请、跟踪发出的意向。
- **💬 实时消息**: 基于 Supabase Realtime 的即时通讯，支持反骚扰（待处理状态发信限制）。
- **📱 响应式设计**: 完美适配移动端与桌面端，提供丝滑的 Tactile-Modern 交互体验。

### 🛠️ 技术栈

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/DB**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime, Storage)
- **Map**: [高德地图 AMap JS API 2.0](https://lbs.amap.com/)
- **I18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Monorepo**: [Turborepo](https://turbo.build/)

### 🚀 快速开始

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **配置环境变量**:
   在 `apps/web/.env.local` 中配置以下 Key:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_AMAP_KEY`
   - `NEXT_PUBLIC_AMAP_SECURITY_CODE`

3. **启动开发服务器**:
   ```bash
   npm run dev
   ```

### 📅 路线图

- [x] Phase 1: 核心基础、地图集成与交换流程
- [x] Phase 2a: 实时消息系统与防骚扰逻辑
- [ ] Phase 2b: Vercel 部署与地理筛选优化
- [ ] Phase 3: 微信/支付宝扫码登录集成
- [ ] Phase 4: 手机原生 App 开发 (React Native)

### 📄 开源协议
MIT License.

---

## English Version

**Give every old toy a new friendship.**

ToyCycle is a platform focused on community toy exchange. Discover interesting toys in your neighborhood through geolocation, use a "Toy Coin" credit system for fair exchanges, and get idle toys flowing again.

### 🌟 Core Features (MVP)

- **📍 Map Discovery (AMap Integration)**: Based on AMap JS API 2.0, view toys within a 15-minute living circle in real-time.
- **🔄 Exchange Workflow**: Complete closed-loop logic of "request - deduct reserve - owner approval - settle credits".
- **💰 Credits System**: Scientific credit system, new users get 50 credits upon registration, ensuring exchange fairness.
- **👤 Dashboard**: Manage "My Toys", approve received requests, track sent intentions.
- **💬 Realtime Chat**: Instant messaging based on Supabase Realtime, supporting anti-harassment (message limits for pending requests).
- **📱 Responsive UI**: Perfectly adapted for mobile and desktop, providing a smooth Tactile-Modern interactive experience.

### 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/DB**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime, Storage)
- **Map**: [AMap JS API 2.0](https://lbs.amap.com/)
- **I18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Monorepo**: [Turborepo](https://turbo.build/)

### 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Configure the following keys in `apps/web/.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_AMAP_KEY`
   - `NEXT_PUBLIC_AMAP_SECURITY_CODE`

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

### 📅 Roadmap

- [x] Phase 1: Core foundation, map integration and exchange workflow
- [x] Phase 2a: Realtime messaging system and anti-harassment logic
- [ ] Phase 2b: Vercel deployment and geo-filtering optimization
- [ ] Phase 3: WeChat/Alipay QR code login integration
- [ ] Phase 4: Mobile native App development (React Native)

### 📄 License
MIT License.
