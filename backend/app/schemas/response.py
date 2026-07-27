from uuid import UUID

from pydantic import BaseModel


class AnswerCreate(BaseModel):
    question_id: UUID
    value: str


class ResponseCreate(BaseModel):
    form_id: UUID
    answers: list[AnswerCreate]


class AnswerRead(BaseModel):
    id: UUID
    question_id: UUID
    value: str

    class Config:
        from_attributes = True


class ResponseRead(BaseModel):
    id: UUID
    form_id: UUID
    answers: list[AnswerRead]

    class Config:
        from_attributes = True