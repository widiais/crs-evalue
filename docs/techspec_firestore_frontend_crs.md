# ⚙️ Tech Spec – CRS Web App (Frontend + Firestore)

## 🎯 Tujuan
Web App CRS (Competency Review System) dirancang untuk melakukan proses assessment terhadap karyawan berbasis template pertanyaan dan akses PIN. Project ini akan menggunakan **frontend murni (Next.js)** yang langsung terhubung ke **Firebase Firestore** tanpa backend server tambahan.

---

## 🧱 Arsitektur Aplikasi

### 🔹 Frontend
- **Framework**: Next.js (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Komponen UI**: shadcn/ui / Headless UI

### 🔹 Backend (tanpa server)
- **Firebase Authentication**: Google Sign-In
- **Firebase Firestore**: Realtime Database
- **Firebase Custom Claims**: Role-based access (`admin`, `user`)
- **Storage**: Firebase Storage (opsional)
- **Cloud Functions**: (opsional untuk log & notif)

---

## 🧩 Firestore Koleksi Utama

- `assessments/`
- `criteria_templates/`
- `employees/`
- `assessment_results/`
- `logs/`

---

## ✅ Validasi Evaluator

### Aturan:
- **Satu evaluator dapat menilai banyak karyawan dalam satu sesi assessment (PIN)**
- **Namun hanya boleh menilai satu karyawan tertentu satu kali saja per sesi**

### Logika Validasi (Client-side Firestore):
1. Saat evaluator memilih karyawan target → lakukan query:
```ts
const snapshot = await getDocs(query(
  collection(db, "assessment_results"),
  where("assessmentId", "==", currentAssessmentId),
  where("evaluatorId", "==", user.uid),
  where("targetId", "==", selectedEmployeeId)
));

if (!snapshot.empty) {
  throw new Error("Kamu sudah pernah menilai karyawan ini di sesi ini.");
}
```

---

## 📦 Dependencies Frontend

```bash
next
react
typescript
tailwindcss
firebase
react-firebase-hooks
react-hook-form
zod
zustand
dayjs
@react-pdf/renderer (optional)
```

---

## 📁 Struktur Folder

```
/src/
├── app/                    → Routing pages
├── components/             → UI components
├── features/               → Modules (assessment, reports)
├── constants/              → Enums, options tetap
├── services/               → Firebase wrapper (auth, db)
├── utils/                  → generatePIN(), validasi logika
```

---

## 🔐 Autentikasi & Role

- Google Sign-In via Firebase
- Setelah login pertama, user ditambahkan ke koleksi `users/`
- Admin bisa set role via Firebase Admin SDK

---

## 📝 Penutup

Aplikasi ini memaksimalkan arsitektur frontend + Firestore tanpa backend tambahan, dengan validasi langsung dari client-side query yang efisien. Sistem fleksibel, scalable, dan cocok untuk sistem penilaian internal perusahaan.