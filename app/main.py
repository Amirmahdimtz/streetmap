from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi_swagger import patch_fastapi

from api import auth_routes, question_routes, answer_routes, location_routes


tags_metadata = [
    {"name": "auth", "description": "Authentication operations"},
    {"name": "questions", "description": "Questions management"},
    {"name": "answers", "description": "Answers for questions"},
    {"name": "locations", "description": "User locations"}
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup")
    yield
    print("Application shutdown")


# ⛔ نکته بسیار مهم:
# docs_url=None  ✔
# redoc_url=None ✔
app = FastAPI(
    lifespan=lifespan,
    docs_url=None,           # باید خاموش باشد
    redoc_url=None,          # باید خاموش باشد
    openapi_tags=tags_metadata,
    title="Street Map API",
    description="API for managing questions, answers and locations",
    version="0.0.1"
)

# 🔥 fastapi-swagger باید بعد از ساخت app پچ شود
patch_fastapi(app)


app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(question_routes.router,
                   prefix="/questions", tags=["questions"])
app.include_router(answer_routes.router, prefix="/answers", tags=["answers"])
app.include_router(location_routes.router,
                   prefix="/locations", tags=["locations"])
