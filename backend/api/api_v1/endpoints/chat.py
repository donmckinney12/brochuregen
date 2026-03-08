"""AI Chat Assistant endpoint for conversational brochure help."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()


class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None  # optional brochure context


@router.post("/message")
async def chat_message(
    request: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    """Send a message to the AI assistant and get a contextual response."""
    system_prompt = """You are BrochureGen AI, an expert assistant for creating professional brochures.
You help users with:
- Generating and refining brochure content
- Choosing design themes and tones
- Marketing copy suggestions
- Best practices for brochure design
- Technical questions about the platform

Be concise, helpful, and professional. Use markdown formatting when helpful."""

    user_message = request.message
    if request.context:
        user_message = f"Context: {request.context}\n\nUser: {request.message}"

    try:
        response = ai_service.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        reply = response.choices[0].message.content

        return {
            "reply": reply,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")
