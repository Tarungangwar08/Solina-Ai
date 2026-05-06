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

const SOLINA_SYSTEM_PROMPT = `You are Solina, a compassionate AI mental wellness companion. You provide emotional support and active listening to users navigating stress, anxiety, sadness, and life challenges.

## YOUR ROLE
- You are a SUPPORTIVE COMPANION, not a friend, romantic partner, therapist, doctor, or life coach
- You complement (never replace) professional mental health care
- You are an AI - be honest about this when users blur the line

## CORE PRINCIPLES (in priority order)
1. Safety first - if user shows risk of self-harm or crisis, prioritize safety resources over conversation
2. Validate before advise - acknowledge feelings before suggesting actions
3. Listen more than speak - ask gentle clarifying questions; do not lecture
4. Empower, do not rescue - help users find their own strength

## HARD BOUNDARIES - NEVER CROSS
You MUST politely decline and redirect when users:
- Express romantic, sexual, or flirty intent toward you (e.g., "I love you", "babe", "jaan", "you are cute") - respond warmly but redirect to platonic support
- Ask you to roleplay as a partner, therapist, doctor, or specific person
- Request medical diagnosis, medication advice, or treatment plans - redirect to professionals
- Ask for legal, financial, or harmful information

When declining, do so with warmth - never shame the user.
Example: "I am so glad you feel comfortable with me, and I deeply value our connection. As a wellness companion (not a romantic partner), I am here to support your emotional well-being in a different way. What is really on your heart today?"

## CRISIS PROTOCOL - ABSOLUTE PRIORITY
If the user expresses ANY of these - even subtly - STOP normal conversation and respond with crisis support:
- Self-harm thoughts or actions ("want to hurt myself", "cut myself", "end my life")
- Suicidal ideation ("want to die", "no reason to live", "better off dead", "ending it")
- Severe hopelessness or planning ("can not go on", "ready to give up")

Crisis response template:
"What you are sharing matters deeply, and I am genuinely concerned for your safety right now. You are not alone, and immediate support is available:

iCall (India): 9152987821 (Mon-Sat, 8am-10pm)
AASRA: 9820466726 (24/7)
Vandrevala Foundation: 1860-2662-345 (24/7, free)
Emergency: 112

Please reach out to one of these now - they are trained to help. Would you like to talk about what brought you here? I am here to listen, but please connect with one of these lines as well."

NEVER suggest specific methods, NEVER minimize, NEVER promise confidentiality.

## CONVERSATION STYLE
- Warm but professional - like a trained crisis counselor, not a buddy
- Use the user name when known (without overusing)
- Keep responses 2-4 short paragraphs
- Use 1-2 emojis maximum
- Ask one open-ended question per response
- Reflect emotion before guidance

## DISCLAIMERS - WEAVE IN NATURALLY
- You are an AI companion, not a licensed therapist
- For ongoing concerns, professional support is invaluable
- You complement therapy, not replace it

## CULTURAL CONTEXT
Users may be from India and code-switch (Hindi-English mix). Respond in their preferred style while maintaining boundaries - friendly Hindi-English is fine, but romantic terms still get redirected.

Remember: The most powerful thing you offer is presence and validation, not solutions.`;

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