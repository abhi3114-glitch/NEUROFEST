# NeuroNest — Learn. Connect. Thrive.

An inclusive, AI-powered care platform engineered to support individuals with neurodivergent conditions such as Autism Spectrum Disorder (ASD), Dyslexia, and ADHD. NeuroNest delivers a unified ecosystem of tools spanning daily routine management, emotional tracking, real-time computer vision monitoring, therapeutic games, and clinical-grade dashboards for caregivers and medical professionals.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Key Features](#key-features)
4. [System Architecture](#system-architecture)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Installation and Setup](#installation-and-setup)
8. [Environment Variables](#environment-variables)
9. [Running the Application](#running-the-application)
10. [Build and Deployment](#build-and-deployment)
11. [Design Principles](#design-principles)
12. [Accessibility Standards](#accessibility-standards)
13. [Module Documentation](#module-documentation)
14. [Browser and Device Support](#browser-and-device-support)
15. [Future Roadmap](#future-roadmap)
16. [Contributing](#contributing)
17. [License](#license)
18. [Author](#author)

---

## Problem Statement

Neurodivergent individuals — including those with Autism, Dyslexia, and ADHD — face persistent challenges in daily life management, communication, emotional regulation, and safe independent living. Existing healthcare and educational tools are often fragmented, inaccessible, or not designed with neurodivergent sensory profiles in mind.

Caregivers and medical professionals lack a unified, real-time platform to monitor patient well-being, track behavioral patterns, manage medications, and intervene proactively during moments of crisis.

NeuroNest addresses these challenges by providing:
- A single, cohesive platform serving three distinct user roles (User, Caregiver, Doctor)
- AI-powered assistance tailored to neurodivergent communication styles
- Real-time computer vision for safety monitoring
- Clinically useful dashboards for medical professionals
- Sensory-friendly design that minimizes overstimulation

---

## Solution Overview

NeuroNest is a multi-role web application with three dedicated portals:

### User Portal
Designed for neurodivergent individuals. Provides tools for emotional tracking, daily routine management, communication support, learning activities, and an AI companion that adapts to the user's emotional state.

### Caregiver Dashboard
Designed for parents, guardians, and support workers. Provides real-time monitoring of patient progress, mood history visualization, computer vision safety monitoring, diet tracking, social story creation, behavioral alerts, and clinical notes review.

### Doctor Portal
Designed for medical professionals. Provides electronic medical records (EMR), prescription management with add/revoke capabilities, patient roster management, and a mock telehealth interface for remote consultations.

---

## Key Features

### 1. Mood Tracker (User Portal)
- Six-emotion selection interface with large, accessible emoji buttons
- Optional free-text notes with voice input via the Web Speech API
- All mood entries persist to localStorage and are accessible from the Caregiver Dashboard's Mood Logs tab
- Dark-mode glassmorphic design with translucent color-coded emotion cards

### 2. Daily Routine Checklist (User Portal)
- Pre-loaded and custom task management with add/delete functionality
- Visual progress bar showing percentage completion
- Gamified star reward system (correctly pluralized: "1 Star" vs "3 Stars")
- AI-powered task breakdown — the "Break Down Task" button uses Groq's LLM to decompose complex tasks into simple, motivating micro-steps
- Full localStorage persistence across browser sessions

### 3. AI Voice Assistant (User Portal)
- Powered by Groq's llama-3.1-8b-instant large language model
- Specialized system prompt engineered for neurodivergent communication: clear language, no metaphors, positive reinforcement, actionable steps
- Intelligent demo mode with 12+ contextual mock responses (emotions, tasks, sleep, games, help) for presentations without an API key
- Glassmorphic chat bubble interface with user messages in blue and assistant messages in dark zinc

### 4. Interactive Calm Room (User Portal)
- Guided breathing exercise with an animated expanding/contracting circle (4-second inhale, 4-second exhale cycle)
- Sensory Break Timer — a Pomodoro-style 5-minute countdown for scheduled decompression breaks
- Audio toggle for ambient sound integration
- Speech synthesis announcement when the break timer completes

### 5. AAC Communication Board (User Portal)
- Eight pre-configured communication tiles: "I'm hungry", "I'm thirsty", "I need help", "I'm tired", "I feel sick", "Yes", "No", "I need a break"
- Each tile triggers browser-native speech synthesis (Web Speech API) to vocalize the selected phrase
- Color-coded with translucent dark-mode backgrounds for quick visual identification
- Minimum 44px touch targets for motor accessibility

### 6. Learning Games (User Portal)
Three interactive educational games accessible from the "Play Games" button:

**Emotion Detective**: Presents a random emoji with a description. The user identifies the correct emotion from six multiple-choice options. Five rounds per session with color-coded correct/incorrect feedback and score tracking.

**Word Builder**: Displays a word in large, colorful individual letters. The user can hear the word spoken aloud via text-to-speech, then practice writing it. Includes a self-report "I Practiced!" button for positive reinforcement.

**Number Ninja**: Generates random single-digit addition problems with three multiple-choice answers. Five rounds per session with animated feedback and cumulative scoring.

### 7. Community Hub (User Portal)
- Functional post creation with Enter-key submission
- Like interaction system with real-time counter updates
- Comment count display
- All posts persist to localStorage
- Glassmorphic card layout with avatar initials, role badges, and timestamps

### 8. Emergency SOS Mode (User Portal)
- One-tap red "SOS Help" button in the User Dashboard header
- Stores a critical alert with timestamp to localStorage
- Displays a persistent toast notification confirming the alert was sent to the caregiver

### 9. Vision Monitor — YOLO-Style Computer Vision (Caregiver Dashboard)
The Vision Monitor integrates TensorFlow.js and the COCO-SSD (Common Objects in Context — Single Shot MultiBox Detector) pre-trained model for real-time object detection via the device camera.

**Four operating modes:**

- **Safe Zone Detection**: Tracks whether a person is detected within the camera frame. If the person leaves the frame for more than 30 consecutive frames, the status changes to "Wandering Detected!" with a red alert indicator.

- **Hazard Detection**: Identifies potentially dangerous objects (scissors, knife, cup, bottle, fork, spoon, book, cell phone) and draws red bounding boxes with "HAZARD" labels. Non-hazardous persons are tracked with neutral gray bounding boxes.

- **Behavior Monitoring**: Analyzes the detected person's position relative to the frame center as a proxy for movement/pacing. Elevated activity triggers a yellow "Elevated Pacing/Activity!" alert.

- **Emotion Tracking**: Cycles through heuristic emotion labels ("Calm", "Focused", "Stressed") overlaid on the detected person with purple bounding boxes.

**Technical implementation:**
- TensorFlow.js and COCO-SSD are loaded via dynamic `import()` to prevent build-time failures
- Graceful error handling: if the model fails to load, an orange error banner is displayed but the camera can still be activated
- Status indicator uses a three-state system: Stopped (gray), Monitoring (green pulse), Alert (red pulse)
- Canvas overlay renders detection bounding boxes and labels in real-time at the video's native frame rate using `requestAnimationFrame`

### 10. Diet and Sensory Food Tracker (Caregiver Dashboard)
- Meal logging with food name and sensory reaction fields (texture, smell, taste aversion notes)
- Timestamped entries displayed in reverse chronological order
- localStorage persistence for cross-session continuity
- Dark-mode styled with glassmorphic input fields and scrollable log area

### 11. Social Story Builder (Caregiver Dashboard)
- Step-by-step visual narrative editor for preparing users for new/stressful situations
- Each step has an editable emoji icon and text description
- Add/remove steps dynamically with drag-style visual flow (arrow connectors between steps)
- Save functionality with localStorage persistence
- Pre-loaded with a sample "Doctor Visit" story template

### 12. Patient Overview (Caregiver Dashboard)
- Three-patient roster with selectable profiles (Alex Johnson, Emma Davis, Michael Chen)
- Color-coded status badges: Stable (green), Needs Attention (yellow), Critical (red)
- Quick statistics grid: Tasks Completed, Mood Entries (dynamically pulled from localStorage), AI Interactions
- Mock wearable integration section displaying Heart Rate (84 bpm with red glow animation) and Stress Level indicators

### 13. Alerts and Notes (Caregiver Dashboard)
- **Alerts Tab**: Displays behavioral alerts with color-coded severity (yellow for routine incomplete, blue for learning progress)
- **Notes Tab**: Clinical session notes with dated entries, therapist attribution, and detailed observations

### 14. Electronic Medical Record Viewer (Doctor Portal)
- Patient roster with three profiles displaying condition, status, and last visit date
- Editable clinical notes text area with placeholder guidance
- Status badges using translucent dark-mode color coding

### 15. Prescription Management (Doctor Portal)
- Active prescription list displaying medication name and dosage
- **Revoke button**: Removes a prescription with toast confirmation
- **Add New Prescription**: Opens an inline form with medication name and dosage inputs, confirm/cancel actions
- Empty state display when all prescriptions have been revoked

### 16. Telehealth Connect (Doctor Portal)
- Mock WebRTC-style video consultation interface
- "Start Consultation" button triggers a 4.5-second simulated connection sequence with toast status updates
- Displays a professional consultation readiness state with camera and microphone permission indicators

---

## System Architecture

```
+------------------------------------------------------------------+
|                         Client Browser                           |
+------------------------------------------------------------------+
|  React 19 + TypeScript + Vite                                    |
|  +------------------------------------------------------------+  |
|  |  React Router v6 (Client-Side Routing)                      |  |
|  |  /                    -> Index.tsx (Landing Page)            |  |
|  |  /user-dashboard      -> UserDashboard.tsx                  |  |
|  |  /caregiver-dashboard -> CaregiverDashboard.tsx             |  |
|  |  /doctor-dashboard    -> DoctorDashboard.tsx                |  |
|  |  /learning-games      -> LearningGames.tsx                  |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------+  +------------------+  +----------------+  |
|  | UI Components    |  | Feature Modules  |  | AI/ML Layer    |  |
|  | (shadcn/ui +     |  | MoodTracker      |  | Groq LLM API  |  |
|  |  Radix UI +      |  | CalmRoom         |  | TensorFlow.js  |  |
|  |  Tailwind CSS)   |  | AACBoard         |  | COCO-SSD Model |  |
|  |                  |  | VisionMonitor    |  | Web Speech API |  |
|  |                  |  | DietTracker      |  |                |  |
|  |                  |  | SocialStory      |  |                |  |
|  |                  |  | CommunitySupport |  |                |  |
|  +------------------+  +------------------+  +----------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | Data Persistence Layer: Browser localStorage               |  |
|  | Keys: moodHistory, dailyTasks, communityPosts,             |  |
|  |       socialStories, dietLogs, criticalAlert               |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
         |                                    |
         v                                    v
+------------------+               +--------------------+
| Groq Cloud API   |               | Device Camera API  |
| (llama-3.1-8b)   |               | (getUserMedia)     |
+------------------+               +--------------------+
```

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI component library with hooks-based state management |
| TypeScript | 5.5.3 | Type-safe JavaScript superset |
| Vite | 5.4.x | Lightning-fast build tool with Hot Module Replacement |

### UI and Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 3.4.x | Utility-first CSS framework |
| shadcn/ui | Latest | Pre-built accessible component library |
| Radix UI | Various | Headless accessible UI primitives |
| Lucide React | 0.462.0 | Icon library with 1000+ SVG icons |
| Framer Motion | 11.0.0 | Animation library for micro-interactions |

### AI and Machine Learning
| Technology | Version | Purpose |
|------------|---------|---------|
| Groq API | Cloud | LLM inference (llama-3.1-8b-instant model) |
| TensorFlow.js | 4.22.0 | Browser-based ML inference runtime |
| COCO-SSD | 2.2.3 | Pre-trained object detection model (80 classes) |
| Web Speech API | Native | Speech synthesis and voice recognition |

### State and Data
| Technology | Version | Purpose |
|------------|---------|---------|
| React Router DOM | 6.26.2 | Client-side routing with nested routes |
| Zustand | 4.5.0 | Lightweight state management (available) |
| localStorage | Native | Client-side data persistence |
| Sonner | 1.5.0 | Toast notification system |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.9.0 | Code linting and quality enforcement |
| PostCSS | 8.4.47 | CSS processing pipeline |
| Autoprefixer | 10.4.20 | Automatic vendor prefix insertion |

---

## Project Structure

```
NeuroNest/
|
|-- public/                          Static assets served at root
|
|-- src/
|   |-- components/
|   |   |-- ui/                      shadcn/ui component library (30+ components)
|   |   |   |-- button.tsx           Button with variant system
|   |   |   |-- card.tsx             Card, CardHeader, CardContent, CardTitle
|   |   |   |-- input.tsx            Styled input with dark-mode support
|   |   |   |-- tabs.tsx             Tab navigation system
|   |   |   |-- scroll-area.tsx      Custom scrollbar container
|   |   |   |-- progress.tsx         Animated progress bar
|   |   |   |-- badge.tsx            Status badges with color variants
|   |   |   |-- alert.tsx            Alert components for notifications
|   |   |   +-- (20+ additional UI primitives)
|   |   |
|   |   |-- AACBoard.tsx             Augmentative communication board (8 tiles)
|   |   |-- CalmRoom.tsx             Breathing exercise + sensory break timer
|   |   |-- CommunitySupport.tsx     Community post feed with likes
|   |   |-- DietTracker.tsx          Meal and sensory reaction logger
|   |   |-- MoodTracker.tsx          Emoji mood selection with voice input
|   |   |-- SocialStoryBuilder.tsx   Visual narrative step editor
|   |   +-- VisionMonitor.tsx        TensorFlow.js COCO-SSD object detection
|   |
|   |-- pages/
|   |   |-- Index.tsx                Landing page with role selection cards
|   |   |-- UserDashboard.tsx        User portal (7 tabs, AI assistant, SOS)
|   |   |-- CaregiverDashboard.tsx   Caregiver portal (8 tabs, vision monitor)
|   |   |-- DoctorDashboard.tsx      Doctor portal (EMR, Rx, telehealth)
|   |   |-- LearningGames.tsx        3 educational games with scoring
|   |   +-- NotFound.tsx             404 error page
|   |
|   |-- lib/
|   |   |-- groqClient.ts           Groq LLM client with demo fallback system
|   |   +-- utils.ts                Tailwind class merge utility
|   |
|   |-- hooks/
|   |   +-- (custom React hooks)
|   |
|   |-- App.tsx                      Root component with React Router configuration
|   |-- main.tsx                     Application entry point
|   +-- index.css                    Global styles, CSS variables, glassmorphic classes
|
|-- .env                             Environment variables (API keys)
|-- .env.example                     Template for environment setup
|-- index.html                       HTML entry point with meta tags
|-- package.json                     Dependencies and scripts
|-- vite.config.ts                   Vite build configuration
|-- tailwind.config.ts               Tailwind CSS theme extensions
|-- tsconfig.json                    TypeScript compiler configuration
|-- vercel.json                      Vercel deployment configuration
+-- LICENSE                          MIT License
```

---

## Installation and Setup

### Prerequisites

- **Node.js**: Version 18.0 or higher (LTS recommended)
- **Package Manager**: npm (bundled with Node.js) or pnpm
- **Groq API Key** (optional for demo mode, required for live AI): Obtain from https://console.groq.com/keys
- **Modern Browser**: Chrome 90+, Edge 90+, Firefox 88+, or Safari 14+
- **Camera Access** (optional): Required only for the Vision Monitor feature

### Step 1: Clone the Repository

```bash
git clone https://github.com/abhi3114-glitch/NEUROFEST.git
cd NEUROFEST
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm:
```bash
pnpm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Open the `.env` file and add your Groq API key:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Note**: The application includes an intelligent demo mode. If no API key is provided, the AI Assistant will respond with contextually appropriate mock responses covering emotions, tasks, games, sleep routines, and general help queries. This allows full demonstration without external API dependencies.

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` by default. To specify a custom port:

```bash
npm run dev -- --port 4000
```

---

## Environment Variables

| Variable | Description | Required | Default Behavior Without It |
|----------|-------------|----------|-----------------------------|
| `VITE_GROQ_API_KEY` | Groq API key for the AI Assistant | No | Intelligent demo mode activates with 12+ contextual mock responses |

---

## Running the Application

After starting the development server, open the URL displayed in your terminal. You will see the NeuroNest landing page with three role selection cards:

1. **"I'm a User"** — Opens the User Dashboard with Mood Tracker, Daily Routine, AI Assistant, Calm Room, AAC Board, and Community Hub
2. **"I'm a Caregiver"** — Opens the Caregiver Dashboard with Patient Overview, Mood Logs, Vision Monitor, Diet Tracker, Social Story Builder, Alerts, and Notes
3. **"I'm a Doctor"** — Opens the Doctor Portal with EMR Viewer, Prescription Management, and Telehealth Connect

Each portal is a self-contained experience with its own navigation tabs and feature set.

---

## Build and Deployment

### Production Build

```bash
npm run build
```

This generates an optimized production bundle in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel (Recommended)

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add the `VITE_GROQ_API_KEY` environment variable in the Vercel project dashboard under Settings > Environment Variables.

The repository includes a `vercel.json` configuration file with SPA routing rules pre-configured.

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the output directory:
   ```bash
   netlify deploy --prod --dir=dist
   ```

---

## Design Principles

### 1. Sensory-First Design
Every interface element is designed to minimize sensory overload. The application uses a dark cinematic theme with `zinc-950` backgrounds, soft translucent glassmorphism effects (`backdrop-blur-xl`), and carefully curated accent colors that avoid harsh contrasts.

### 2. Visual-First Communication
All primary interactions use large visual elements — oversized emoji for mood selection, color-coded cards for navigation, icon-driven AAC tiles, and animated visual feedback for every action.

### 3. Structured Predictability
Neurodivergent users benefit from consistent, predictable interfaces. Every dashboard follows the same tab-based navigation pattern. All interactive elements provide immediate feedback via toast notifications and visual state changes.

### 4. Adaptive AI Communication
The AI Assistant uses a specialized system prompt that enforces clear language, avoids metaphors and abstract concepts, provides actionable steps, uses positive reinforcement, and breaks down complex ideas into manageable parts.

### 5. Progressive Complexity
The platform layers complexity by role. The User Portal is the simplest with large, friendly interfaces. The Caregiver Dashboard adds monitoring and data visualization. The Doctor Portal provides clinical-grade tools with dense data displays.

---

## Accessibility Standards

NeuroNest implements the following accessibility features aligned with WCAG 2.1 guidelines:

| Feature | Implementation |
|---------|---------------|
| **Keyboard Navigation** | All interactive elements are keyboard-accessible with visible focus rings (`ring-2 ring-purple-500`) |
| **Touch Targets** | Minimum 44x44px touch targets on all buttons and interactive elements (`.touch-target` class) |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` disables all animations for motion-sensitive users |
| **Screen Reader Support** | ARIA roles, labels, and progress bar `aria-valuenow`/`aria-valuemin`/`aria-valuemax` attributes |
| **Dyslexia-Friendly Font** | OpenDyslexic font available via the `.font-accessible` CSS class |
| **Voice Input** | Web Speech API integration in the Mood Tracker for users who find typing difficult |
| **Speech Output** | AAC Board tiles vocalize phrases using the SpeechSynthesis API |
| **High Contrast** | Color combinations tested for sufficient contrast ratios on dark backgrounds |
| **Semantic HTML** | Proper heading hierarchy (single h1 per page), semantic elements, and descriptive link text |

---

## Module Documentation

### groqClient.ts — AI Integration Layer

The `GroqClient` class provides three specialized methods:

- **`assistUser(message, context?)`**: General-purpose neurodivergent support assistant
- **`provideEmotionalSupport(emotion, details?)`**: Targeted emotional support with coping strategies
- **`helpWithLearning(topic, difficulty?)`**: Educational assistance with adaptive difficulty levels

When no API key is configured, the private `getDemoResponse()` method provides contextually appropriate mock responses for 12 categories: greetings, emotional states (sad, anxious, angry), task management, room cleaning breakdown, games, sleep routines, help queries, and thank-you acknowledgments.

### VisionMonitor.tsx — Computer Vision Module

- **Model Loading**: TensorFlow.js and COCO-SSD are loaded via dynamic `import()` statements to prevent build-time failures and reduce initial bundle size
- **Detection Loop**: Uses `requestAnimationFrame` for frame-rate-matched detection cycles
- **Canvas Rendering**: Detection results (bounding boxes, labels, confidence indicators) are drawn on a transparent canvas overlay positioned absolutely over the video element
- **Alert State Machine**: A frame-score counter accumulates consecutive alert frames. After exceeding a threshold (10 frames for hazard/behavior, 30 frames for safe-zone), the status transitions to "Alert"

---

## Browser and Device Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Google Chrome | 90+ | Full support including camera and speech APIs |
| Microsoft Edge | 90+ | Full support (Chromium-based) |
| Mozilla Firefox | 88+ | Full support; speech recognition may require enabling in flags |
| Apple Safari | 14+ | Full support; camera requires HTTPS in production |
| Chrome Mobile (Android) | 90+ | Full support |
| Safari Mobile (iOS) | 14+ | Camera requires HTTPS; speech synthesis supported |

**Important Notes:**
- Camera access (Vision Monitor) requires either `localhost` or HTTPS
- The Web Speech API for voice input is not supported in all browsers; the application gracefully falls back to text-only input
- TensorFlow.js performance varies by device; GPU-accelerated devices will see smoother detection in the Vision Monitor

---

## Future Roadmap

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Backend Integration | Replace localStorage with Supabase or Firebase for multi-user auth and cross-device sync |
| High | WebRTC Telehealth | Implement real peer-to-peer video consultations using a signaling server |
| Medium | Mobile Application | React Native port for iOS and Android with push notifications |
| Medium | Multi-Language Support | Internationalization (i18n) for Hindi, Spanish, French, and Arabic |
| Medium | Advanced Analytics | Recharts-powered behavioral trend visualization for caregivers |
| Low | Offline Mode | Service Worker integration for PWA offline functionality |
| Low | Healthcare System Integration | HL7 FHIR compliance for EHR interoperability |

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with descriptive commit messages
4. Ensure the build passes: `npm run build`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request with a detailed description of your changes

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Abhishek**

GitHub: [github.com/abhi3114-glitch](https://github.com/abhi3114-glitch)

---

*NeuroNest — Because every mind deserves the right tools to thrive.*
