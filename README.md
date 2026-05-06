# 🧸 ToyCycle

**English** | [中文](#中文)

---

## English

> "Kids outgrow toys fast. Toys shouldn't go to waste."

**ToyCycle** is a location-based community platform that enables families to exchange, share, and circulate toys locally — reducing plastic waste while strengthening neighbourhood connections.

### Why ToyCycle?

Children grow quickly, yet the average toy is used for only a few months before being forgotten in a cupboard. ToyCycle solves this by connecting nearby families through a trusted exchange ecosystem, so toys keep moving, kids stay engaged, and landfills stay lighter.

### Core Concept

- **Neighbourhood-first**: Discovery is powered by **isochrone mapping** — showing toys reachable within a 15-minute walk or drive, not just a flat radius.
- **Toy Credits**: A virtual currency (non-redeemable for cash) that incentivises giving. List a toy → earn Credits. Claim a toy → spend Credits.
- **Community trust**: Condition ratings, cleanliness flags, and a user credit score keep quality high.
- **Emotional value**: Every toy shows its "journey" — how many families it has brought joy to.

### Feature Roadmap

| Phase | Status | Highlights |
|-------|--------|------------|
| **MVP** | 🚧 In Progress | Auth, toy listing, map discovery, real-time chat, exchange requests, Toy Credits |
| **Growth** | ⬜ Planned | Wishlist matching, subscription tiers, trust & safety system |
| **Smart** | ⬜ Planned | AI-assisted valuation, eco impact dashboard, growth chain timeline |
| **Expand** | ⬜ Planned | Baby gear, books, board games, sports equipment; React Native mobile apps |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (Auth, PostgreSQL, Storage, Realtime) |
| Maps | Mapbox GL JS + OpenRouteService (Isochrone) |
| Deployment | Vercel → [toycycle.sheng.nz](https://toycycle.sheng.nz) |
| Mobile (future) | React Native / Expo |

### Getting Started

```bash
# Clone the repo
git clone https://github.com/sheng656/ToyCycle.git
cd ToyCycle

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Mapbox keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
NEXT_PUBLIC_ORS_API_KEY=your_openrouteservice_key
```

### Vision

ToyCycle's ultimate value is not just toys — it is a **location-based community resource circulation system**. Toys are the best entry point. The platform is designed to grow into a full neighbourhood circular economy, eventually covering baby gear, books, board games, sports equipment, and more.

---

## 中文

> "孩子成长很快，玩具不该被浪费。"

**ToyCycle** 是一个基于地理位置的社区玩具循环平台，帮助家庭在附近交换、共享玩具——减少塑料废弃物，同时建立真实的邻里联系。

### 为什么是 ToyCycle？

孩子成长迅速，一个玩具平均只被使用几个月便被遗忘在柜子里。ToyCycle 通过可信任的交换生态系统连接附近的家庭，让玩具持续流通，孩子保持新鲜感，减少垃圾填埋。

### 核心理念

- **邻里优先**：发现功能由**等时圈地图**驱动——展示 15 分钟步行或车程范围内的玩具，而非简单的直线半径。
- **玩具币（Toy Credits）**：虚拟积分（不可提现），激励用户捐出玩具。发布玩具→获得积分；领取玩具→消耗积分。
- **社区信任**：成色评级、已清洗标记和用户信用评分保证质量。
- **情感价值**：每个玩具展示其"流转旅程"——已经为多少个家庭带来欢乐。

### 功能路线图

| 阶段 | 状态 | 亮点 |
|------|------|------|
| **MVP** | 🚧 开发中 | 注册登录、玩具发布、地图发现、实时聊天、交换请求、玩具币系统 |
| **增长** | ⬜ 计划中 | 愿望清单智能匹配、订阅付费、信任安全体系 |
| **智能化** | ⬜ 计划中 | AI 辅助估值、环保影响仪表盘、成长流转链 |
| **扩展** | ⬜ 计划中 | 婴儿用品、童书、桌游、运动器材；React Native 移动端 |

### 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) + React 19 |
| 样式 | Tailwind CSS |
| 后端/数据库 | Supabase（Auth、PostgreSQL、Storage、Realtime）|
| 地图 | Mapbox GL JS + OpenRouteService（等时圈）|
| 部署 | Vercel → [toycycle.sheng.nz](https://toycycle.sheng.nz) |
| 移动端（未来）| React Native / Expo |

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/sheng656/ToyCycle.git
cd ToyCycle

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 填写你的 Supabase 和 Mapbox 密钥

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 平台愿景

ToyCycle 的核心价值不是"玩具"，而是**基于地理位置的社区资源循环系统**。玩具只是最佳切入口。平台最终将扩展为涵盖婴儿用品、童书、桌游、运动器材等品类的完整邻里循环经济。

---

*Built with ❤️ for families, communities, and the planet.*
