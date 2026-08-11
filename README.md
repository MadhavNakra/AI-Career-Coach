# 🚀 Careerly — AI-Powered Career Companion

<p align="center">
  <img src="./public/logo.png" alt="Careerly Logo" width="400"/>
</p>

<p align="center">
  <b>Your AI-powered companion for career growth, preparation, and success.</b>
</p>

<p align="center">
  <a href="https://career-coach-kappa-vert.vercel.app/">🌐 Live Demo</a>
</p>

---

## 📌 About Careerly

**Careerly** is an AI-powered career development platform designed to help users understand their career opportunities, improve their professional profile, prepare for interviews, and track their progress — all from a single platform.

Careerly combines **Generative AI, personalized career insights, assessments, resume building, cover letter generation, and interview preparation** to create a personalized career experience.

🎯 **Goal:** Make career preparation smarter, more personalized, and accessible.

---

## ✨ Features

### 🧠 AI Career & Industry Insights

Get personalized insights about your selected industry, including:

- 📈 Market outlook
- 📊 Industry demand
- 💰 Salary trends
- 🔥 In-demand skills
- 🚀 Career opportunities
- 📚 Recommended skills to develop

---

### 📄 AI Resume Builder

Create and manage a professional resume with an AI-assisted workflow.

- Build a structured resume
- Generate and improve professional content
- Highlight relevant skills and experience
- Preview your resume
- Export your resume as a PDF

---

### ✉️ AI Cover Letter Generator

Generate personalized cover letters using Generative AI.

Careerly uses your profile and job information to create a tailored cover letter instead of relying on generic templates.

---

### 🎯 AI Interview Preparation

Prepare for interviews through AI-powered assessments.

- Generate interview questions
- Practice technical and career-related questions
- Evaluate your performance
- Identify areas for improvement
- Track your assessment history

---

### 📊 Performance Tracking

Visualize your assessment performance over time.

Careerly provides:

- Quiz scores
- Performance trends
- Assessment history
- Progress visualization

---

### 🔐 Authentication

Secure user authentication and account management powered by **Clerk**.

---

## 🛠️ Tech Stack

### Frontend

- **Next.js**
- **React**
- **JavaScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide React**
- **Recharts**

### Backend

- **Next.js Server Actions**
- **Prisma ORM**
- **PostgreSQL**

### AI

- **Google Gemini API**

### Authentication

- **Clerk**

### Deployment

- **Vercel**

---

## 🏗️ Architecture

Careerly follows a modern full-stack Next.js architecture.

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Next.js App    │
                    │  React + UI      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │   Clerk    │ │  Gemini AI │ │  Server    │
       │    Auth    │ │    API     │ │  Actions   │
       └────────────┘ └────────────┘ └─────┬──────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │    Prisma    │
                                    │     ORM      │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  PostgreSQL  │
                                    └──────────────┘

```
<img width="1855" height="900" alt="2" src="https://github.com/user-attachments/assets/01cbfd35-b758-46d8-9d2e-021f778f1f55" />

<img width="1895" height="910" alt="1" src="https://github.com/user-attachments/assets/b169357f-d0e3-4a42-bc94-1bcf004f13e9" />

<img width="1755" height="908" alt="3" src="https://github.com/user-attachments/assets/d969ce6f-574a-4d7c-9714-af350d67330d" />

<img width="1862" height="912" alt="4" src="https://github.com/user-attachments/assets/70c927fc-e77b-4c47-ba3f-6a246b67c5fe" />

<img width="1761" height="914" alt="5" src="https://github.com/user-attachments/assets/2277a402-bb7c-4c88-9cc1-ff5395d905e4" />

<img width="1800" height="916" alt="6" src="https://github.com/user-attachments/assets/9cf29454-3538-485a-9e9e-dfe6a7732b08" />

<img width="1745" height="919" alt="7" src="https://github.com/user-attachments/assets/5e72c6bf-98fc-48aa-a9b2-bfa6e6e9f55b" />

<img width="1735" height="911" alt="8" src="https://github.com/user-attachments/assets/13bc85b2-afa8-40f1-a52b-9bef7f476904" />

<img width="1756" height="908" alt="9" src="https://github.com/user-attachments/assets/bc4f0336-0fa9-4777-b4b3-067dc3642693" />

<img width="1788" height="911" alt="10" src="https://github.com/user-attachments/assets/a7cde53d-dce7-4a3e-920b-2cb9c3e0f18f" />


