from pydantic import BaseModel, Field, ConfigDict


class QuestionResponse(BaseModel):
    id: int
    text: str

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "text": "What is your favorite color?"
            }
        }
    )


class AnswerCreate(BaseModel):
    question_id: int = Field(..., description="ID of the question")
    value: str = Field(..., description="User answer")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "question_id": 1,
                "value": "Blue"
            }
        }
    )
