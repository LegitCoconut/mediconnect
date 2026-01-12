# MediConnect - Healthcare Ecosystem

MediConnect is a comprehensive healthcare platform designed to bridge the gap between hospitals, doctors, and patients. It consists of a robust web portal for administrative and medical staff, and a mobile application for patients to seamlessly manage their healthcare journey.

## 🎯 Project Overview

The ecosystem is divided into two primary applications:
1.  **Web Portal (`mediconnect`)**: A Next.js-based application serving Hospitals, Doctors, and Platform Administrators.
2.  **Mobile App (`mediconnect_app`)**: A Flutter-based mobile application for Patients to discover hospitals, book appointments, and manage prescriptions.

---

## 📸 App Screenshots

<table>
  <tr>
    <td align="center"><img src="/home.png" width="200"/><br/><b>Home Screen</b></td>
    <td align="center"><img src="/search.png" width="200"/><br/><b>Doctor Search</b></td>
    <td align="center"><img src="/search_hospita.png" width="200"/><br/><b>Hospital Search</b></td>
    <td align="center"><img src="/doctor_profile.png" width="200"/><br/><b>Doctor Profile</b></td>
  </tr>
  <tr>
    <td align="center"><img src="/upcoming_appoint.png" width="200"/><br/><b>Upcoming Appointments</b></td>
    <td align="center"><img src="/past_appoint.png" width="200"/><br/><b>Past Appointments</b></td>
    <td align="center"><img src="/appoint_details.png" width="200"/><br/><b>Appointment Details</b></td>
    <td align="center"><img src="/tdy_medicine.png" width="200"/><br/><b>Today's Medicines</b></td>
  </tr>
</table>

---

## ✨ Key Features

### 🏥 Hospital & Admin Web Portal
High-performance web dashboard built with **Next.js 14**, **Tailwind CSS**, and **Shadcn UI**.

#### **Super Admin Console** (`/admin`)
-   **Dashboard Overview**: Real-time statistics on total hospitals, patients, doctors, and appointments.
-   **Hospital Management**: View, verify, and manage hospital registrations.
-   **Patient Management**: Oversee patient accounts and platform usage.
-   **Approval Workflow**: Review and approve pending hospital verification requests.

#### **Hospital Dashboard** (`/hospital`)
-   **Doctor Management**: Add and manage doctor profiles, specializations, and schedules.
-   **Department Management**: Organize services by departments.
-   **Analytics**: View hospital performance and appointment stats.
-   **Profile Settings**: Manage hospital details, operating hours, and location.

#### **Doctor Portal** (`/doctor`)
-   **Appointment Management**: View upcoming appointments and patient details.
-   **Digital Prescriptions**: Create and manage patient prescriptions directly from the dashboard.
-   **Schedule Management**: Set availability and consultation hours.

### 📱 Patient Mobile App
Cross-platform mobile experience built with **Flutter**.

-   **Hospital Discovery**: Browse and search for nearby hospitals and clinics.
-   **Doctor Search**: Find doctors by name, specialty, department, or hospital.
-   **Appointment Booking**: Select date and available time slots to book appointments.
-   **Prescription Access**: View digital prescriptions with detailed medicine information.
-   **Today's Medicines**: View medicines to take for the day with dosage and instructions.
-   **Medicine Reminders**: Automatic local notifications for medication schedules.
-   **Profile Management**: Manage personal health details and history.

---

## 🔄 Appointment & Prescription Flow

### Patient Flow (Mobile App)
1. **Browse Hospitals** → View hospitals with departments and doctors
2. **Select a Doctor** → View profile, qualifications, fees, and schedule
3. **Book Appointment** → Pick a date and available time slot
4. **Confirmation** → Appointment created with "pending" status
5. **View Appointments** → See upcoming and past appointments
6. **View Prescriptions** → After consultation, see prescribed medicines
7. **Today's Medicines** → Daily medicine tracker with reminders

### Doctor Flow (Web Portal)
1. **View Appointments** → See all patient appointments
2. **Confirm/Cancel** → Approve or reject pending appointments
3. **Write Prescription** → Add diagnosis, medicines with dosage, frequency, duration
4. **Complete Appointment** → Prescription auto-marks appointment as completed

---

## 🧪 Test Credentials

### Hospital Login (`/hospital/login`)
| Hospital | Email | Password |
|----------|-------|----------|
| City General Hospital | `cityhospital@demo.com` | `hospital123` |

### Doctor Login (`/doctor/login`)
| Doctor | Email | Password | Specialty |
|--------|-------|----------|-----------|
| Dr. Rajesh Kumar | `rajesh.kumar@cityhospital.com` | `doctor123` | Cardiologist |
| Dr. Priya Sharma | `priya.sharma@cityhospital.com` | `doctor123` | Orthopedic |
| Dr. Amit Patel | `amit.patel@cityhospital.com` | `doctor123` | Neurologist |
| Dr. Sneha Gupta | `sneha.gupta@cityhospital.com` | `doctor123` | Pediatrician |
| Dr. Vikram Singh | `vikram.singh@cityhospital.com` | `doctor123` | General |

---

## 🛠️ Technology Stack

### **Web Application**
-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Authentication**: NextAuth.js
-   **Database**: MongoDB (Mongoose)
-   **State Management**: React Hooks / Context

### **Mobile Application**
-   **Framework**: Flutter
-   **Language**: Dart
-   **Networking**: HTTP, Provider
-   **Local Storage**: Shared Preferences
-   **Notifications**: Flutter Local Notifications

### **Backend API**
-   **Routes**: Next.js API Routes (`/api/mobile/...`, `/api/auth/...`)
-   **Services**: Authentication, Hospital/Doctor Data, Appointment Scheduling, Prescriptions.

---

## 🚀 Getting Started

### Web Portal
```bash
cd mediconnect
npm install
npm run dev
```

### Mobile App
```bash
cd mediconnect_app
flutter pub get
flutter run
```

### Seed Test Data
```bash
cd mediconnect
npx ts-node src/scripts/seed-hospital.ts
```

---

## 📂 Project Structure

```bash
hack/
├── mediconnect/           # Web Application (Next.js)
│   ├── src/app/          # App Router (Pages & API)
│   ├── src/components/   # Reusable UI Components
│   ├── src/lib/actions/  # Server Actions
│   ├── src/models/       # Mongoose Models
│   └── ...
├── mediconnect_app/       # Mobile Application (Flutter)
│   ├── lib/screens/      # UI Screens
│   ├── lib/services/     # API Integration Services
│   └── ...
└── README.md              # Project Documentation
```

---

## 📜 License

This project is developed for educational and demonstration purposes.
