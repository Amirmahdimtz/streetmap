from app.db.database import engine
from app.db.models import Base


def init_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


if __name__ == "__main__":
    init_database()
