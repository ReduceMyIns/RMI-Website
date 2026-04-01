
import { GoogleGenAI, FunctionDeclaration, Type, Modality, LiveServerMessage, Blob } from "@google/genai";
import { dbService } from './dbService';
import { AIAnalysisResult } from '../types';

// API key: baked in at Vite build time if available, otherwise fetched from /api/config at runtime.
// Cloud Run sets GEMINI_API_KEY as a runtime env var which is NOT available to Vite at build time,
// so we fetch it lazily from the server on first use.
let _resolvedApiKey: string = process.env.API_KEY || '';

async function getApiKey(): Promise<string> {
  if (_resolvedApiKey) return _resolvedApiKey;
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    if (data.apiKey) _resolvedApiKey = data.apiKey;
  } catch { /* ignore, will throw below */ }
  return _resolvedApiKey;
}

// Helper to get initialized AI client
const getAi = async () => {
  const key = await getApiKey();
  if (!key) {
    throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in Cloud Run environment variables.");
  }
  return new GoogleGenAI({ apiKey: key });
};

const INJECTED_SYSTEM_INSTRUCTION = `You are a professional insurance agent at ReduceMyInsurance.Net.
Agency: ReduceMyInsurance.Net - Independent Insurance Agency
Location: 1500 Medical Center Pkwy STE 3-A-26, Murfreesboro, TN 37129
Phone: (615) 900-0288
Email: service@ReduceMyInsurance.Net
Website: www.ReduceMyInsurance.Net

Mission: Make insurance easier by integrating modern technology to compare multiple insurance companies and find the best coverage at the lowest possible price.
We represent 80+ carriers.

Your goal is to assist clients with quotes, policy questions, and general insurance advice.
Always be polite, professional, and helpful.
If you don't know the answer, say so, and offer to have a human agent follow up.`;

// RAG Helper
const getContextFromKnowledgeBase = async (query: string): Promise<string> => {
  try {
    const articles = await dbService.getKnowledgeArticles();
    // Simple client-side search for demo purposes. In production, use vector search.
    const relevant = articles.filter(a => 
      a.title.toLowerCase().includes(query.toLowerCase()) || 
      a.content.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 3);

    if (relevant.length === 0) return "";

    return `\n\nContext from Knowledge Base:\n${relevant.map(a => `Title: ${a.title}\nContent: ${a.content}`).join('\n\n')}`;
  } catch (e) {
    console.error("KB Error", e);
    return "";
  }
};

const searchAcademyDeclaration: FunctionDeclaration = {
  name: 'searchAcademy',
  description: 'Search the agent academy knowledge base for insurance information.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'The search query.' }
    },
    required: ['query']
  }
};

export const getAIResponse = async (prompt: string, history: any[], useThinking: boolean = false, context?: string) => {
  const ai = await getAi();
  const model = 'gemini-3-pro-preview';
  
  // RAG Step: Fetch context from Firestore Knowledge Base using ONLY the prompt (user query)
  const kbContext = await getContextFromKnowledgeBase(prompt);
  
  // Inject Client Context into System Instruction if provided
  const systemInstruction = context 
    ? `${INJECTED_SYSTEM_INSTRUCTION}\n\n${context}`
    : INJECTED_SYSTEM_INSTRUCTION;

  const response = await ai.models.generateContent({
    model: model,
    contents: [...history, { role: 'user', parts: [{ text: prompt + kbContext }] }],
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: useThinking ? { thinkingBudget: 1024 } : undefined,
      tools: [{ functionDeclarations: [searchAcademyDeclaration] }]
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const researchProperty = async (address: string, occupancyType?: string, policyType?: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Research this property address for insurance underwriting data: ${address}. 
    Occupancy Type: ${occupancyType || 'Unknown'}
    Intended Policy Type: ${policyType || 'Unknown'}
    
    Return a JSON object with: 
    - yearBuilt (number)
    - sqft (number)
    - stories (number)
    - propertyType (string)
    - exteriorMaterials (string)
    - roofType (string)
    - estimatedRoofAge (number)
    - hasPool (boolean)
    - replacementCost (number)
    - fireProtectionClass (string)
    - floodZone (string)
    - numberOfBedrooms (number)
    - numberOfBathrooms (number)
    - hasMultipleKitchens (boolean)
    - hasAccessoryDwellingUnit (boolean)
    - hasDetachedStructures (boolean)
    - detachedStructureCount (number)
    - detachedStructureTypes (array of strings, e.g., ["shed", "barn", "detached garage"])
    - hasDecksOrPorches (boolean)
    - hasSolarPanels (boolean)
    - humanSummary (string: a friendly summary of the property profile for the user, e.g., "Based on public data, your home appears to be a 2-story single-family home built in 1995 with 3 bedrooms and 2 bathrooms...")`,
    config: {
      responseMimeType: 'application/json',
      tools: [{ googleSearch: {} }]
    }
  });
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {};
  }
};

export const searchIndustryCodes = async (query: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find the NAIC and SIC codes for this business type: ${query}. Return JSON with fields: naic, sic.`,
    config: {
      responseMimeType: 'application/json'
    }
  });
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

export const findLienholderAddress = async (name: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find the insurance loss payee / lienholder address for: ${name}. Return JSON with fields: address, city, state, zip.`,
    config: {
      responseMimeType: 'application/json',
      tools: [{ googleSearch: {} }]
    }
  });
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

export const decodeVin = async (vin: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Decode this VIN: ${vin}. Return JSON with: year, make, model.`,
    config: {
      responseMimeType: 'application/json'
    }
  });
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

export const checkVehicleRecalls = async (year: number, make: string, model: string, vin?: string) => {
  const ai = await getAi();
  const prompt = vin 
    ? `Check for safety recalls for VIN: ${vin}.`
    : `Check for safety recalls for a ${year} ${make} ${model}.`;
    
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${prompt} Return a JSON array of objects with fields: Component, Summary, Remedy, ReportReceivedDate.`,
    config: {
      responseMimeType: 'application/json',
      tools: [{ googleSearch: {} }]
    }
  });
  try {
    const json = JSON.parse(response.text || '[]');
    return Array.isArray(json) ? json : [];
  } catch (e) {
    return [];
  }
};

export const fetchRecallMakes = async (year: number) => {
    const ai = await getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `List common car makes for the year ${year}. Return JSON array of strings.`,
        config: { responseMimeType: 'application/json' }
    });
    try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

export const fetchRecallModels = async (year: number, make: string) => {
    const ai = await getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `List car models for ${year} ${make}. Return JSON array of strings.`,
        config: { responseMimeType: 'application/json' }
    });
    try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

export const getMarketSearchResponse = async (query: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const getMapsResponse = async (query: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }] 
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const analyzeMedia = async (prompt: string, media: { data: string, mimeType: string }) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: media.data, mimeType: media.mimeType } },
          { text: prompt }
        ]
      }
    ]
  });
  return response.text;
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: { parts: [{ text }] },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      }
    }
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generatePolicyImage = async (prompt: string, aspectRatio: string = '1:1') => {
  const ai = await getAi();
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio as any, 
        outputMimeType: 'image/jpeg'
      }
    });
    const base64 = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64}`;
  } catch (e) {
    console.error("Image Gen Error", e);
    return null;
  }
};

