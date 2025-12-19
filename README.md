# Equipment Dashboard

A modern **Equipment Management Dashboard** built with **Next.js 14 (App Router)**, **TypeScript**, **Firebase**, **React Query**, and **shadcn/ui**.  
This project was designed as a professional, production‑style demo focusing on clean architecture, UX polish, and real backend integration.

---

## 🚀 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **TypeScript**
- **React Hook Form + Zod** (forms & validation)
- **TanStack React Query** (data fetching & cache)
- **shadcn/ui** (Radix UI + Tailwind CSS)
- **Lucide Icons**
- **Sonner** (toasts / notifications)

### Backend / Services

- **Firebase Authentication** (Email & Password)
- **Firestore (Cloud Firestore)** as database

---

## ✨ Features

- 🔐 **Authentication**
  - Email/password login (Firebase Auth)
  - Protected routes using `(auth)` and `(protected)` route groups
  - Logout functionality
- 📋 **Equipments CRUD**
  - Create, edit, delete equipments
  - Single reusable form for Add / Edit
  - Firestore persistence
- 📊 **Data Table**
  - Generic reusable table component
  - Filtering
  - Pagination (Next / Previous)
  - Actions menu (Edit / Delete)
- 🧠 **UX & Reliability**
  - Skeleton loaders (initial loading)
  - Empty state with CTA
  - Confirmation dialog for destructive actions
  - Disabled states to prevent double actions
  - Toast feedback for success and error
- 🔒 **Security**
  - Firestore Security Rules
  - Auth‑protected database access
  - Data shape validation at rule level

---

## 🗂️ Project Structure (Simplified)

```
app/
├─ (auth)/
│  └─ login/
│     ├─ page.tsx
│     └─ _components/
│        └─ forms/
│           └─ login-form.tsx
│
├─ (protected)/
│  ├─ dashboard/
│  │  └─ page.tsx
│  └─ equipments/
│     ├─ page.tsx
│     ├─ action/
│     │  └─ page.tsx
│     └─ _components/
│        ├─ form/
│        │  └─ equipment-form.tsx
│        └─ sections/
│           └─ table-section.tsx
│
components/
├─ core/
│  ├─ tables/
│  │  └─ data-table.tsx
│  └─ navigation/
│     └─ app-sidebar.tsx
│
context/
└─ auth-context.tsx
```

---

## 🔧 Environment Variables

Create a `.env.local` file at the root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🔥 Firestore Security Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /equipments/{equipmentId} {
      allow read, write: if request.auth != null
        && request.resource.data.keys().hasOnly([
          'name',
          'serialNumber',
          'status',
          'purchaseDate',
          'lastServiceDate'
        ])
        && request.resource.data.status in ['active', 'inactive', 'maintenance'];
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🧪 Running Locally

```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

## 🎯 Project Goals

This project intentionally focuses on:

- Clean and scalable architecture
- Real backend integration (no mock-only app)
- UX patterns used in production dashboards
- Clear separation of concerns
- Minimal but professional Auth implementation

---

## 👤 Author

Built by **Eduardo Visconti**  
Focused on frontend engineering, UX quality, and modern React ecosystems.

---

## 📜 License

This project is for demonstration and portfolio purposes.
