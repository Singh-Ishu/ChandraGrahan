import json
import hashlib
import secrets
import os
from datetime import datetime, timedelta
from pathlib import Path

class AuthManager:
    def __init__(self):
        self.users_file = Path("data/users.json")
        self.tokens_file = Path("data/tokens.json")
        self.secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
        
        # Create data directory if it doesn't exist
        self.users_file.parent.mkdir(exist_ok=True)
        
        # Initialize files if they don't exist
        self._initialize_files()

    def _initialize_files(self):
        """Initialize user and token files if they don't exist"""
        if not self.users_file.exists():
            with open(self.users_file, 'w') as f:
                json.dump({}, f)
        
        if not self.tokens_file.exists():
            with open(self.tokens_file, 'w') as f:
                json.dump({}, f)

    def _load_users(self):
        """Load users from file"""
        try:
            with open(self.users_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _save_users(self, users):
        """Save users to file"""
        with open(self.users_file, 'w') as f:
            json.dump(users, f, indent=2)

    def _load_tokens(self):
        """Load tokens from file"""
        try:
            with open(self.tokens_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _save_tokens(self, tokens):
        """Save tokens to file"""
        with open(self.tokens_file, 'w') as f:
            json.dump(tokens, f, indent=2)

    def _hash_password(self, password):
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()

    def _generate_token(self):
        """Generate a secure random token"""
        return secrets.token_urlsafe(32)

    def register_user(self, email, password, name):
        """Register a new user"""
        try:
            users = self._load_users()
            
            # Check if user already exists
            if email in users:
                return {"success": False, "error": "User already exists"}
            
            # Validate input
            if len(password) < 6:
                return {"success": False, "error": "Password must be at least 6 characters"}
            
            if not email or '@' not in email:
                return {"success": False, "error": "Invalid email address"}
            
            # Create new user
            user_id = str(len(users) + 1)
            hashed_password = self._hash_password(password)
            
            user_data = {
                "id": user_id,
                "email": email,
                "name": name,
                "password": hashed_password,
                "created_at": datetime.now().isoformat(),
                "last_login": None
            }
            
            users[email] = user_data
            self._save_users(users)
            
            # Remove password from response
            user_response = {k: v for k, v in user_data.items() if k != 'password'}
            
            return {"success": True, "user": user_response}
            
        except Exception as e:
            return {"success": False, "error": f"Registration failed: {str(e)}"}

    def login_user(self, email, password):
        """Login user and return token"""
        try:
            users = self._load_users()
            
            # Check if user exists
            if email not in users:
                return {"success": False, "error": "Invalid email or password"}
            
            user = users[email]
            hashed_password = self._hash_password(password)
            
            # Verify password
            if user["password"] != hashed_password:
                return {"success": False, "error": "Invalid email or password"}
            
            # Generate token
            token = self._generate_token()
            
            # Save token
            tokens = self._load_tokens()
            tokens[token] = {
                "user_id": user["id"],
                "email": email,
                "created_at": datetime.now().isoformat(),
                "expires_at": (datetime.now() + timedelta(days=7)).isoformat()
            }
            self._save_tokens(tokens)
            
            # Update last login
            user["last_login"] = datetime.now().isoformat()
            users[email] = user
            self._save_users(users)
            
            # Remove password from response
            user_response = {k: v for k, v in user.items() if k != 'password'}
            
            return {
                "success": True, 
                "token": token, 
                "user": user_response
            }
            
        except Exception as e:
            return {"success": False, "error": f"Login failed: {str(e)}"}

    def verify_token(self, token):
        """Verify token and return user data"""
        try:
            tokens = self._load_tokens()
            
            if token not in tokens:
                return None
            
            token_data = tokens[token]
            
            # Check if token is expired
            expires_at = datetime.fromisoformat(token_data["expires_at"])
            if datetime.now() > expires_at:
                # Remove expired token
                del tokens[token]
                self._save_tokens(tokens)
                return None
            
            # Get user data
            users = self._load_users()
            user_email = token_data["email"]
            
            if user_email not in users:
                return None
            
            user = users[user_email]
            # Remove password from response
            user_response = {k: v for k, v in user.items() if k != 'password'}
            
            return user_response
            
        except Exception as e:
            print(f"Token verification error: {e}")
            return None

    def logout_user(self, token):
        """Logout user by removing token"""
        try:
            tokens = self._load_tokens()
            if token in tokens:
                del tokens[token]
                self._save_tokens(tokens)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            users = self._load_users()
            for user in users.values():
                if user["id"] == user_id:
                    user_response = {k: v for k, v in user.items() if k != 'password'}
                    return user_response
            return None
        except Exception as e:
            print(f"Get user error: {e}")
            return None
