# 🧸 ToyCycle | 玩具循环

[中文](#中文版) | [English](#english-version)

---

## 中文版

**让每一个旧玩具，开启一段新友谊。**

ToyCycle 是一个专注于社区玩具交换的平台。通过地理位置发现邻居家的有趣玩具，利用“玩具币”积分系统实现公平交换，让闲置玩具重新流动起来。

### 🌟 核心功能 (MVP)

- **📍 地图发现**: 基于高德地图，实时查看周边 15 分钟生活圈内的玩具。
- **🔄 交换流程**: 完整的“发起申请 - 扣除预留金 - 主人审批 - 结算积分”闭环逻辑。
- **💰 玩具币系统**: 科学的积分体系，新用户注册即领 50 积分，保障交换的公平性。
- **👤 个人仪表盘**: 管理“我的玩具”、审批收到的申请、跟踪发出的意向。
- **💬 实时消息**: 基于 Supabase Realtime 的即时通讯，支持反骚扰（待处理状态发信限制）。
- **📱 响应式设计**: 完美适配移动端与桌面端，提供丝滑的 Tactile-Modern 交互体验。

### 📱 移动端 (当前重点)
项目已全面转向移动原生开发，提供更流畅的交互体验。

- **框架**: Expo SDK 55 + React Native
- **地图**: react-native-maps + 高德地图瓦片
- **设计**: Tactile-Modern 触感现代设计系统
- **通讯**: Supabase Realtime 实时聊天 + Expo Notifications

### 🌍 Web 端 (原型)
早期 Web 原型基于 Next.js 14 + TailwindCSS。

### 🚀 快速开始

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动移动端**:
   ```bash
   cd apps/mobile
   npm run start
   ```

### 📅 路线图

- [x] Phase 1: 核心基础、地图集成与交换流程 (Web)
- [x] Phase 2: 实时消息系统与防骚扰逻辑 (Web)
- [x] Phase 3: 移动端原生开发迁移 (React Native + Expo SDK 55)
- [x] Phase 4: 地图发现、玩具发布与实时聊天 (Mobile)
- [ ] Phase 5: 推送通知优化与应用商店上线准备

---

## English Version

**Give every old toy a new friendship.**

ToyCycle is a platform focused on community toy exchange. Discover interesting toys in your neighborhood through geolocation, use a "Toy Coin" credit system for fair exchanges, and get idle toys flowing again.

### 🌟 Core Features (MVP)

- **📍 Map Discovery**: Real-time view of toys within a 15-minute living circle based on AMap.
- **🔄 Exchange Workflow**: Complete closed-loop logic of "request - deduct reserve - owner approval - settle credits".
- **💰 Credits System**: Scientific credit system, new users get 50 credits upon registration, ensuring fairness.
- **👤 Dashboard**: Manage "My Toys", approve received requests, track sent intentions.
- **💬 Realtime Chat**: Instant messaging via Supabase Realtime with anti-harassment limits.
- **📱 Tactile-Modern UI**: Premium interactive experience across mobile and desktop.

### 📱 Mobile (Current Focus)
The project has shifted to native mobile development for a superior user experience.

- **Framework**: Expo SDK 55 + React Native
- **Maps**: react-native-maps + AMap Tiles
- **Design**: Tactile-Modern Design System
- **Messaging**: Supabase Realtime + Expo Notifications

### 🌍 Web (Legacy Prototype)
Early web prototype built with Next.js 14 + TailwindCSS.

### 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Mobile App**:
   ```bash
   cd apps/mobile
   npm run start
   ```

### 📅 Roadmap

- [x] Phase 1: Core foundation, map integration and exchange workflow (Web)
- [x] Phase 2: Realtime messaging system and anti-harassment logic (Web)
- [x] Phase 3: Native mobile migration (React Native + Expo SDK 55)
- [x] Phase 4: Map discovery, publishing, and real-time chat (Mobile)
- [ ] Phase 5: Push notification optimization and App Store prep

---

### 📄 License
MIT License.
