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
      return "⚠️ AI Assistant is not configured. Please add your Groq API key to enable this feature.\n\nSteps:\n1. Copy .env.example to .env\n2. Get your API key from https://console.groq.com/keys\n3. Add VITE_GROQ_API_KEY=your_key_here to .env\n4. Restart the development server";
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

  // Health check method
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export a singleton instance
export const groqClient = new GroqClient();

// Export utility function to check if AI is available
export const isAIAvailable = (): boolean => {
  return groqClient.isConfigured();
};