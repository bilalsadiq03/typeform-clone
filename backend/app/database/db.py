from uuid import uuid4
from sqlmodel import SQLModel, create_engine, Session, select, text

from app.core.config import get_settings

# Import all models before create_all()
from app.models.form import Form
from app.models.question import Question
from app.models.response import Response
from app.models.answer import Answer

settings = get_settings()

engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    # Check if table 'question' exists and has 'placeholder' column
    # If table exists but lacks 'placeholder', drop only the question table to recreate it
    with engine.connect() as conn:
        try:
            cursor = conn.execute(text("PRAGMA table_info(question)"))
            columns = [row[1] for row in cursor.fetchall()]
            if columns and "placeholder" not in columns:
                conn.execute(text("DROP TABLE question"))
                conn.commit()
        except Exception as e:
            # Table might not exist yet, which is fine
            pass

    SQLModel.metadata.create_all(engine)

    # Seed if the Form table is empty
    with Session(engine) as session:
        statement = select(Form)
        forms = session.exec(statement).all()
        if not forms:
            # Seed Product Feedback Pulse
            form1 = Form(
                title="Product Feedback Pulse",
                description="Gather quick thoughts on product experience",
                status="published",
                slug="product-feedback-pulse",
            )
            form1.questions = [
                Question(
                    type="short_text",
                    title="What should we call you?",
                    placeholder="Your name",
                    required=False,
                    order=1,
                ),
                Question(
                    type="rating",
                    title="How would you rate the new onboarding?",
                    required=True,
                    order=2,
                ),
                Question(
                    type="long_text",
                    title="What would make the experience better?",
                    placeholder="Share your feedback",
                    required=False,
                    order=3,
                ),
            ]
            session.add(form1)

            # Seed Hiring Screen
            form2 = Form(
                title="Hiring Screen",
                description="Initial candidate application details",
                status="draft",
                slug="hiring-screen",
            )
            form2.questions = [
                Question(
                    type="short_text",
                    title="Tell us your full name",
                    required=True,
                    order=1,
                ),
                Question(
                    type="email",
                    title="What email should we contact?",
                    required=True,
                    order=2,
                ),
                Question(
                    type="dropdown",
                    title="Which role are you applying for?",
                    required=False,
                    order=3,
                    options=[
                        {"id": str(uuid4()), "label": "Frontend Engineer", "value": "frontend_engineer", "order": 1},
                        {"id": str(uuid4()), "label": "Product Designer", "value": "product_designer", "order": 2},
                        {"id": str(uuid4()), "label": "Growth Lead", "value": "growth_lead", "order": 3},
                    ],
                ),
            ]
            session.add(form2)

            # Seed Event RSVP
            form3 = Form(
                title="Event RSVP",
                description="RSVP and session preference collection",
                status="published",
                slug="event-rsvp",
            )
            form3.questions = [
                Question(
                    type="yes_no",
                    title="Will you be attending in person?",
                    required=True,
                    order=1,
                ),
                Question(
                    type="multiple_choice",
                    title="Pick your session track",
                    required=False,
                    order=2,
                    options=[
                        {"id": str(uuid4()), "label": "Design Systems", "value": "design_systems", "order": 1},
                        {"id": str(uuid4()), "label": "Growth", "value": "growth", "order": 2},
                        {"id": str(uuid4()), "label": "AI Workflows", "value": "ai_workflows", "order": 3},
                    ],
                ),
                Question(
                    type="number",
                    title="How many guests are joining?",
                    placeholder="0",
                    required=False,
                    order=3,
                ),
            ]
            session.add(form3)
            session.commit()