export const getLiteResponse = async (prompt: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: prompt
  });
  return response.text;
};

export const generateArticleContent = async (topic: string, mode: 'SEO' | 'INTERNAL', fileData?: { data: string, mimeType: string }) => {
  const ai = await getAi();
  const prompt = mode === 'SEO' 
    ? `Write an SEO-optimized blog post about "${topic}". Use markdown formatting.`
    : `Write an internal agency knowledge base article about "${topic}". Use markdown formatting.`;
    
  const parts: any[] = [{ text: prompt }];
  if (fileData) {
      parts.unshift({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { role: 'user', parts: parts }
  });
  return response.text;
};

export const analyzeInspectionPhoto = async (
  media: { data: string, mimeType: string }, 
  category: string, 
  description: string
): Promise<AIAnalysisResult | null> => {
  const ai = await getAi();
  const prompt = `Analyze this image for an insurance inspection requirement.
  Category: ${category}
  Requirement Description: ${description}

  Attempt to identify:
  - Construction and finishes (roofing, siding, flooring, countertops)
  - Systems and equipment (HVAC, plumbing, electrical)
  - Safety features (detectors, handrails, pool barriers, security)
  - Hazards and red flags (stains, mold, trip hazards, space heaters, exposed wiring, roof damage)
  - Contents of underwriting interest (wood stoves, large dogs, trampolines, high-value items)

  Return a JSON object with this structure:
  {
    "matches": boolean, // Does the photo match the category/description?
    "matchReason": string,
    "confidenceScore": number, // 0-1
    "qualityCheck": {
      "clarity": "excellent" | "good" | "acceptable" | "poor",
      "lighting": "excellent" | "good" | "acceptable" | "poor",
      "framing": "excellent" | "good" | "acceptable" | "poor"
    },
    "presentationCheck": {
      "isClean": boolean, // Is the area generally tidy?
      "clutterDetected": string[], // List of clutter items if any
      "improvementSuggestions": string[]
    },
    "conditionAssessment": {
      "overall": "excellent" | "good" | "fair" | "poor",
      "rating": number, // 1-10
      "strengths": string[],
      "concerns": string[]
    },
    "identifiedFeatures": {
      "constructionAndFinishes": ["string"],
      "systemsAndEquipment": ["string"],
      "safetyFeatures": ["string"],
      "hazardsAndRedFlags": ["string"],
      "underwritingContents": ["string"]
    },
    "followUpQuestions": ["string"], // Concise follow-up questions if hazards/features need clarification
    "inspectorNotes": string,
    "detailedSummary": string
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: media.data, mimeType: media.mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: { responseMimeType: 'application/json' }
  });

  try {
    return JSON.parse(response.text || 'null');
  } catch (e) {
    console.error("JSON Parse Error", e);
    return null;
  }
};

export const connectInspectionSession = async (pendingItems: string[], currentFocus: string, callbacks: any) => {
    const ai = await getAi();
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: `You are an AI home inspector assistant helping a user capture photos for insurance.
            Current Focus Item: ${currentFocus}.
            Pending Items: ${pendingItems.join(', ')}.
            
            Your job:
            1. Guide the user to frame the "Current Focus Item" correctly.
            2. If the user captures it (they might say "captured" or you see it clearly and they pause), confirm it.
            3. If the user is confused, explain what is needed.
            4. Be concise and professional.
            
            If you see the item clearly in the video frame, say "I see it, please hold steady" or "Capture now".
            
            CRITICAL RULES:
            - Never guarantee coverage, pricing, or policy issuance.
            - Do not give legal or engineering advice.
            - If you see a hazard, politely ask them to capture it clearly, but do not offer repair advice.
            `,
            outputAudioTranscription: {},
        },
        callbacks: {
            onopen: () => {
                if (callbacks.onOpen) callbacks.onOpen();
            },
            onmessage: callbacks.onMessage,
            onclose: callbacks.onClose,
            onerror: callbacks.onError
        }
    });
};

export const analyzeVehiclePhoto = async (
  media: { data: string, mimeType: string }, 
  category: string, 
  description: string
) => {
    // Reusing the inspection photo logic as the structure is compatible
    return analyzeInspectionPhoto(media, category, description);
};

export const extractRegistrationData = async (media: { data: string, mimeType: string }) => {
    const ai = await getAi();
    const prompt = `Extract vehicle registration details from this image. 
    Return JSON: { 
        "year": number, 
        "make": string, 
        "model": string, 
        "vin": string, 
        "plate": string, 
        "state": string, 
        "ownerFirstName": string, 
        "ownerLastName": string, 
        "address": string, 
        "city": string, 
        "zip": string 
    }`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: media.data, mimeType: media.mimeType } },
                    { text: prompt }
                ]
            }
        ],
        config: { responseMimeType: 'application/json' }
    });
    
    try {
        return JSON.parse(response.text || '{}');
    } catch {
        return {};
    }
};

export const extractPolicyData = async (media: { data: string, mimeType: string }) => {
    const ai = await getAi();
    const prompt = `Extract data from this insurance policy declaration page for a new application.
    Return JSON format:
    {
      "firstName": string,
      "lastName": string,
      "address": string,
      "city": string,
      "state": string,
      "zip": string,
      "expirationDate": string,
      "currentPremium": number,
      "carrier": string,
      "vehicles": [
        {
          "year": number,
          "make": string,
          "model": string,
          "vin": string
        }
      ],
      "drivers": [
        {
          "firstName": string,
          "lastName": string,
          "dob": string (YYYY-MM-DD if available, else blank)
        }
      ]
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: media.data, mimeType: media.mimeType } },
                    { text: prompt }
                ]
            }
        ],
        config: { responseMimeType: 'application/json' }
    });

    try {
        return JSON.parse(response.text || '{}');
    } catch {
        return {};
    }
};

