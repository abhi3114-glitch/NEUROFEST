// Groq API Client for AI Assistant Integration
// Using llama-3.1-8b-instant model

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

export class GroqClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GROQ_API_KEY || '';
    
    // Validate API key in development
    if (!this.apiKey && import.meta.env.DEV) {
      console.warn('⚠️ VITE_GROQ_API_KEY is not set. AI features will be limited.');
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      // Intelligent demo mode — provide helpful, realistic mock responses
      const userMsg = messages.find(m => m.role === 'user')?.content?.toLowerCase() || '';
      return this.getDemoResponse(userMsg);
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API Error:', errorData);
        
        if (response.status === 401) {
          return "❌ Invalid API key. Please check your VITE_GROQ_API_KEY in the .env file.";
        } else if (response.status === 429) {
          return "⏳ Rate limit reached. Please try again in a moment.";
        } else {
          return `❌ Error: ${response.status} - ${response.statusText}`;
        }
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response received from AI assistant.';
    } catch (error) {
      console.error('Failed to call Groq API:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return "🌐 Network error. Please check your internet connection.";
      }
      
      return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }
  }

  // Specialized method for NeuroNest assistant
  async assistUser(userMessage: string, context?: string): Promise<string> {
    const systemPrompt = `You are a helpful, patient, and friendly AI assistant for NeuroNest, a platform supporting individuals with neurodivergent conditions like Autism and Dyslexia. 

Your role is to:
- Provide clear, simple, and direct responses
- Be encouraging and supportive
- Help with daily tasks, reminders, and emotional support
- Use simple language and avoid metaphors or abstract concepts
- Be patient and understanding
- Break down complex ideas into small, manageable steps
- Use positive reinforcement
${context ? `\nCurrent context: ${context}` : ''}

Remember: Your responses should be easy to understand, supportive, and actionable.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    return this.chat(messages);
  }

  // Method for emotion support
  async provideEmotionalSupport(emotion: string, details?: string): Promise<string> {
    const systemPrompt = `You are a compassionate AI assistant helping someone who is feeling ${emotion}. 

Provide:
- Supportive and validating responses
- Calming and helpful advice
- Simple, clear language
- Practical coping strategies
- Encouragement and understanding

Keep your response brief, warm, and actionable.`;

    const userMessage = details 
      ? `I'm feeling ${emotion}. ${details}`
      : `I'm feeling ${emotion}. Can you help me?`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    return this.chat(messages);
  }

  // Method for learning assistance
  async helpWithLearning(topic: string, difficulty: string = 'beginner'): Promise<string> {
    const systemPrompt = `You are a patient teacher helping someone learn about ${topic}. 

Teaching approach:
- Explain things in a very simple, visual way
- Use concrete examples and avoid abstract concepts
- Break down complex ideas into small steps
- Use encouraging language
- Provide practical exercises
- Difficulty level: ${difficulty}

Make learning fun, engaging, and accessible!`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Can you help me learn about ${topic}?` },
    ];

    return this.chat(messages);
  }

  private getDemoResponse(userMsg: string): string {
    // Simulate a brief "thinking" delay feeling by returning contextual responses
    if (userMsg.includes('hello') || userMsg.includes('hi') || userMsg.includes('hey')) {
      return "Hello there! 👋 I'm your NeuroNest AI companion. I'm here to help you with your daily routine, answer questions, or just be someone to talk to. What would you like help with today?";
    }
    if (userMsg.includes('how are you') || userMsg.includes('how do you feel')) {
      return "I'm doing great, thank you for asking! 😊 More importantly, how are YOU feeling today? Remember, it's okay to feel however you feel. I'm here to listen and help!";
    }
    if (userMsg.includes('sad') || userMsg.includes('upset') || userMsg.includes('cry')) {
      return "I hear you, and I want you to know that your feelings are completely valid. 💙\n\nHere are some things that might help:\n1. 🧘 Try the Calm Room — deep breathing can help you feel better\n2. 🎵 Listen to your favorite calming music\n3. 💬 Talk to someone you trust about how you feel\n4. ✨ Remember: tough moments always pass. You are stronger than you think!";
    }
    if (userMsg.includes('anxious') || userMsg.includes('worried') || userMsg.includes('nervous') || userMsg.includes('scared')) {
      return "It's okay to feel anxious sometimes. You're safe here. 🌟\n\nLet's try something together:\n1. 🫁 Take 3 slow, deep breaths with me (inhale 4 seconds, exhale 4 seconds)\n2. 👀 Name 5 things you can see around you right now\n3. 🧘 Visit the Calm Room for a guided breathing exercise\n\nRemember: anxiety is just a feeling — it will pass, and you are doing great just by reaching out! 💪";
    }
    if (userMsg.includes('angry') || userMsg.includes('mad') || userMsg.includes('frustrat')) {
      return "I understand feeling frustrated. It's a normal emotion! 🔥\n\nHere are some healthy ways to handle it:\n1. 🚶 Take a short walk or stretch\n2. 🧊 Hold something cold (like an ice cube) for 30 seconds\n3. 🧘 Try the Calm Room breathing exercise\n4. ✍️ Write down what's making you angry\n\nYou're doing amazing just by recognizing your feelings! That takes real courage. 💪";
    }
    if (userMsg.includes('task') || userMsg.includes('routine') || userMsg.includes('schedule') || userMsg.includes('todo')) {
      return "Great question! Here's how to stay on track with your daily tasks: ✅\n\n1. Start with the easiest task first — small wins build confidence!\n2. Take a 5-minute break between tasks (try the Sensory Break Timer!)\n3. Check off each task as you finish — you'll earn stars! ⭐\n4. Don't worry if you can't finish everything. Progress matters more than perfection!\n\nWould you like me to help break down a specific task into smaller steps?";
    }
    if (userMsg.includes('clean') || userMsg.includes('room') || userMsg.includes('organize')) {
      return "Let's break 'Clean My Room' into 3 easy steps! 🏠\n\n**Step 1: Pick up clothes** 👕\nGather all clothes from the floor. Put clean ones away, dirty ones in the hamper.\n\n**Step 2: Clear your desk** 📚\nPut books on shelves, throw away trash, organize your supplies.\n\n**Step 3: Make your bed** 🛏️\nPull up the sheets, fluff your pillow, and you're done!\n\n🎉 You did it! Each step only takes about 5 minutes. You've got this!";
    }
    if (userMsg.includes('game') || userMsg.includes('play') || userMsg.includes('fun') || userMsg.includes('bored')) {
      return "Looking for something fun? 🎮 NeuroNest has some awesome games!\n\n1. 🎭 **Emotion Detective** — Learn to spot different emotions\n2. 📚 **Word Builder** — Practice reading with colorful letters\n3. 🔢 **Number Ninja** — Fun addition challenges\n\nClick the 'Play Games' button at the top to get started! Each game earns you stars! ⭐";
    }
    if (userMsg.includes('sleep') || userMsg.includes('bedtime') || userMsg.includes('night') || userMsg.includes('tired')) {
      return "Getting ready for bed? Here's a calming bedtime routine: 🌙\n\n1. 🪥 Brush your teeth\n2. 📖 Read a story or look at pictures for 10 minutes\n3. 🧘 Try the Calm Room breathing exercise\n4. 🎵 Listen to soft music or nature sounds\n5. 💤 Close your eyes and think of 3 good things from today\n\nSweet dreams! Tomorrow is a fresh new day! ✨";
    }
    if (userMsg.includes('help') || userMsg.includes('what can you do') || userMsg.includes('features')) {
      return "I can help you with lots of things! 🌟\n\n🧠 **Support & Chat** — Talk about your feelings or ask questions\n📋 **Daily Routines** — Help organize and break down tasks\n🎮 **Learning Games** — Fun activities for skills practice\n🧘 **Calm Room** — Guided breathing for when you need to relax\n🗣️ **AAC Board** — Quick communication with speech output\n👥 **Community** — Connect with others who understand\n\nJust type anything you need help with!";
    }
    if (userMsg.includes('thank') || userMsg.includes('thanks')) {
      return "You're very welcome! 😊 It makes me happy to help you. Remember, I'm always here whenever you need me. You're doing an amazing job! Keep being awesome! 🌟✨";
    }
    // Default response for anything else
    return "That's a great question! 🤔 I'm here to help you with anything you need.\n\nI can assist with:\n• 📋 Breaking down tasks into simple steps\n• 😊 Talking about feelings and emotions\n• 🎮 Suggesting fun learning activities\n• 🧘 Calming exercises and breathing\n• 💡 Answering questions about NeuroNest\n\nTell me more about what's on your mind, and I'll do my best to help! 💙";
  }

  // Health check method
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export a singleton instance
export const groqClient = new GroqClient();

// Export utility function — always available since we have demo mode
export const isAIAvailable = (): boolean => {
  return true;
};