from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from app.models.form import Form


class QuestionBase(SQLModel):
    type: str
    title: str
    description: str | None = None
    required: bool = False
    order: int = Field(default=1, ge=1)


class Question(QuestionBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    form_id: UUID = Field(foreign_key="form.id", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    form: "Form" = Relationship(back_populates="questions")
