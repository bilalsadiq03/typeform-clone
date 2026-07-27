from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session

from app.database.session import get_session
from app.schemas.form import FormCreate, FormRead, FormUpdate
from app.services.form_service import FormService


router = APIRouter(prefix="/forms", tags=["forms"])


def get_form_service(session: Session = Depends(get_session)) -> FormService:
    return FormService(session)


@router.get("", response_model=list[FormRead])
def list_forms(service: FormService = Depends(get_form_service)) -> list[FormRead]:
    return service.list_forms()


@router.post("", response_model=FormRead, status_code=status.HTTP_201_CREATED)
def create_form(
    payload: FormCreate,
    service: FormService = Depends(get_form_service),
) -> FormRead:
    return service.create_form(payload)


@router.get("/{form_id}", response_model=FormRead)
def get_form(
    form_id: UUID,
    service: FormService = Depends(get_form_service),
) -> FormRead:
    return service.get_form(form_id)


@router.patch("/{form_id}", response_model=FormRead)
def update_form(
    form_id: UUID,
    payload: FormUpdate,
    service: FormService = Depends(get_form_service),
) -> FormRead:
    return service.update_form(form_id, payload)


@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(
    form_id: UUID,
    service: FormService = Depends(get_form_service),
) -> Response:
    service.delete_form(form_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{form_id}/duplicate", response_model=FormRead, status_code=status.HTTP_201_CREATED)
def duplicate_form(
    form_id: UUID,
    service: FormService = Depends(get_form_service),
) -> FormRead:
    return service.duplicate_form(form_id)


@router.post("/{form_id}/publish", response_model=FormRead)
def publish_form(
    form_id: UUID,
    service: FormService = Depends(get_form_service),
) -> FormRead:
    return service.publish_form(form_id)
