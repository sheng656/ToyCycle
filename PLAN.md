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
| 地图服务 | 高德地图 AMap JS API 2.0（Web）/ AMap Tiles (Mobile) |
| 支付 | 微信支付 + 支付宝（MVP），Stripe（国际扩展时）|
| CSS 框架 | Tailwind CSS (Web) / Vanilla CSS (Mobile) |
| 设计系统 | "Tactile-Modern" (来自 Stitch MCP), Quicksand + Nunito Sans |
| 数据库 | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| 域名 | toycycle.sheng.nz |

---

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **移动端 (核心)** | **React Native / Expo** | **SDK 55，当前主攻方向** |
| Web 框架 | Next.js 15 (App Router) | SSR/SSG，SEO 友好 |
| i18n | i18next (Mobile) / next-intl (Web) | 共享翻译 Key |
| 后端/数据库 | Supabase | Auth, PostgreSQL, Storage, Realtime |
| 地图 (移动) | React-Native-Maps + AMap Tiles | 双平台支持 |
| 地图 (Web) | 高德地图 AMap JS API 2.0 | GCJ-02 坐标合规 |
| 部署 | Expo EAS (Mobile) / Vercel (Web) | 自动化发布 |

---

### 📅 路线图 (Roadmap)

#### Phase 1 — MVP (Web Prototype) - ✅ 已完成
- [x] i18n 架构搭建
- [x] Supabase Auth 鉴权
- [x] 玩具发布与详情展示
- [x] 高德地图 15 分钟生活圈集成
- [x] 实时消息系统基础

#### Phase 2 — 原生移动端迁移 (Mobile Phase) - 🚀 进行中
- [x] **M1: 设计系统 Token 化** (Colors, Typography, Spacing)
- [x] **M2: 移动端鉴权与路由守卫** (SecureStore 集成)
- [x] **M3: 地图发现功能** (高德瓦片渲染)
- [x] **M4: 玩具发布与真实存储** (Supabase Storage 集成)
- [x] **M5: 实时聊天与交换管理** (Realtime 订阅)
- [x] **M5.5: 核心字段审计与自动化测试** (Jest + RNTL 测试环境，覆盖 23 个测试用例，彻底修复 6 大数据库字段不一致崩溃问题)
- [ ] **M6: 推送通知与性能优化** (Expo Notifications)

---

### 商业模式与扩展
- **积分系统**: 注册赠送 50 积分，交换扣除/获取对应估值。
- **国际化**: 新西兰/国际市场扩展 (Mapbox + Stripe + 英文)。

---

## English Version

> "Kids outgrow toys fast. Toys shouldn't go to waste."

### ✅ Confirmed Decisions

| Decision | Choice |
|----------|--------|
| MVP Market | China |
| MVP Language | Chinese; Day 1 i18n architecture (no hardcoded strings) |
| Map Service | AMap JS API 2.0 (Web) / AMap Tiles (Mobile) |
| Payments | WeChat Pay + Alipay (MVP); Stripe (international expansion) |
| Tech Stack | React Native/Expo (Mobile Focus), Next.js (Web) |
| Design System | "Tactile-Modern" (via Stitch MCP), Quicksand + Nunito Sans |
| Database | Supabase (PostgreSQL, Auth, Realtime, Storage) |

---

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Mobile (Core)** | **React Native / Expo** | **SDK 55, Current Priority** |
| Web Framework | Next.js 15 (App Router) | SSR/SSG, SEO-friendly |
| i18n | i18next (Mobile) / next-intl (Web) | Shared translation keys |
| Backend / DB | Supabase | Auth, PostgreSQL, Storage, Realtime |
| Maps (Mobile) | React-Native-Maps + AMap Tiles | Dual platform support |
| Maps (Web) | AMap JS API 2.0 | GCJ-02 compliant for China |
| Deployment | Expo EAS (Mobile) / Vercel (Web) | Automated delivery |

---

### 📅 Roadmap

#### Phase 1 — MVP (Web Prototype) - ✅ Completed
- [x] i18n Architecture
- [x] Supabase Auth
- [x] Toy Listing & Details
- [x] AMap 15-min Isochrone Integration
- [x] Basic Real-time Chat

#### Phase 2 — Native Mobile Migration - 🚀 In Progress
- [x] **M1: Design Tokenization** (Colors, Typography, Spacing)
- [x] **M2: Mobile Auth & Auth Guard** (SecureStore integration)
- [x] **M3: Map Discovery** (AMap Tiles rendering)
- [x] **M4: Publishing & Real Storage** (Supabase Storage integration)
- [x] **M5: Real-time Chat & Exchange Management** (Realtime subscription)
- [x] **M5.5: Database Field Audit & Automated Testing** (Jest + RNTL test suites with 23 test cases, resolved 6 critical database column mismatch bugs)
- [ ] **M6: Push Notifications & Performance Tuning** (Expo Notifications)

---

### Business Model & Future
- **Credit System**: 50 Credits on signup; swap based on estimated value.
- **Expansion**: NZ / International market (Mapbox + Stripe + English).

---

*Last updated: May 2026*
