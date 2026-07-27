from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Column, String
from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from app.models.question import Question


class FormBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: str = Field(
        default="draft",
        sa_column=Column(String, nullable=False),
    )
    slug: str = Field(
        min_length=1,
        max_length=255,
        sa_column=Column(String, unique=True, index=True, nullable=False),
    )


class Form(FormBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    questions: list["Question"] = Relationship(
        back_populates="form",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "order_by": "Question.order",
        },
    )
