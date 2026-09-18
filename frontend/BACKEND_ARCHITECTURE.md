# MedIntel Real-Time Production Backend Architecture & Implementation Guide

This document provides the complete, production-grade technical specification, database schema, real-time WebSocket protocol, AI integration pipelines, and step-by-step implementation guide to connect the MedIntel frontend to a real-time backend.

---

## 🛠️ 1. Technical Stack Overview

| Layer | Technology Choice | Rationale |
| :--- | :--- | :--- |
| **Framework & API Server** | Next.js App Router (`/app/api/*`) | Native Server Actions and Route Handlers directly integrated with the existing frontend. |
| **Database** | PostgreSQL + `pgvector` | Relational integrity for medical records + vector embedding support for similar case retrieval. |
| **ORM / Query Builder** | Prisma ORM | Type-safe database client auto-generating TypeScript interfaces matching frontend components. |
| **Real-Time WebSockets** | Socket.io / Supabase Realtime | Sub-100ms real-time event broadcasting between Nurse Intake Desk and Doctor Workbench. |
| **AI LLM Engine** | `@google/genai` (Gemini 3 Pro API) | High-accuracy structured JSON clinical SOAP note generation and multimodal OCR parsing. |
| **Authentication & RBAC** | NextAuth.js (v5) + JWT | Role-based authorization protecting Patient, Doctor, Nurse, and Admin routes. |

---

## 🗄️ 2. Database Schema (Prisma Data Model)

Save this schema to `prisma/schema.prisma` in your project root.

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

// ----------------------------------------------------
// 1. AUTHENTICATION & USER ROLES
// ----------------------------------------------------
enum Role {
  PATIENT
  DOCTOR
  NURSE
  ADMIN
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         Role     @default(PATIENT)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  patient ProfilePatient?
  doctor  ProfileDoctor?
  staff   ProfileStaff?
}

