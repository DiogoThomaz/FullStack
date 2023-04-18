import datetime

class CacheMananger:
    def __init__(self):
        self.cache = {}

    def add_to_cache(self, email: str, token: str):
        self.cache[email] = token

    def clear_cache(self):
        self.cache = {}

    def get_token(self, email: str):
        return self.cache.get(email, None)

    def update_cache(self, email: str, token: str):
        self.add_to_cache(email, token)

