// API configuration
const API_BASE_URL = 'https://llm.nnoc.cloud:8842/ai_day_engine';
const API_TOKEN = 'SDDFDSFn1232evje34fnc4SDASDSF5vuiqSDFabcj678ksbcjbnsjka89SDFDS898sdf';

// Common headers for all API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
});

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Login API
export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message?: string;
  user_info?: {
    tm_id: string;
    name: string;
    gender: string;
    department: string;
    division: string;
    position: string;
    mobile: string;
    email: string;
    lob: string;
  };
}

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Survey API
export interface SurveyRequest {
  tm_id: string;
  answers: string[];
}

export interface SurveyResponse {
  status: string;
  message?: string;
  level?: string;
  score?: number;
  competency_status?: string;
}

export const submitSurvey = async (surveyData: SurveyRequest): Promise<SurveyResponse> => {
  return apiRequest<SurveyResponse>('/survey', {
    method: 'POST',
    body: JSON.stringify(surveyData),
  });
};

// Chat API
export interface ChatRequest {
  tm_id: string;
  message: string;
  chat_history: Array<{
    role: string;
    content: string;
  }>;
}

export interface ChatResponse {
  status: string;
  message?: string;
  level?: string;
  score?: number;
  competency_status?: string;
}

export const sendChatMessage = async (chatData: ChatRequest): Promise<ChatResponse> => {
  return apiRequest<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify(chatData),
  });
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('401')) {
      return 'Authentication failed. Please check your credentials.';
    }
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};