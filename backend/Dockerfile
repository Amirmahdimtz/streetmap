FROM python:3.11-slim

WORKDIR /app

# نصب وابستگی‌ها
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# کپی کدها
COPY ./app /app/app
COPY init_db.py .

# ایجاد دیتابیس در زمان build
RUN python init_db.py

# اجرای FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]