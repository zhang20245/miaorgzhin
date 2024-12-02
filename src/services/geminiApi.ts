import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, APISettings } from '../types/api';

export async function sendMessageToGemini(messages: Message[], settings: APISettings): Promise<string> {
  const genAI = new GoogleGenerativeAI(settings.apiKey);
  
  const model = genAI.getGenerativeModel({
    model: settings.model,
  });

  const generationConfig = {
    temperature: settings.temperature,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: settings.maxTokens,
  };

  try {
    // Find index of first user message
    const firstUserMessageIndex = messages.findIndex(msg => msg.role === 'user');
    if (firstUserMessageIndex === -1) {
      throw new Error('No user messages found in history');
    }

    // Only include messages starting from the first user message
    const validMessages = messages.slice(firstUserMessageIndex);

    // Format messages according to Gemini's API requirements
    const formattedHistory = validMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: formattedHistory,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chatSession.sendMessage([{ text: lastMessage.content }]);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}