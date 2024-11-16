import { Checklist } from '@/utils/types';
import axios from 'axios';
import FormData from 'form-data';
import { ChecklistSchema } from '../utils/checklist-helpers';

//**TODO: add to heroku backend to prevent api key being sent client side*/
// openaik3y here (removed due to github restriction)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_AUDIO_URL = 'https://api.openai.com/v1/audio/transcriptions';



export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    // Create form data
    const formData = new FormData();

    // Add the audio file
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    });

    // Add model parameter
    formData.append('model', 'whisper-1');

    // Make the API request
    const response = await axios.post(OPENAI_API_AUDIO_URL, formData, {
      headers: {
        'Authorization': `Bearer ${  0P3n ai k}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};


export const generateLegalChecklist = async (transcription: string): Promise<Checklist> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4-turbo-preview", // Updated model name
        messages: [
          {
            role: "system",
            content: "You are a legal assistant. Analyze the provided text and create a structured checklist of legal actions or considerations."
          },
          {
            role: "user",
            content: transcription
          }
        ],
        functions: [{ // Using functions instead of response_format
          name: "generate_checklist",
          description: "Generate a legal checklist based on the provided text",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    priority: {
                      type: "string",
                      enum: ["high", "medium", "low"]
                    },
                    timeframe: {
                      type: "string",
                      enum: ["immediate", "within_week", "within_month"]
                    },
                    category: {
                      type: "string",
                      enum: ["documentation", "consultation", "filing", "action"]
                    }
                  },
                  required: ["id", "title", "description", "priority", "timeframe", "category"]
                }
              },
              summary: { type: "string" }
            },
            required: ["items", "summary"]
          }
        }],
        function_call: { name: "generate_checklist" },
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the function call result from the response
    const functionCall = response.data.choices[0].message.function_call;
    const res = JSON.parse(functionCall.arguments);

    // Validate response with Zod schema
    const parsedResponse = ChecklistSchema.parse(res);
    return parsedResponse;

  } catch (error) {
    console.error('Error generating legal checklist:', error);
    if (axios.isAxiosError(error)) {
      console.error('🌐 Axios error details:', {
        data: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message
      });
    }
    throw error;
  }
};