export const generateBillOfSaleTerms = async (conditions: string) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a specific set of legal "Terms and Conditions" for a private party vehicle Bill of Sale based on these notes: "${conditions}". 
    Standard context: Sold AS-IS, no warranty unless specified.
    Return a single paragraph of professional legal text suitable for a contract.`,
  });
  return response.text;
};

export const generateSafetyPlanContent = async (businessName: string, industry: string, hazards: string[]) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a formal written safety plan for a business named "${businessName}" in the "${industry}" industry.
    Specific hazards to address: ${hazards.join(', ')}.
    
    Structure the response in Markdown with these sections:
    1. Management Commitment
    2. Hazard Identification
    3. Specific Safety Protocols (Addressing the hazards)
    4. Emergency Procedures
    5. Training Requirements
    
    Keep it professional, compliant with general OSHA standards, and actionable.`,
  });
  return response.text;
};

export const getBusinessCoachResponse = async (history: any[], business: { name: string, industry: string }) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: history,
    config: {
      systemInstruction: `You are an expert Business Plan Consultant. You are interviewing a user to build a business plan for:
      Business Name: ${business.name}
      Industry: ${business.industry}

      Your Goal: Gather specific, high-value details to build a robust financial and operational plan.
      
      RULES:
      1. Ask only ONE question at a time.
      2. Keep your questions short and conversational.
      3. Tailor your questions strictly to the industry "${business.industry}".
      4. Do not generate the plan yet. Just interview the user to get the data.
      `,
    }
  });
  return response.text;
};

export const generateFinalBusinessPlan = async (history: any[], business: { name: string, industry: string }) => {
  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
        ...history,
        { role: 'user', parts: [{ text: "Please generate the full, professional business plan now based on our conversation." }] }
    ],
    config: {
      systemInstruction: `You are an expert Business Strategist. 
      Create a comprehensive, professional Business Plan for "${business.name}" (${business.industry}) based on the interview history provided.
      
      Structure the output in clean Markdown with the following headers:
      # Executive Summary
      # Business Description & Mission
      # Market Analysis
      # Operational Strategy
      # Marketing & Sales Plan
      # Financial Outlook
      # Conclusion

      Tone: Professional, strategic, and investor-ready.
      `,
    }
  });
  return response.text;
};
