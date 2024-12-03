export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  choices: {
    message: Message;
  }[];
}

export type ModelProvider = 'fireworks' | 'gemini';

export interface APISettings {
  apiKey: string;
  provider: ModelProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  isDefaultKey?: boolean;
}

// Default API keys for each provider
export const DEFAULT_API_KEYS = {
  fireworks: 'fw_3Zk4r8RJGerNYfMrGpv72c8q',
  gemini: 'AIzaSyAVla98KBT3hD5GsNA2_40nQ_sV3hBtt0Q'
};

export const DEFAULT_API_SETTINGS: APISettings = {
  apiKey: DEFAULT_API_KEYS.fireworks,
  provider: 'fireworks',
  model: 'accounts/fireworks/models/qwen2p5-coder-32b-instruct',
  temperature: 0.6,
  maxTokens: 4096,
  isDefaultKey: true
};

export const MODEL_OPTIONS = {
  fireworks: [
    {
      id: 'accounts/fireworks/models/qwen2p5-coder-32b-instruct',
      name: 'Qwen 2.5 Coder (32B)'
    },
    {
      id: 'accounts/fireworks/models/mixtral-8x7b-instruct',
      name: 'Mixtral 8x7B'
    }
  ],
  gemini: [
    {
      id: 'gemini-pro',
      name: 'Gemini Pro'
    },
    {
      id: 'gemini-exp-1121',
      name: 'Gemini Experimental'
    }
  ]
};