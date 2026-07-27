from sqlmodel import Session, select

from app.models.answer import Answer
from app.models.response import Response
from app.schemas.response import ResponseCreate


class ResponseService:
    def __init__(self, session: Session):
        self.session = session

    def submit_response(self, payload: ResponseCreate):
        response = Response(form_id=payload.form_id)

        self.session.add(response)
        self.session.commit()
        self.session.refresh(response)

        for answer in payload.answers:
            self.session.add(
                Answer(
                    response_id=response.id,
                    question_id=answer.question_id,
                    value=answer.value,
                )
            )

        self.session.commit()
        self.session.refresh(response)

        return response

    def get_responses(self, form_id):
        statement = select(Response).where(Response.form_id == form_id)
        return list(self.session.exec(statement).all())