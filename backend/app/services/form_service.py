from __future__ import annotations

import re
from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.models.form import Form
from app.models.question import Question
from app.schemas.form import FormCreate, FormRead, FormUpdate, VALID_FORM_STATUSES


class FormService:
    def __init__(self, session: Session):
        self.session = session

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load_form(self, form_id: UUID) -> Form:
        """Fetch a single Form with questions and responses eagerly loaded."""
        statement = (
            select(Form)
            .where(Form.id == form_id)
            .options(
                selectinload(Form.questions),
                selectinload(Form.responses),
            )
        )
        form = self.session.exec(statement).first()
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found.",
            )
        return form

    @staticmethod
    def _to_read(form: Form) -> FormRead:
        """Serialize an ORM Form into a FormRead schema, populating response_count."""
        return FormRead.model_validate(
            {
                "id": form.id,
                "title": form.title,
                "description": form.description,
                "status": form.status,
                "slug": form.slug,
                "created_at": form.created_at,
                "updated_at": form.updated_at,
                "questions": form.questions,
                "response_count": len(form.responses),
            }
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def list_forms(self) -> list[FormRead]:
        statement = (
            select(Form)
            .options(
                selectinload(Form.questions),
                selectinload(Form.responses),
            )
            .order_by(Form.updated_at.desc())
        )
        forms = list(self.session.exec(statement).all())
        return [self._to_read(f) for f in forms]

    def create_form(self, payload: FormCreate) -> FormRead:
        status_value = self._validate_status(payload.status)
        form = Form(
            title=payload.title.strip(),
            description=self._normalize_optional_text(payload.description),
            status=status_value,
            slug=self._generate_unique_slug(payload.slug or payload.title),
        )
        self.session.add(form)
        self.session.commit()
        form = self._load_form(form.id)
        return self._to_read(form)

    def get_form(self, form_id: UUID) -> FormRead:
        form = self._load_form(form_id)
        return self._to_read(form)

    def update_form(self, form_id: UUID, payload: FormUpdate) -> FormRead:
        form = self._load_form(form_id)
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

        if "questions" in update_data and update_data["questions"] is not None:
            form.questions.clear()
            for q_data in update_data["questions"]:
                question = Question(
                    id=q_data.get("id") or uuid4(),
                    form_id=form.id,
                    type=q_data["type"],
                    title=q_data["title"],
                    description=q_data.get("description"),
                    required=q_data.get("required", False),
                    order=q_data["order"],
                    placeholder=q_data.get("placeholder"),
                    options=q_data.get("options") or [],
                )
                form.questions.append(question)

        form.updated_at = self._timestamp()
        self.session.add(form)
        self.session.commit()
        form = self._load_form(form.id)
        return self._to_read(form)

    def delete_form(self, form_id: UUID) -> None:
        form = self._load_form(form_id)
        self.session.delete(form)
        self.session.commit()

    def duplicate_form(self, form_id: UUID) -> FormRead:
        original = self._load_form(form_id)
        duplicated_form = Form(
            title=f"{original.title} (copy)",
            description=original.description,
            status="draft",
            slug=self._generate_unique_slug(f"{original.slug}-copy"),
        )

        for question in original.questions:
            duplicated_form.questions.append(
                Question(
                    type=question.type,
                    title=question.title,
                    description=question.description,
                    required=question.required,
                    order=question.order,
                    placeholder=question.placeholder,
                    options=question.options,
                )
            )

        self.session.add(duplicated_form)
        self.session.commit()
        duplicated_form = self._load_form(duplicated_form.id)
        return self._to_read(duplicated_form)

    def publish_form(self, form_id: UUID) -> FormRead:
        form = self._load_form(form_id)
        form.status = "published"
        form.updated_at = self._timestamp()
        self.session.add(form)
        self.session.commit()
        form = self._load_form(form.id)
        return self._to_read(form)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

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
