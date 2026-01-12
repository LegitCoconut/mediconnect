# MediConnect - Healthcare Ecosystem

MediConnect is a comprehensive healthcare platform designed to bridge the gap between hospitals, doctors, and patients. It consists of a robust web portal for administrative and medical staff, and a mobile application for patients to seamlessly manage their healthcare journey.

## 🎯 Project Overview

The ecosystem is divided into two primary applications:
1.  **Web Portal (`mediconnect`)**: A Next.js-based application serving Hospitals, Doctors, and Platform Administrators.
2.  **Mobile App (`mediconnect_app`)**: A Flutter-based mobile application for Patients to discover hospitals, book appointments, and manage prescriptions.

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
-   **Appointment Booking**: Seamlessly book appointments with doctors.
-   **Prescription Access**: View digital prescriptions issued by doctors.
-   **Medicine Reminders**: Set reminders for medication schedules (Local Notifications).
-   **Profile Management**: Manage personal health details and history.

---

## 🛠️ Technology Stack

### **Web Application**
-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Authentication**: NextAuth.js
-   **Database**: MongoDB (Mongoose)
-   **State Management**: React Hooks / Contex
-   **AI Integration**: Genkit (Google AI)

### **Mobile Application**
-   **Framework**: Flutter
-   **Language**: Dart
-   **Networking**: HTTP, Provider
-   **Local Storage**: Shared Preferences
-   **Notifications**: Flutter Local Notifications

### **Backend API**
-   **Routes**: Next.js API Routes (`/api/mobile/...`, `/api/auth/...`)
-   **Services**: Authentication, Hospital/Doctor Data, Appointment Scheduling.

---

## 📸 Screenshots

*Screenshots of the application features will be added here in the future to showcase the UI/UX.*

<!-- 
Add screenshots using the following format:
![Feature Name](/path/to/image.png)
-->

---

## 📂 Project Structure

```bash
hack/
├── mediconnect/           # Web Application (Next.js)
│   ├── src/app/          # App Router (Pages & API)
│   ├── src/components/   # Reusable UI Components
│   └── ...
├── mediconnect_app/       # Mobile Application (Flutter)
│   ├── lib/screens/      # UI Screens
│   ├── lib/services/     # API Integration Services
│   └── ...
└── README.md              # Project Documentation
```
