# NeuroNest - Learn. Connect. Thrive. 🧠

An inclusive AI-powered care platform designed to support individuals with neurodivergent conditions such as Autism and Dyslexia. NeuroNest provides tools for learning, emotional support, daily routines, and real-time monitoring for caregivers and healthcare professionals.

![NeuroNest Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178c6)

## 🌟 Features

### For Users
- **Mood Tracker**: Track emotions with emoji selection and voice input
- **Daily Routine Checklist**: Visual task management with progress tracking
- **AI Voice Assistant**: Powered by Groq's llama-3.1-8b-instant for emotional support and guidance
- **Learning Games**: 
  - Emotion Detective: Learn to identify different emotions
  - Word Builder: Practice reading and spelling with colorful letters

### For Caregivers & Doctors
- **Patient Monitoring Dashboard**: Real-time overview of patient progress
- **Mood History Logs**: Track emotional patterns over time
- **Behavior Alerts**: Receive notifications for significant changes
- **Therapy Notes**: Secure documentation and medical history

### Accessibility Features
- **OpenDyslexic Font**: Improved readability for individuals with Dyslexia
- **Sensory-Friendly Design**: Calm color palette, minimal distractions
- **High Contrast Mode**: Better visibility for all users
- **Voice Input Support**: Web Speech API integration
- **Responsive Design**: Optimized for mobile and desktop devices
- **Large Touch Targets**: Minimum 44px for easy interaction

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed
- Groq API key (get one at https://console.groq.com/keys)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abhi3114-glitch/NEUROFEST.git
cd NEUROFEST
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. **Start development server**
```bash
pnpm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Build the application
pnpm run build

# Preview the production build
pnpm run preview
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Add environment variables in Vercel Dashboard**
- Go to your project settings
- Add `VITE_GROQ_API_KEY` with your Groq API key

### Deploy to Netlify

1. **Build the project**
```bash
pnpm run build
```

2. **Deploy the `dist` folder**
```bash
netlify deploy --prod --dir=dist
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS 3.4.17
- **AI Integration**: Groq API (llama-3.1-8b-instant)
- **Speech Recognition**: Web Speech API
- **State Management**: React Hooks
- **Data Persistence**: LocalStorage

## 📁 Project Structure

```
NEUROFEST/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── MoodTracker.tsx  # Mood tracking component
│   ├── pages/
│   │   ├── Index.tsx        # Landing page
│   │   ├── UserDashboard.tsx
│   │   ├── CaregiverDashboard.tsx
│   │   └── LearningGames.tsx
│   ├── lib/
│   │   ├── groqClient.ts    # AI integration
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GROQ_API_KEY` | Groq API key for AI assistant | Yes |

## 🎨 Design Principles

1. **Visual-First Learning**: Use of colorful visuals and clear diagrams
2. **Multisensory Engagement**: Visual, auditory, and kinesthetic elements
3. **Structured & Predictable**: Clear step-by-step instructions
4. **Personalization**: AI-powered adaptive learning paths
5. **Sensory-Friendly**: Calming colors, no overstimulation

## 🧪 Testing

```bash
# Run linting
pnpm run lint

# Type checking
pnpm run type-check

# Build test
pnpm run build
```

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Groq** for the AI infrastructure
- **OpenDyslexic** for the accessible font
- **Radix UI** for accessible primitives

## 📧 Support

For support, email support@neuronest.com or open an issue on GitHub.

## 🔮 Roadmap

- [ ] Video call integration with WebRTC
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Offline mode support
- [ ] Parent/guardian portal
- [ ] Integration with healthcare systems

---

**Made By Abhishek**
