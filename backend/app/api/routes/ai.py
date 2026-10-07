from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.assistant import ask_assistant
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.ai import AIChatRequest, AIChatResponse


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"],
)


@router.post(
    "/chat",
    response_model=AIChatResponse,
)
async def chat(
    request: AIChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        response = await ask_assistant(
            db=db,
            user_id=current_user.id,
            message=request.message,
            context=request.context or "",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"AI assistant unavailable: {exc}",
        )

    return AIChatResponse(response=response)
