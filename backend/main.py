# backend/main.py
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import anthropic
from datetime import datetime

load_dotenv() 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

client = anthropic.Anthropic()

class ChatRequest(BaseModel):
    message: str
    context: Optional[List[dict]] = []
    user_info: Optional[dict] = None
    image: Optional[str] = None

class ChatResponse(BaseModel):
    response: dict
    suggested_actions: List[str]
    timestamp: str

SYSTEM_PROMPT = """You are an AI Legal Assistant, specialized in:
1. Providing legal advice
2. Case status tracking and updates
3. Legal document and contract review
4. Court date reminders and scheduling
5. Lawyer contact and communication

Your primary features include:
- Transcription and analysis of police encounters
- Sending transcriptions to trusted contacts
- Reviewing and summarizing legal documents

Provide concise, accurate legal information. If relevant, include:
- Actionable legal advice
- Important deadlines
- Safety considerations in legal situations
- Clear next steps for legal processes
"""

@app.post("/chat")
async def chat(request: ChatRequest):
    try:   
        messages = []
        
        # Add context if available
        if request.context:
            messages = request.context
            
        # If image is provided, create a message with image
        if request.image:
            print(request.image)
            messages.append({
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": request.image
                        }
                    },
                    {
                        "type": "text",
                        "text": request.message
                    }
                ]
            })
        else:
            # Regular text message
            messages.append({
                "role": "user", 
                "content": request.message
            })
        
        # Get response from Claude
        response = client.messages.create(
            system=SYSTEM_PROMPT,
            model="claude-3-sonnet-20240229",
            max_tokens=1024,
            messages=messages
        )
        
        suggested_actions = [
            "Get free legal advice",
            "Check eligibility for legal aid",
            "Find a legal aid clinic",
            "Connect with a pro bono lawyer",
            "Review legal documents",
            "Understand your legal rights",
            "Prepare for a court date",
            "Access legal forms and resources"
        ]
        
        return ChatResponse(
            response={
                "text": response.content[0].text,
                "type": "text",
            },
            suggested_actions=suggested_actions,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": str(e), "message": "Failed to process request"}
        )
    
    
@app.get("/")
def root():
    return {"message": "Hello Wizzorld."}