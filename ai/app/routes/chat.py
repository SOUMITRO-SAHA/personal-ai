from fastapi import APIRouter
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from app.services.ai import AIService
from app.models.request import PromptRequest
# from app.database.chat import ChatSession, ChatMessage

# Initializing Router
router = APIRouter()


# TODO: Implementation is Pending


@router.get("/ct")
async def testing():
    return {"success": True, "message": "Welcome to LSP-AI"}


@router.post("/generate")
async def generate(request: "PromptRequest"):
    try:
        # Streaming generator function for chain output
        async def generate_response() -> StreamingResponse:
            async for part in AIService.generate_ai_response(
                    messages=request.messages,
                    model=request.model,
                    api_key=request.api_key
            ):
                yield part

        return StreamingResponse(generate_response(), media_type="application/json")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

# @router.get("/chat/sessions")
# def get_chat_sessions(chat_session_id: int, archived: bool = False, favorite: bool = False) -> List[ChatSession]:
#     """
#     Fetch all chat sessions for a user, optionally filtering by archived or favorite status.
#     """
#     pass
#
# @router.get("/chat/sessions/{session_id}")
# def get_conversation(session_id: int) -> List[ChatMessage]:
#     """
#     Fetch all chat messages for a given session.
#     """
#     pass
