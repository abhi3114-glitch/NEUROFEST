# NeuroNest Development Plan - MVP Version

## Project Overview
Building an inclusive AI-powered care platform for neurodivergent individuals with focus on core features that can be demonstrated in a web application.

## MVP Scope (Simplified for Web Demo)
Given the complexity, we'll create an MVP focusing on:
1. **User Dashboard** - Main interface with mood tracker, daily routines, and learning games
2. **Caregiver Dashboard** - Monitoring interface with patient profiles and behavior logs
3. **AI Integration** - Basic AI chat assistant using Groq API (llama-3.1-8b-instant)
4. **Responsive Design** - Mobile and desktop friendly
5. **Accessibility Features** - OpenDyslexic font support, sensory-friendly colors

## Files to Create (Max 8 files)

### 1. `/workspace/shadcn-ui/.env.example` 
- Template for environment variables (GROQ_API_KEY)

### 2. `/workspace/shadcn-ui/src/pages/Index.tsx`
- Landing page with role selection (User/Caregiver/Doctor)
- Hero section with project introduction

### 3. `/workspace/shadcn-ui/src/pages/UserDashboard.tsx`
- Mood tracker with emoji selection
- Daily routine checklist
- Quick access to learning games
- Voice assistant chat interface (AI integration)

### 4. `/workspace/shadcn-ui/src/pages/CaregiverDashboard.tsx`
- Patient profiles overview
- Behavior logs and mood history
- Alert notifications panel
- Messaging interface

### 5. `/workspace/shadcn-ui/src/pages/LearningGames.tsx`
- Interactive learning activities
- Emotion identification game
- Literacy/phonics game
- Progress tracker

### 6. `/workspace/shadcn-ui/src/lib/groqClient.ts`
- Groq API integration for AI assistant
- Helper functions for chat completions

### 7. `/workspace/shadcn-ui/src/components/MoodTracker.tsx`
- Reusable mood tracking component with emoji selection
- Voice input support (Web Speech API)

### 8. `/workspace/shadcn-ui/src/index.css`
- Update with OpenDyslexic font
- Sensory-friendly color palette
- Accessibility enhancements

## Design Principles
- Calm color palette (soft blues, greens, warm neutrals)
- Large, clear buttons and text
- Minimal distractions
- High contrast for readability
- Responsive grid layouts

## Technical Notes
- Using localStorage for demo data persistence
- Web Speech API for voice features
- Groq API calls from frontend (for demo purposes)
- React Router for navigation between dashboards