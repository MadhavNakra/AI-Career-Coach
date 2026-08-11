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
