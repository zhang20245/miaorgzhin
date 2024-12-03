import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, APISettings } from '../types/api';

export async function sendMessageToGemini(messages: Message[], settings: APISettings): Promise<string> {
  // Check for API key
  if (!settings.apiKey) {
    throw new Error('API 密钥未设置，请在设置中配置 API 密钥。');
  }

  try {
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

    // Find index of first user message
    const firstUserMessageIndex = messages.findIndex(msg => msg.role === 'user');
    if (firstUserMessageIndex === -1) {
      throw new Error('对话历史中未找到用户消息');
    }

    // Only include messages starting from the first user message
    const validMessages = messages.slice(firstUserMessageIndex);

    // Format messages according to Gemini's API requirements
    const formattedHistory = validMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: formattedHistory,
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chatSession.sendMessage([{ text: lastMessage.content }]);
      
      if (!result.response.text()) {
        throw new Error('AI 返回了空响应，请重试。');
      }

      return result.response.text();
    } catch (error: any) {
      if (error?.message?.includes('API_KEY_INVALID')) {
        throw new Error('API 密钥无效，请检查设置。');
      }
      if (error?.message?.includes('PERMISSION_DENIED')) {
        throw new Error('API 密钥权限不足，请检查设置。');
      }
      if (error?.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('API 调用次数已达上限，请稍后重试。');
      }
      throw error;
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}