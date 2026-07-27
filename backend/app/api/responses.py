from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database.session import get_session
from app.schemas.response import ResponseCreate, ResponseRead
from app.services.response_service import ResponseService

router = APIRouter(prefix="/responses", tags=["responses"])


def get_service(session: Session = Depends(get_session)):
    return ResponseService(session)


@router.post("", response_model=ResponseRead)
def submit(
    payload: ResponseCreate,
    service: ResponseService = Depends(get_service),
):
    return service.submit_response(payload)


@router.get("/{form_id}", response_model=list[ResponseRead])
def list_responses(
    form_id: UUID,
    service: ResponseService = Depends(get_service),
):
    return service.get_responses(form_id)