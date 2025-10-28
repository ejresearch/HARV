#!/usr/bin/env python3
"""Test authentication flow"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("Testing Harv Simple Authentication")
print("=" * 60)

# Test 1: Health check
print("\n1. Health Check...")
try:
    r = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {r.status_code}")
    print(f"   Response: {r.json()}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 2: Login
print("\n2. Login...")
try:
    r = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@harv.com", "password": "admin123"}
    )
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        token = data["access_token"]
        user = data["user"]
        print(f"   User: {user['name']} ({user['email']})")
        print(f"   Token: {token[:50]}...")
    else:
        print(f"   ERROR: {r.json()}")
        exit(1)
except Exception as e:
    print(f"   ERROR: {e}")
    exit(1)

# Test 3: Get modules with token
print("\n3. Get Modules (with auth)...")
try:
    r = requests.get(
        f"{BASE_URL}/modules",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        modules = r.json()
        print(f"   Found {len(modules)} modules:")
        for m in modules:
            print(f"     - {m['title']}")
    else:
        print(f"   ERROR: {r.status_code} - {r.text}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 4: Get auth/me
print("\n4. Get Current User (/auth/me)...")
try:
    r = requests.get(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        print(f"   User: {r.json()}")
    else:
        print(f"   ERROR: {r.status_code} - {r.text}")
except Exception as e:
    print(f"   ERROR: {e}")

print("\n" + "=" * 60)
print("Tests complete!")
print("=" * 60)
