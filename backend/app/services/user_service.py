from app.repositories.user_repository import UserRepository


class UserService:

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register_user(self, username: str, password: str):

        existing_user = self.user_repo.get_user_by_username(username)

        if existing_user:
            raise ValueError("Username already exists")

        return self.user_repo.create_user(username, password)

    def get_user(self, user_id: int):
        user = self.user_repo.get_user_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        return user
