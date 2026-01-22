# AssetOps — Enterprise Asset & Maintenance Operations Platform

AssetOps is a **production-grade asset and maintenance operations platform** built with **Next.js 14 (App Router)** and **Firebase**, designed to closely reflect how **real-world operations, facilities, and maintenance teams** manage physical assets at scale.

This project focuses on **enterprise frontend architecture**, **data integrity**, **auditability**, and **decision-oriented dashboards**. It is suitable both as a **portfolio-grade system** and as a solid foundation for a real-world SaaS product.

---

## 🚀 Live Demo

- **Production URL:**  
  https://equipment-dashboard-three.vercel.app/

- **Repository:**  
  https://github.com/EduardoVisconti/equipment-dashboard

---

## 🔑 Demo Access

A public demo account is available for evaluation purposes.

- **Email:** `client@test.com`
- **Password:** `123456`

> Demo data is non-sensitive and may be reset at any time.

---

## 🧱 Tech Stack

### Frontend

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- Recharts

### State & Data Management

- TanStack React Query (server-state management)
- React Hook Form
- Zod (schema validation)

### Backend / Services

- Firebase Firestore
- Firebase Authentication (Email / Password)

### Tooling & Platform

- Vercel (deployment)
- ESLint / Prettier
- Conventional Commits

---

## 🎯 Product Scope

AssetOps enables teams to:

- Register and manage physical assets
- Track operational status and lifecycle
- Manage preventive and corrective maintenance
- Detect overdue and upcoming service events
- Monitor operational health via dashboards
- Analyze trends and historical data
- Maintain immutable audit trails
- Enforce role-based access control (admin / viewer)
- Archive assets without breaking historical integrity

---

## ✨ Core Features

### 🔐 Authentication & Role-Based Access

- Firebase Email/Password authentication
- Protected routes via Next.js route groups
- Role-based permissions:
  - **Admin:** full write access
  - **Viewer:** read-only access
- UX-level permission enforcement
- Security enforced via Firestore Rules

---

### 🧰 Asset (Equipment) Management

- Create, edit, archive, and restore assets
- Enterprise-safe handling of archived records
- Serial number uniqueness validation
- Automatic maintenance interval calculations
- Full audit metadata on all write operations

**Tracked fields include:**

- Name
- Serial number
- Status (active / maintenance / inactive)
- Purchase date
- Last service date
- Next service date (stored or derived)
- Service interval (days)
- Archive metadata
- Audit fields (createdBy / updatedBy)

---

### 🛠 Maintenance History

- Preventive and corrective maintenance records
- Subcollection-based data model
- Automatic updates to:
  - `lastServiceDate`
  - `nextServiceDate`
- Event logged to activity feed for every maintenance entry
- Admin-only write access
- Append-only historical records

---

### 📊 Operational Dashboard

A real-time operational overview focused on **actionability** rather than vanity metrics:

- Total assets
- Status distribution
- Overdue maintenance detection
- Maintenance due in 7 / 30 days
- Data quality indicators
- Assets requiring attention
- Recent activity feed

All KPIs are derived from live Firestore data.

---

### 📈 Analytics

Analytics are intentionally separated from the operational dashboard.

**Tabs:**

- Overview
- Maintenance
- Trends

**Capabilities:**

- Status distribution analysis
- Maintenance trends over time
- Asset creation and growth tracking
- Overdue vs upcoming service detection
- Time-range and status-based filters

---

### 📋 Enterprise-Grade Equipment Table

- Saved Views (persisted via localStorage):
  - Operational
  - Maintenance Focus
  - Archived
- Persistent filters:
  - Search
  - Status
  - Sort
  - Include archived
- Operationally meaningful sorting strategies
- Next Service column with urgency indicators
- Admin-only contextual actions

---

## 🗂️ Data Architecture

### Firestore Structure

```
equipments/
 ├─ {equipmentId}
 │   ├─ fields...
 │   ├─ maintenance/
 │   │   ├─ {maintenanceId}
 │   ├─ events/
 │   │   ├─ {eventId}
```

### Key Design Principles

- Archived items are filtered client-side for schema resilience
- `archivedAt == null` is never used in Firestore queries
- Operational dates stored as `yyyy-MM-dd` strings
- Derived values always have safe fallbacks
- Writes that affect multiple documents are atomic
- Audit trails are append-only and immutable

---

## 🧠 Architectural Decisions

- Clear separation between **operational dashboards** and **analytics**
- React Query as the single source of server-state truth
- No hidden business logic inside UI components
- Predictable query keys and invalidation strategy
- No destructive deletes for business-critical entities
- Enterprise-oriented consistency and audit rules

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
- Enterprise-grade architecture
- No known critical bugs

This project is considered **v1 complete**.

---

## 👨‍💻 Author

**Eduardo Visconti**  
Frontend Developer  
Focused on scalable React systems, UX-driven products, and real-world frontend architecture.
