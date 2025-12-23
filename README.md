# Equipment Dashboard

A modern **Equipment Management Dashboard** built with **Next.js 14**, designed to demonstrate real-world frontend architecture, data handling, and UI/UX best practices.

This project focuses on **clarity, scalability, and professional-grade tooling**, avoiding unnecessary complexity while showcasing strong technical decisions.

---

## 🚀 Live Demo

- **Production URL:**  
  https://equipment-dashboard-three.vercel.app/

- **Repository:**  
  https://github.com/EduardoVisconti/equipment-dashboard

---

## 🧱 Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Recharts (via shadcn charts)

### State & Forms

- TanStack React Query
- React Hook Form
- Zod

### Backend / Services

- Firebase Firestore
- Firebase Authentication (Email / Password)

### Tooling

- Vercel (Deployment)
- ESLint
- Prettier
- Conventional Commits

---

## ✨ Features

### Authentication

- Email & password authentication with Firebase
- Protected routes using Next.js route groups
- Firestore write operations secured by authentication

### Equipment Management (CRUD)

- Equipment listing with pagination
- Create new equipment
- Edit existing equipment
- Delete with confirmation dialog
- Shared form for create/edit actions
- Schema validation with Zod
- Optimistic UI updates via React Query

### Data Table

- Reusable generic DataTable component
- Column filtering
- Pagination
- Loading and empty states
- Action menus (edit / delete)

### Analytics Dashboard

Built with shadcn/ui charts + Recharts, using real data:

- Pie Chart — Equipment distribution by status
- Bar Chart — Status comparison
- Area Chart — Equipment growth over time

### Command Palette (Cmd / Ctrl + K)

- Global command palette using shadcn Command
- Keyboard-first navigation
- Quick access to Dashboard, Equipments, Analytics and Add Equipment

### UX & UI Enhancements

- Skeleton loaders
- Toast notifications (Sonner)
- Confirmation dialogs
- Clean empty states
- Dark / Light mode support

---

## 🔐 Firebase Security Model

Firestore rules are intentionally structured to support Server Components:

allow read: if true;  
allow write: if request.auth != null;

### Why this approach?

- Server Components do not have access to Firebase Auth context
- Public reads allow SSR data fetching
- Write operations remain protected by authentication

---

## 🗂️ Project Structure (Simplified)

app/
(auth)/login  
(protected)/dashboard  
(protected)/equipments  
(protected)/analytics

components/core (headers, navigation, tables, overlays, toggles)  
components/ui (shadcn)  
data-access (Firestore logic)  
types

---

## 🧠 Key Design Decisions

- shadcn/ui for composability and flexibility
- React Query for predictable server-state management
- Single form for add/edit to reduce duplication
- Charts added only where they provide meaningful insight
- Minimal but scalable folder structure
- Focus on clarity over abstraction

---

## 🧪 Running Locally

git clone https://github.com/EduardoVisconti/equipment-dashboard  
cd equipment-dashboard  
npm install  
npm run dev

Create a .env.local file with your Firebase credentials.

---

## 🏁 Project Status

Feature complete  
Production-ready demo  
Clean architecture  
No known bugs

---

## 👨‍💻 Author

Eduardo Visconti  
Frontend Developer  
Focused on modern React, UX-driven design, and scalable frontend systems.
