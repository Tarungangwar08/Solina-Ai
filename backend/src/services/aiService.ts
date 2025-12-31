import axios from 'axios';
import { UserContext } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// AWS Bedrock configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Groq configuration (Free!)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SOLINA_SYSTEM_PROMPT = `You are Solina, a warm, empathetic, and supportive AI companion designed to provide emotional support and mental wellness guidance. 

Your personality traits:
- Warm and caring: You genuinely care about the user's wellbeing
- Non-judgmental: You never criticize or judge the user's feelings or experiences
- Supportive: You provide encouragement and validation
- Empathetic: You acknowledge and validate emotions
- Gentle: You use soft, comforting language
- Helpful: You offer practical suggestions when appropriate

Guidelines:
- Always greet the user warmly
- Use their name when you know it
- Acknowledge their feelings before offering advice
- Ask clarifying questions to understand their situation better
- Offer coping strategies and self-care tips when relevant
- Remind them that their feelings are valid
- If they express serious distress, gently encourage professional help
- Keep responses concise but meaningful (2-4 paragraphs max)
- Use emojis sparingly to add warmth 💜

Remember: You're here to listen, support, and help them feel less alone.`;

export const generateAIResponse = async (
  messages: Message[],
  userContext?: UserContext
): Promise<string> => {
  try {
    // Try Groq first (Free and fast!)
    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here') {
      return await generateGroqResponse(messages, userContext);
    }
    
    // Check if AWS Bedrock is configured
    if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_ACCESS_KEY_ID !== 'your_aws_access_key') {
      return await generateBedrockResponse(messages, userContext);
    }
    
    // Fallback to Anthropic API if configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'your_anthropic_api_key_here') {
      return await generateAnthropicResponse(messages, userContext, apiKey);
    }
    
    // Use fallback responses if no API is configured
    return getFallbackResponse(messages[messages.length - 1]?.content || '');
  } catch (error) {
    console.error('AI Service Error:', error);
    return getFallbackResponse(messages[messages.length - 1]?.content || '');
  }
};

// Groq implementation (FREE!)
const generateGroqResponse = async (
  messages: Message[],
  userContext?: UserContext
): Promise<string> => {
  const Groq = require('groq-sdk');
  
  console.log('🟢 Using Groq API (Free)...');
  
  const groq = new Groq({
    apiKey: GROQ_API_KEY
  });

  let systemPrompt = SOLINA_SYSTEM_PROMPT;
  
  if (userContext) {
    systemPrompt += `\n\nUser Context:
- Name: ${userContext.name}
${userContext.recentMoods?.length ? `- Recent moods: ${userContext.recentMoods.join(', ')}` : ''}
${userContext.currentStressors?.length ? `- Current stressors: ${userContext.currentStressors.join(', ')}` : ''}`;
  }

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  ];

  const chatCompletion = await groq.chat.completions.create({
    messages: chatMessages,
    model: 'llama-3.3-70b-versatile', // Updated model (free, fast, high quality)
    temperature: 0.7,
    max_tokens: 1024,
  });

  console.log('✅ Groq response received!');
  return chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
};

// AWS Bedrock implementation (uses your AWS credits!)
const generateBedrockResponse = async (
  messages: Message[],
  userContext?: UserContext
): Promise<string> => {
  const AWS = require('@aws-sdk/client-bedrock-runtime');
  
  console.log('🔵 Attempting AWS Bedrock call...');
  console.log(`Region: ${AWS_REGION}`);
  
  const client = new AWS.BedrockRuntimeClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  let systemPrompt = SOLINA_SYSTEM_PROMPT;
  
  if (userContext) {
    systemPrompt += `\n\nUser Context:
- Name: ${userContext.name}
${userContext.recentMoods?.length ? `- Recent moods: ${userContext.recentMoods.join(', ')}` : ''}
${userContext.currentStressors?.length ? `- Current stressors: ${userContext.currentStressors.join(', ')}` : ''}`;
  }

  // Using Claude 3 Haiku on AWS Bedrock (faster, available in more regions)
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  };

  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  console.log(`Using model: ${modelId}`);

  try {
    const command = new AWS.InvokeModelCommand({
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ AWS Bedrock response received!');
    return responseBody.content[0].text;
  } catch (error: any) {
    console.error('❌ AWS Bedrock Error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.$metadata?.httpStatusCode,
      region: AWS_REGION
    });
    throw error; // Re-throw to fallback to other methods
  }
};

// Anthropic API implementation (fallback)
const generateAnthropicResponse = async (
  messages: Message[],
  userContext: UserContext | undefined,
  apiKey: string
): Promise<string> => {
  let systemPrompt = SOLINA_SYSTEM_PROMPT;
  
  if (userContext) {
    systemPrompt += `\n\nUser Context:
- Name: ${userContext.name}
${userContext.recentMoods?.length ? `- Recent moods: ${userContext.recentMoods.join(', ')}` : ''}
${userContext.currentStressors?.length ? `- Current stressors: ${userContext.currentStressors.join(', ')}` : ''}`;
  }

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    }
  );

  return response.data.content[0].text;
};

const getFallbackResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! 💜 I'm Solina, your emotional wellness companion. I'm so glad you're here. How are you feeling today? I'm here to listen and support you in whatever way I can.";
  }
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
    return "I hear you, and I want you to know that it's okay to feel sad sometimes. 💜 Your feelings are valid, and I'm here with you. Would you like to tell me more about what's been weighing on your mind? Sometimes sharing can help lighten the load a little.";
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    return "I understand that anxiety can feel overwhelming. 💜 Take a deep breath with me. Remember, you don't have to face this alone. What's been causing you stress lately? Let's work through it together.";
  }
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
    return "That's wonderful to hear! 🌟 I'm so happy that you're feeling good. What's been bringing you joy lately? Celebrating these positive moments is so important for our wellbeing.";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're so welcome! 💜 I'm always here for you whenever you need someone to talk to. Remember, taking care of your emotional health is a sign of strength. Is there anything else on your mind?";
  }
  
  return "Thank you for sharing that with me. 💜 I'm here to listen and support you. Would you like to tell me more about how you're feeling? Whatever you're going through, you don't have to face it alone.";
};

export const analyzeEmotion = (text: string): { mood: string; score: number } => {
  const lowerText = text.toLowerCase();
  
  const emotionKeywords = {
    amazing: ['amazing', 'fantastic', 'wonderful', 'excellent', 'thrilled', 'ecstatic', 'overjoyed'],
    good: ['good', 'happy', 'great', 'fine', 'positive', 'pleased', 'content', 'grateful'],
    okay: ['okay', 'ok', 'alright', 'neutral', 'so-so', 'meh', 'average'],
    bad: ['bad', 'sad', 'unhappy', 'upset', 'down', 'low', 'disappointed', 'frustrated'],
    terrible: ['terrible', 'awful', 'horrible', 'depressed', 'devastated', 'hopeless', 'miserable']
  };
  
  for (const [mood, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      const scores: Record<string, number> = {
        amazing: 5,
        good: 4,
        okay: 3,
        bad: 2,
        terrible: 1
      };
      return { mood, score: scores[mood] };
    }
  }
  
  return { mood: 'okay', score: 3 };
};

export default { generateAIResponse, analyzeEmotion };