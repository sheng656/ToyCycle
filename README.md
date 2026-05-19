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

### 🔬 核心字段审计与自动化测试 (M5.5)

为了解决移动端与 Supabase 数据库字段不匹配导致的崩溃问题，项目进行了一次全面的字段审计与修复，并搭建了完整的自动化测试框架。

#### 1. 数据库字段审计与修复
- **双表级联插入**: `publish.tsx` 从直接向 `toys` 插入图片修复为在 `toys` 插入成功后，级联插入 `toy_images` 关联表。默认未定位用户回退至北京中心坐标 `(39.9042, 116.4074)`。
- **字段规范化**: 将所有页面/组件中请求 profiles 表的 `full_name` 改为 `display_name`，定位字段 `location_lat`/`location_lng` 改为 `latitude`/`longitude`，修复聊天和详情页展示。
- **图片关联查询**: 修复 `index.tsx`, `toys/[id].tsx`, `messages.tsx` 中的关联查询，使用 `images:toy_images(*)` 获取真实存储图片。

#### 2. 自动化测试配置 (Jest + RNTL)
我们为 `apps/mobile` 配置了完整的测试框架（`jest-expo` & `@testing-library/react-native`）：
- **运行测试**:
  ```bash
  cd apps/mobile
  npm run test
  ```
- **测试覆盖范围**:
  - **UI 组件**: `Button`、`Input`、`Chip`。由于 React Native 0.83.6 中 Native TextInput 的底层匹配限制，采用 `UNSAFE_getByProps` 实现了健壮的字段匹配。
  - **状态管理**: 单元测试覆盖 `useAuthStore` 鉴权与 Session 自动保存。
  - **核心页面**: 包含 `publish.tsx` 发布表单验证逻辑与 `toys/[id].tsx` 详情页级联加载/状态测试。

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

### 🔬 Core Database Audit & Automated Testing (M5.5)

To resolve database column mismatches causing crashes or blank states on the mobile app, we conducted a comprehensive DB schema audit, resolved key SQL join/insert inconsistencies, and configured a robust automated testing environment.

#### 1. Database Schema Audit & Inconsistency Fixes
- **Cascading Image Insertion**: Updated `publish.tsx` to insert into `toys` first, fetch the record ID, and then cascade inserts into `toy_images`. Location fallbacks set to Beijing `(39.9042, 116.4074)` for priority testing.
- **Column Standardisation**: Changed all occurrences of non-existent `full_name` in profile queries to `display_name`, and mapped `location_lat`/`location_lng` to `latitude`/`longitude` to match database schema.
- **Relational Image Selection**: Resolved selection queries in `index.tsx`, `toys/[id].tsx`, and `messages.tsx` to fetch `images:toy_images(*)` instead of assuming a flat column in `toys`.

#### 2. Automated Testing Environment (Jest + RNTL)
We configured a comprehensive testing framework matching Expo SDK 55 in `apps/mobile`:
- **Run Tests**:
  ```bash
  cd apps/mobile
  npm run test
  ```
- **Test Coverage**:
  - **UI Components**: Unit tests for `Button`, `Input`, and `Chip`. Addressed React Native 0.83.6 custom text input mock limitations by querying utilizing `UNSAFE_getByProps`.
  - **State Store**: Standard unit tests for `useAuthStore` session sync and state persistence.
  - **Screen Integrations**: Logic validation and UI flows on `publish.tsx` form inputs and `toys/[id].tsx` detail screens.

### 📅 Roadmap

- [x] Phase 1: Core foundation, map integration and exchange workflow (Web)
- [x] Phase 2: Realtime messaging system and anti-harassment logic (Web)
- [x] Phase 3: Native mobile migration (React Native + Expo SDK 55)
- [x] Phase 4: Map discovery, publishing, and real-time chat (Mobile)
- [ ] Phase 5: Push notification optimization and App Store prep

---

### 📄 License
MIT License.
