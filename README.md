# AssetOps — Equipment Management Platform

A **production-grade Equipment & Operations Management platform** built with **Next.js 14**, focused on **real-world frontend architecture, data consistency, and decision-oriented dashboards**.

This project was designed to simulate how a **mid-size or enterprise operations team** would manage physical assets, maintenance cycles, and operational risk — with clarity, performance, and scalability in mind.

---

## 🚀 Live Demo

- **Production URL:**  
  https://equipment-dashboard-three.vercel.app/

- **Repository:**  
  https://github.com/EduardoVisconti/equipment-dashboard

---

## 🔑 Demo Access

A **public demo account** is available for evaluation.

**Credentials:**

- Email: `client@test.com`
- Password: `123456`

> ⚠️ Demo data is non-sensitive and may be reset at any time.

---

## 🧱 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts (customized via shadcn chart container)

### State & Data
- TanStack React Query (server-state management)
- React Hook Form
- Zod (schema validation)

### Backend / Services
- Firebase Firestore
- Firebase Authentication (Email / Password)

### Tooling
- Vercel (Deployment)
- ESLint
- Prettier
- Conventional Commits

---

## ✨ Core Features

### 🔐 Authentication & Access Control
- Firebase Email/Password authentication
- Protected routes using Next.js route groups
- Client-side session validation with loading states
- Firestore writes restricted to authenticated users

---

### 🧰 Equipment Management (CRUD)
- Create, edit, and delete assets
- Shared form logic for add/edit flows
- Schema validation with Zod
- Automatic maintenance date calculation
- Optional service interval per asset
- Optimistic UI updates with React Query

**Tracked asset fields:**
- Name
- Serial number
- Status (In Service / Maintenance / Out of Service)
- Purchase date
- Last service date
- Next service date (manual or auto-derived)
- Service interval (days)
- Location
- Owner

---

### 📊 Operational Dashboard
A real-time operational overview focused on **actionability**:

- Total assets
- Assets in service / out of service
- Maintenance due (7d / 30d)
- Overdue maintenance
- Data quality score (critical fields completeness)
- Priority alerts
- At-risk assets list
- Recent activity feed

> Dashboard metrics are derived dynamically from Firestore data — no mock logic.

---

### 📈 Analytics Page
A separate analytics view designed for **strategic insights**, not redundancy:

- Assets in scope (filter-based)
- Status distribution (Pie + Bar charts)
- Maintenance trends
- Assets created over time (Area chart)
- Overdue & upcoming maintenance detection
- Operational insights generated from live data
- Time range and status filters

> Analytics and Dashboard intentionally answer **different questions**.

---

### ⌨️ Command Palette (Cmd / Ctrl + K)
- Keyboard-first navigation
- Quick access to core actions and pages
- Improves power-user workflow

---

### 🎨 UX & UI Enhancements
- Skeleton loaders
- Empty states with guidance
- Toast notifications (Sonner)
- Confirmation dialogs
- Responsive layout (mobile → desktop)
- Dark / Light mode
- Consistent spacing & visual hierarchy

---

## 🔐 Firebase Security Model

Firestore rules:

```
allow read: if true;
allow write: if request.auth != null;
```

### Why?
- Enables Server Component data fetching
- Maintains write security
- Matches real-world SSR constraints

---

## 🗂️ Project Structure (Simplified)

```
app/
 ├─ (auth)/login
 ├─ (protected)/dashboard
 ├─ (protected)/equipments
 ├─ (protected)/analytics

components/
 ├─ core (navigation, headers, overlays)
 ├─ ui (shadcn)

data-access/
 ├─ equipments (Firestore logic)

types/
```

---

## 🧠 Architectural Decisions

- Clear separation between **operational view** (Dashboard) and **analytical view** (Analytics)
- React Query as the single source of server truth
- Minimal schema, derived data where possible
- Avoided premature abstractions
- Strong emphasis on UX clarity and predictability

---

## 🧪 Running Locally

```bash
git clone https://github.com/EduardoVisconti/equipment-dashboard
cd equipment-dashboard
npm install
npm run dev
```

Create a `.env.local` file with your Firebase credentials.

---

## 🏁 Project Status

- Feature complete
- Production-ready demo
- Clean architecture
- No known bugs

---

## 👨‍💻 Author

**Eduardo Visconti**  
Frontend Developer  
Focused on modern React, UX-driven systems, and scalable frontend architecture.
