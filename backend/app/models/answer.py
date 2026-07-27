from uuid import UUID, uuid4

# pyrefly: ignore [missing-import]
from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.response import Response


class Answer(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    response_id: UUID = Field(
        foreign_key="response.id",
        index=True,
    )

    question_id: UUID

    value: str

    response: "Response" = Relationship(back_populates="answers")