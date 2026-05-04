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