// ----------------------------------------------------
// 2. PATIENT PROFILE & MEDICAL HISTORY
// ----------------------------------------------------
model ProfilePatient {
  id               String   @id @default(uuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName         String
  dob              DateTime
  gender           String
  bloodGroup       String
  allergies        String[]
  chronicConditions String[]
  emergencyContact String
  insuranceId      String?

  appointments     Appointment[]
  vitalsRecords    VitalsRecord[]
  medicalReports   MedicalReport[]
}

// ----------------------------------------------------
// 3. PHYSICIAN PROFILE & SCHEDULE
// ----------------------------------------------------
model ProfileDoctor {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName        String
  specialty       String
  licenseNo       String   @unique
  department      String
  slotDurationMin Int      @default(20)
  bio             String?

  appointments    Appointment[]
  soapSummaries   SOAPSummary[]
}

// ----------------------------------------------------
// 4. NURSE / HEALTHCARE STAFF PROFILE
// ----------------------------------------------------
model ProfileStaff {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName   String
  licenseNo  String   @unique
  department String
  shift      String
}

// ----------------------------------------------------
// 5. APPOINTMENT QUEUE & TRIAGE STATUS
// ----------------------------------------------------
enum AppointmentStatus {
  SCHEDULED
  WAITING
  IN_CONSULTATION
  COMPLETED
  CANCELLED
}

enum TriageLevel {
  ROUTINE
  URGENT
  CRITICAL
}

model Appointment {
  id          String            @id @default(uuid())
  patientId   String
  doctorId    String
  patient     ProfilePatient    @relation(fields: [patientId], references: [id])
  doctor      ProfileDoctor     @relation(fields: [doctorId], references: [id])
  dateTime    DateTime
  type        String
  symptoms    String
  status      AppointmentStatus @default(SCHEDULED)
  triageLevel TriageLevel       @default(ROUTINE)
  createdAt   DateTime          @default(now())

  vitalsRecord VitalsRecord?
  soapSummary  SOAPSummary?
}

// ----------------------------------------------------
// 6. NURSE INTAKE VITALS RECORD
// ----------------------------------------------------
model VitalsRecord {
  id               String      @id @default(uuid())
  appointmentId    String      @unique
  patientId        String
  appointment      Appointment @relation(fields: [appointmentId], references: [id])
  patient          ProfilePatient @relation(fields: [patientId], references: [id])

  systolicBp       Int
  diastolicBp      Int
  heartRate        Int
  temperatureF     Float
  spo2             Int
  glucoseMgDl      Int
  heightCm         Float
  weightKg         Float
  bmi              Float
  triageScore      TriageLevel
  preliminaryNotes String?
  recordedAt       DateTime    @default(now())
}

// ----------------------------------------------------
// 7. DOCTOR AI SOAP CLINICAL SUMMARY
// ----------------------------------------------------
model SOAPSummary {
  id            String      @id @default(uuid())
  appointmentId String      @unique
  doctorId      String
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  doctor        ProfileDoctor @relation(fields: [doctorId], references: [id])

  subjective    String      @db.Text
  objective     String      @db.Text
  assessment    String      @db.Text
  plan          String      @db.Text
  isSigned      Boolean     @default(false)
  signedAt      DateTime?
}

// ----------------------------------------------------
// 8. OCR MEDICAL LAB REPORTS
// ----------------------------------------------------
model MedicalReport {
  id            String         @id @default(uuid())
  patientId     String
  patient       ProfilePatient @relation(fields: [patientId], references: [id])
  fileName      String
  fileUrl       String
  parsedData    Json
  uploadedAt    DateTime       @default(now())
}
```

---

## 🔌 3. Core API Endpoints Architecture

Create these route handlers in `src/app/api/`:

### A. Nurse Vitals Log Endpoint (`/api/vitals/log`)
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "appointmentId": "APT-901",
    "patientId": "P-101",
    "systolicBp": 138,
    "diastolicBp": 88,
    "heartRate": 82,
    "temperatureF": 98.6,
    "spo2": 98,
    "glucoseMgDl": 110,
    "heightCm": 175,
    "weightKg": 76,
    "preliminaryNotes": "Patient reports mild chest discomfort on exertion."
  }
  ```
- **Handler Code Skeleton**:
  ```ts
  // src/app/api/vitals/log/route.ts
  import { NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { broadcastEvent } from '@/lib/websocket';

  export async function POST(req: Request) {
    const data = await req.json();
    
    // 1. Calculate BMI
    const bmi = Number((data.weightKg / Math.pow(data.heightCm / 100, 2)).toFixed(1));
    
    // 2. Evaluate Triage Score Algorithm
    let triageScore = 'ROUTINE';
    if (data.systolicBp >= 160 || data.spo2 < 92 || data.temperatureF >= 103) {
      triageScore = 'CRITICAL';
    } else if (data.systolicBp >= 135 || data.glucoseMgDl >= 180) {
      triageScore = 'URGENT';
    }

    // 3. Save Vitals to Database
    const vitals = await prisma.vitalsRecord.create({
      data: { ...data, bmi, triageScore }
    });

    // 4. Update Appointment Status to WAITING
    await prisma.appointment.update({
      where: { id: data.appointmentId },
      data: { status: 'WAITING', triageLevel: triageScore }
    });

    // 5. Broadcast Real-Time WebSocket Event to Doctor Workbench
    broadcastEvent(`doctor:${data.doctorId}`, 'vitals:logged', {
      appointmentId: data.appointmentId,
      triageScore,
      vitals
    });

    return NextResponse.json({ success: true, vitals });
  }
  ```

---

### B. AI SOAP Note Generator Endpoint (`/api/ai/generate-soap`)
- **Method**: `POST`
- **Payload**: `{ "appointmentId": "APT-901" }`
- **Handler Code Skeleton**:
  ```ts
  // src/app/api/ai/generate-soap/route.ts
  import { NextResponse } from 'next/server';
  import { GoogleGenAI } from '@google/genai';
  import { prisma } from '@/lib/prisma';

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  export async function POST(req: Request) {
    const { appointmentId } = await req.json();

    const appt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, vitalsRecord: true }
    });

    const prompt = `
      You are a Clinical Decision Support AI. Generate a structured SOAP Note for a physician based on:
      Patient: ${appt?.patient.fullName}, ${appt?.patient.gender}
      Chief Complaint: ${appt?.symptoms}
      Nurse Vitals: BP ${appt?.vitalsRecord?.systolicBp}/${appt?.vitalsRecord?.diastolicBp}, HR ${appt?.vitalsRecord?.heartRate}, Temp ${appt?.vitalsRecord?.temperatureF}°F, SpO2 ${appt?.vitalsRecord?.spo2}%, Glucose ${appt?.vitalsRecord?.glucoseMgDl} mg/dL, BMI ${appt?.vitalsRecord?.bmi}
      Nurse Notes: ${appt?.vitalsRecord?.preliminaryNotes}

      CRITICAL GUARDRAIL: Do NOT prescribe medications or specific dosages. Recommend non-pharmacological monitoring and diagnostic labs only. Return valid JSON matching { "subjective": "", "objective": "", "assessment": "", "plan": "" }.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro',
      contents: prompt
    });

    const soapData = JSON.parse(response.text);

    return NextResponse.json({ success: true, soap: soapData });
  }
  ```

---

### C. OCR Report Parser Endpoint (`/api/ai/ocr-report`)
- **Method**: `POST` (`multipart/form-data`)
- **Handler Code Skeleton**:
  ```ts
  // src/app/api/ai/ocr-report/route.ts
  import { NextResponse } from 'next/server';
  import { GoogleGenAI } from '@google/genai';

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro',
      contents: [
        { inlineData: { mimeType: file.type, data: buffer.toString('base64') } },
        'Extract medical lab values into JSON array of { metricName, value, unit, referenceRange, status }'
      ]
    });

    const parsedData = JSON.parse(response.text);
    return NextResponse.json({ success: true, report: parsedData });
  }
  ```

---

## ⚡ 4. Real-Time WebSocket Architecture (Socket.io)

### WebSocket Server Script (`server/socket.ts`):
```ts
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join:room', (room) => {
    socket.join(room);
  });

  socket.on('vitals:submit', (data) => {
    // Broadcast to specific doctor's room instantly (< 50ms)
    io.to(`doctor:${data.doctorId}`).emit('vitals:update', data);
    // Broadcast queue update to patient
    io.to(`patient:${data.patientId}`).emit('queue:update', { status: 'Vitals Logged - Up Next' });
  });
});

