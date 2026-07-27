from __future__ import annotations

import re
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.models.form import Form
from app.models.question import Question
from app.schemas.form import FormCreate, FormUpdate, VALID_FORM_STATUSES


class FormService:
    def __init__(self, session: Session):
        self.session = session

    def list_forms(self) -> list[Form]:
        statement = (
            select(Form)
            .options(selectinload(Form.questions))
            .order_by(Form.updated_at.desc())
        )
        return list(self.session.exec(statement).all())

    def create_form(self, payload: FormCreate) -> Form:
        status_value = self._validate_status(payload.status)
        form = Form(
            title=payload.title.strip(),
            description=self._normalize_optional_text(payload.description),
            status=status_value,
            slug=self._generate_unique_slug(payload.slug or payload.title),
        )
        self.session.add(form)
        self.session.commit()
        self.session.refresh(form)
        return form

    def get_form(self, form_id: UUID) -> Form:
        statement = select(Form).where(Form.id == form_id).options(selectinload(Form.questions))
        form = self.session.exec(statement).first()
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found.",
            )
        return form

    def update_form(self, form_id: UUID, payload: FormUpdate) -> Form:
        form = self.get_form(form_id)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields provided for update.",
            )

        if "title" in update_data and update_data["title"] is not None:
            form.title = update_data["title"].strip()
            form.slug = self._generate_unique_slug(form.title, exclude_form_id=form.id)

        if "description" in update_data:
            form.description = self._normalize_optional_text(update_data["description"])

        if "status" in update_data and update_data["status"] is not None:
            form.status = self._validate_status(update_data["status"])

        form.updated_at = self._timestamp()
        self.session.add(form)
        self.session.commit()
        self.session.refresh(form)
        self.session.exec(
            select(Form).where(Form.id == form.id).options(selectinload(Form.questions))
        ).first()
        return form

    def delete_form(self, form_id: UUID) -> None:
        form = self.get_form(form_id)
        self.session.delete(form)
        self.session.commit()

    def duplicate_form(self, form_id: UUID) -> Form:
        form = self.get_form(form_id)
        duplicated_form = Form(
            title=f"{form.title} (copy)",
            description=form.description,
            status="draft",
            slug=self._generate_unique_slug(f"{form.slug}-copy"),
        )

        for question in form.questions:
            duplicated_form.questions.append(
                Question(
                    type=question.type,
                    title=question.title,
                    description=question.description,
                    required=question.required,
                    order=question.order,
                )
            )

        self.session.add(duplicated_form)
        self.session.commit()
        self.session.exec(
            select(Form)
            .where(Form.id == duplicated_form.id)
            .options(selectinload(Form.questions))
        ).first()
        return duplicated_form

    def publish_form(self, form_id: UUID) -> Form:
        form = self.get_form(form_id)
        form.status = "published"
        form.updated_at = self._timestamp()
        self.session.add(form)
        self.session.commit()
        self.session.exec(
            select(Form).where(Form.id == form.id).options(selectinload(Form.questions))
        ).first()
        return form

    def _validate_status(self, status_value: str) -> str:
        normalized = status_value.strip().lower()
        if normalized not in VALID_FORM_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Expected one of: {', '.join(sorted(VALID_FORM_STATUSES))}.",
            )
        return normalized

    def _generate_unique_slug(
        self,
        source: str,
        *,
        exclude_form_id: UUID | None = None,
    ) -> str:
        base_slug = self._slugify(source)
        slug = base_slug
        suffix = 2

        while self._slug_exists(slug, exclude_form_id=exclude_form_id):
            slug = f"{base_slug}-{suffix}"
            suffix += 1

        return slug

    def _slug_exists(self, slug: str, *, exclude_form_id: UUID | None = None) -> bool:
        statement = select(Form).where(Form.slug == slug)
        form = self.session.exec(statement).first()

        if not form:
            return False

        if exclude_form_id and form.id == exclude_form_id:
            return False

        return True

    @staticmethod
    def _slugify(value: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
        if not slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to generate slug from the provided title.",
            )
        return slug

    @staticmethod
    def _normalize_optional_text(value: str | None) -> str | None:
        if value is None:
            return None

        normalized = value.strip()
        return normalized or None

    @staticmethod
    def _timestamp() -> datetime:
        return datetime.now(timezone.utc)
