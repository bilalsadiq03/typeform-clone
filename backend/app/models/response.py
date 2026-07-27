from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4
from app.models.form import Form

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.answer import Answer
    from app.models.form import Form


class Response(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    form_id: UUID = Field(foreign_key="form.id", index=True)
    form: "Form" = Relationship(back_populates="responses")
    submitted_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    answers: list["Answer"] = Relationship(
        back_populates="response",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
        },
    )