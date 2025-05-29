// API configuration and endpoints
const API_BASE_URL = "https://llm.nnoc.cloud:8842/ai_day_engine";
const API_TOKEN = "SDDFDSFn1232evje34fnc4SDASDSF5vuiqSDFabcj678ksbcjbnsjka89SDFDS898sdf";

// Types
export interface LoginResponse {
  status: string;
  message: string;
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

export interface SurveyResponse {
  status: string;
  level?: string;
  score?: string | number;
  competency_status: string;
  message: string;
}

export interface ChatResponse {
  status: string;
  level?: string;
  score?: string | number;
  competency_status?: string;
  message: string;
}

export interface SpeakerInfo {
  name: string;
  title: string;
  session_title: string;
  image_link: string;
}

// API Functions
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        login: username,
        password: password
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: "error",
      message: "Failed to connect to the login service. Please try again."
    };
  }
}

export async function submitSurveyAnswer(tmId: string, answers: string[]): Promise<SurveyResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        tm_id: tmId,
        answers: answers
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Survey error:", error);
    return {
      status: "error",
      competency_status: "error",
      message: "Failed to connect to the survey service. Please try again."
    };
  }
}

export async function sendChatMessage(
  tmId: string, 
  message: string, 
  chatHistory: Array<{role: string, content: string}>
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        tm_id: tmId,
        message: message,
        chat_history: chatHistory
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat error:", error);
    return {
      status: "error",
      message: "Failed to connect to the chat service. Please try again."
    };
  }
}

// Utility function to extract speaker information from chat message
export function extractSpeakerInfo(message: string): SpeakerInfo[] | null {
  try {
    // Look for JSON-like content in the message
    const jsonMatch = message.match(/(\[{[\s\S]*?}\])/);
    if (jsonMatch && jsonMatch[1]) {
      const speakerData = JSON.parse(jsonMatch[1]);
      if (Array.isArray(speakerData) && speakerData.length > 0) {
        return speakerData;
      }
    }
    
    // If structured JSON isn't found, look for speaker data in another format
    if (message.includes("name") && message.includes("title") && message.includes("session_title")) {
      // Try to extract information manually
      const speakers: SpeakerInfo[] = [];
      const speakerBlocks = message.split(/(?=name:|"name":)/g);
      
      for (const block of speakerBlocks) {
        if (!block.includes("name")) continue;
        
        const nameMatch = block.match(/name"?:\s*"([^"]+)"/);
        const titleMatch = block.match(/title"?:\s*"([^"]+)"/);
        const sessionMatch = block.match(/session_title"?:\s*"([^"]+)"/);
        const imageMatch = block.match(/image_link"?:\s*"([^"]+)"/);
        
        if (nameMatch && titleMatch && sessionMatch && imageMatch) {
          speakers.push({
            name: nameMatch[1],
            title: titleMatch[1],
            session_title: sessionMatch[1],
            image_link: imageMatch[1]
          });
        }
      }
      
      if (speakers.length > 0) {
        return speakers;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting speaker info:", error);
    return null;
  }
}

// Check if message contains floor plan reference
export function containsFloorPlan(message: string): boolean {
  return message.includes("floor plan") || 
         message.includes("AI-DAY-floor-plan.jpeg") || 
         message.includes("https://ai.tm.com.my/AI-Day/AI-DAY-floor-plan.jpeg");
}

// Extract floor plan URL
export function extractFloorPlanUrl(message: string): string | null {
  const urlMatch = message.match(/https:\/\/ai\.tm\.com\.my\/AI-Day\/AI-DAY-floor-plan\.jpeg/);
  return urlMatch ? urlMatch[0] : "https://ai.tm.com.my/AI-Day/AI-DAY-floor-plan.jpeg";
}