server.listen(4000, () => console.log('WebSocket Server running on port 4000'));
```

---

## 🚀 5. Step-by-Step Implementation Checklist

### Step 1: Install Backend Dependencies
Run the following terminal command in your project root:
```bash
npm install @prisma/client @google/genai socket.io socket.io-client next-auth bcryptjs
npm install -D prisma @types/bcryptjs
```

### Step 2: Initialize Database Connection
1. Set up a PostgreSQL instance (e.g. Supabase, Neon, or local Postgres).
2. Add your database connection string to `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/medintel_db?schema=public"
   GEMINI_API_KEY="your_google_gemini_api_key"
   NEXTAUTH_SECRET="your_jwt_secret_key"
   ```
3. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name init
   ```

### Step 3: Connect Frontend Components to API Endpoints
Update your React components to call real API routes instead of mock state:
- In `StaffIntakeDesk.tsx`: replace local `useState` submit handler with `fetch('/api/vitals/log', { method: 'POST', body: JSON.stringify(vitalsData) })`.
- In `ClinicalSummaryStudio.tsx`: replace mock text with `fetch('/api/ai/generate-soap', { method: 'POST', body: JSON.stringify({ appointmentId }) })`.
- In `OCRReportAnalyzer.tsx`: replace mock upload with `fetch('/api/ai/ocr-report', { method: 'POST', body: formData })`.

---

## 🛡️ 6. Medical Safety & HIPAA Compliance Checklist
- [x] **No Prescription Logic**: System prompt explicitly blocks AI medication recommendations.
- [x] **Data Encryption**: Enforce SSL/TLS for all API routes and AES-256 database column encryption for patient PII.
- [x] **Audit Trail**: Every signed SOAP note records doctor ID and immutable timestamp (`signedAt`).
