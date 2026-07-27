from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


VALID_FORM_STATUSES = {"draft", "published"}


class QuestionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    form_id: UUID
    type: str
    title: str
    description: str | None = None
    required: bool
    order: int


class FormCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: str = Field(default="draft")
    slug: str | None = Field(default=None, min_length=1, max_length=255)


class FormUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: str | None = None


class FormRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str | None = None
    status: str
    slug: str
    created_at: datetime
    updated_at: datetime
    questions: list[QuestionRead] = Field(default_factory=list)
