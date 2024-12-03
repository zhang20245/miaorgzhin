declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: { model: string }): GenerativeModel;
  }

  export interface GenerativeModel {
    startChat(config?: {
      generationConfig?: {
        temperature?: number;
        topP?: number;
        topK?: number;
        maxOutputTokens?: number;
      };
      history?: Array<{
        role: string;
        parts: Array<{ text: string }>;
      }>;
    }): ChatSession;
  }

  export interface ChatSession {
    sendMessage(content: Array<{ text: string }>): Promise<{
      response: {
        text: () => string;
      };
    }>;
  }
}