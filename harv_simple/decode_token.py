#!/usr/bin/env python3
"""Decode a JWT token to see what's inside"""
import sys
from jose import jwt

SECRET_KEY = "your-secret-key-change-in-production-min-32-characters"
ALGORITHM = "HS256"

if len(sys.argv) < 2:
    print("Usage: python3 decode_token.py <token>")
    sys.exit(1)

token = sys.argv[1]

try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print("Token decoded successfully!")
    print(f"Payload: {payload}")
    print(f"User ID (sub): {payload.get('sub')}")
    print(f"Type of sub: {type(payload.get('sub'))}")
except Exception as e:
    print(f"Error decoding token: {e}")
