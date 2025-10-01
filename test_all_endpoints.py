#!/usr/bin/env python3
"""
Complete API Endpoint Test Suite for HARV Backend
Tests all 33+ endpoints with proper authentication
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@harv.com"
ADMIN_PASSWORD = "admin123"

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

class APITester:
    def __init__(self):
        self.access_token = None
        self.user_id = None
        self.test_conversation_id = None
        self.passed = 0
        self.failed = 0
        self.skipped = 0

    def log(self, status, endpoint, message=""):
        if status == "PASS":
            print(f"{GREEN}✓ PASS{RESET} {endpoint} {message}")
            self.passed += 1
        elif status == "FAIL":
            print(f"{RED}✗ FAIL{RESET} {endpoint} {message}")
            self.failed += 1
        elif status == "SKIP":
            print(f"{YELLOW}⊘ SKIP{RESET} {endpoint} {message}")
            self.skipped += 1
        elif status == "INFO":
            print(f"{BLUE}ℹ INFO{RESET} {endpoint} {message}")

    def headers(self, auth=True):
        h = {"Content-Type": "application/json"}
        if auth and self.access_token:
            h["Authorization"] = f"Bearer {self.access_token}"
        return h

    def test_endpoint(self, method, endpoint, expected_status=200, auth=True, data=None, description=""):
        """Generic endpoint tester"""
        url = f"{BASE_URL}{endpoint}"
        try:
            if method == "GET":
                response = requests.get(url, headers=self.headers(auth))
            elif method == "POST":
                response = requests.post(url, headers=self.headers(auth), json=data)
            elif method == "PUT":
                response = requests.put(url, headers=self.headers(auth), json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=self.headers(auth))

            if response.status_code == expected_status:
                self.log("PASS", f"{method:6} {endpoint}", f"→ {response.status_code} {description}")
                return response.json() if response.content else None
            else:
                self.log("FAIL", f"{method:6} {endpoint}", f"→ {response.status_code} (expected {expected_status}) {description}")
                return None
        except Exception as e:
            self.log("FAIL", f"{method:6} {endpoint}", f"→ Exception: {str(e)}")
            return None

    def run_all_tests(self):
        print(f"\n{BLUE}{'='*80}{RESET}")
        print(f"{BLUE}HARV Backend API Test Suite{RESET}")
        print(f"{BLUE}Testing {BASE_URL}{RESET}")
        print(f"{BLUE}Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
        print(f"{BLUE}{'='*80}{RESET}\n")

        # ===== SYSTEM ENDPOINTS =====
        print(f"\n{BLUE}[1] SYSTEM ENDPOINTS{RESET}")
        self.test_endpoint("GET", "/", expected_status=200, auth=False, description="Root endpoint")
        self.test_endpoint("GET", "/health", expected_status=200, auth=False, description="Health check")
        self.test_endpoint("GET", "/system/status", expected_status=200, auth=False, description="System status")

        # ===== AUTHENTICATION ENDPOINTS =====
        print(f"\n{BLUE}[2] AUTHENTICATION ENDPOINTS{RESET}")

        # Login
        login_data = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = self.test_endpoint("POST", "/auth/login", expected_status=200, auth=False,
                                     data=login_data, description="Admin login")
        if response:
            self.access_token = response.get("access_token")
            self.user_id = response.get("user_id")
            self.log("INFO", "      Token", f"Saved access token for user {self.user_id}")
            self.log("INFO", "      Admin", f"is_admin = {response.get('user', {}).get('is_admin')}")
        else:
            self.log("FAIL", "      Token", "Failed to get access token - remaining tests will fail")
            return

        # Register (will fail if user exists, that's ok)
        register_data = {
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "password": "testpass123",
            "name": "Test User",
            "reason": "Testing",
            "familiarity": "beginner",
            "learning_style": "visual",
            "goals": "Learn testing",
            "background": "QA"
        }
        self.test_endpoint("POST", "/auth/register", expected_status=200, auth=False,
                          data=register_data, description="New user registration")

        # ===== MODULE ENDPOINTS =====
        print(f"\n{BLUE}[3] MODULE ENDPOINTS{RESET}")

        # Get all modules
        modules = self.test_endpoint("GET", "/modules", description="Get all modules")

        # Get specific module
        self.test_endpoint("GET", "/modules/1", description="Get module by ID")

        # Update module
        update_data = {
            "title": "Updated Module Title",
            "description": "Updated description",
            "learning_objectives": "Updated objectives",
            "resources": "Updated resources",
            "system_prompt": "Updated system prompt",
            "module_prompt": "Updated module prompt",
            "system_corpus": "Updated system corpus",
            "module_corpus": "Updated module corpus"
        }
        self.test_endpoint("PUT", "/modules/1", data=update_data, description="Update module")

        # Create module (optional - creates new module)
        create_module_data = {
            "title": f"Test Module {datetime.now().timestamp()}",
            "description": "Test description",
            "learning_objectives": "Test objectives",
            "resources": "Test resources",
            "system_prompt": "Test system prompt",
            "module_prompt": "Test module prompt",
            "system_corpus": "Test corpus",
            "module_corpus": "Test module corpus"
        }
        # Skipping create to avoid cluttering database
        # self.test_endpoint("POST", "/modules", data=create_module_data, description="Create new module")

        # ===== ANALYTICS ENDPOINTS =====
        print(f"\n{BLUE}[4] ANALYTICS ENDPOINTS{RESET}")

        self.test_endpoint("GET", "/analytics/dashboard", description="Dashboard analytics")
        self.test_endpoint("GET", "/analytics/modules/performance", description="Module performance")
        self.test_endpoint("GET", "/analytics/alerts", description="Analytics alerts")
        self.test_endpoint("GET", "/analytics/modules/1", description="Module 1 analytics")

        # Student analytics (if user exists)
        if self.user_id:
            self.test_endpoint("GET", f"/analytics/students/{self.user_id}", description="Student analytics")

        # ===== CONVERSATION ENDPOINTS =====
        print(f"\n{BLUE}[5] CONVERSATION ENDPOINTS{RESET}")

        self.test_endpoint("GET", "/conversations", description="Get all conversations")
        self.test_endpoint("GET", "/conversations?user_id=1", description="Get conversations by user")
        self.test_endpoint("GET", "/conversations?module_id=1", description="Get conversations by module")
        self.test_endpoint("GET", "/conversations?limit=10&offset=0", description="Get conversations with pagination")

        # Get specific conversation (might fail if no conversations exist)
        conversations = self.test_endpoint("GET", "/conversations?limit=1", description="Get one conversation for testing")
        if conversations and conversations.get("conversations") and len(conversations["conversations"]) > 0:
            conv_id = conversations["conversations"][0]["id"]
            self.test_endpoint("GET", f"/conversations/{conv_id}", description="Get conversation by ID")

        # ===== CHAT ENDPOINTS =====
        print(f"\n{BLUE}[6] CHAT ENDPOINTS{RESET}")

        # Enhanced chat endpoint
        chat_data = {
            "user_id": self.user_id,
            "module_id": 1,
            "message": "What is communication theory?",
            "conversation_id": None
        }
        chat_response = self.test_endpoint("POST", "/chat/enhanced", data=chat_data,
                                          description="Send chat message (enhanced)")
        if chat_response:
            self.test_conversation_id = chat_response.get("conversation_id")
            self.log("INFO", "      Chat", f"Created conversation {self.test_conversation_id}")

        # Continue conversation
        if self.test_conversation_id:
            chat_data_2 = {
                "user_id": self.user_id,
                "module_id": 1,
                "message": "Can you explain more?",
                "conversation_id": self.test_conversation_id
            }
            self.test_endpoint("POST", "/chat/enhanced", data=chat_data_2,
                             description="Continue conversation")

        # ===== CORPUS ENDPOINTS =====
        print(f"\n{BLUE}[7] CORPUS ENDPOINTS{RESET}")

        # Course corpus
        self.test_endpoint("GET", "/course-corpus", description="Get course corpus")

        # Module corpus
        self.test_endpoint("GET", "/modules/1/corpus", description="Get module corpus entries")

        # Corpus types
        self.test_endpoint("GET", "/corpus/types", description="Get corpus types")

        # Create course corpus entry (optional)
        # corpus_data = {
        #     "title": "Test Corpus Entry",
        #     "content": "Test content",
        #     "corpus_type": "definition"
        # }
        # self.test_endpoint("POST", "/course-corpus", data=corpus_data, description="Create corpus entry")

        # ===== DOCUMENT ENDPOINTS =====
        print(f"\n{BLUE}[8] DOCUMENT ENDPOINTS{RESET}")

        self.test_endpoint("GET", "/documents", description="Get all documents")
        self.test_endpoint("GET", "/documents?module_id=1", description="Get documents by module")

        # Upload document
        try:
            import io
            # Create a test text file
            test_file_content = b"This is a test document for HARV system testing."
            files = {'file': ('test_document.txt', io.BytesIO(test_file_content), 'text/plain')}
            url = f"{BASE_URL}/documents/upload"
            response = requests.post(url, headers={'Authorization': f'Bearer {self.access_token}'}, files=files)
            if response.status_code == 200:
                self.log("PASS", "POST   /documents/upload", f"→ {response.status_code} Upload test document")
            else:
                self.log("FAIL", "POST   /documents/upload", f"→ {response.status_code} (expected 200) Upload test document")
        except Exception as e:
            self.log("FAIL", "POST   /documents/upload", f"→ Exception: {str(e)}")

        # ===== MEMORY ENDPOINTS =====
        print(f"\n{BLUE}[9] MEMORY ENDPOINTS{RESET}")

        if self.user_id:
            self.test_endpoint("GET", f"/memory/{self.user_id}", description="Get memory summaries for user")
            self.test_endpoint("GET", f"/memory/{self.user_id}?module_id=1", description="Get memory summaries by module")

        # ===== PROGRESS ENDPOINTS =====
        print(f"\n{BLUE}[10] PROGRESS ENDPOINTS{RESET}")

        if self.user_id:
            self.test_endpoint("GET", f"/progress/{self.user_id}", description="Get user progress")

        # ===== SUMMARY =====
        print(f"\n{BLUE}{'='*80}{RESET}")
        print(f"{BLUE}TEST SUMMARY{RESET}")
        print(f"{GREEN}Passed:  {self.passed}{RESET}")
        print(f"{RED}Failed:  {self.failed}{RESET}")
        print(f"{YELLOW}Skipped: {self.skipped}{RESET}")
        print(f"{BLUE}Total:   {self.passed + self.failed + self.skipped}{RESET}")
        print(f"{BLUE}{'='*80}{RESET}\n")

        if self.failed == 0:
            print(f"{GREEN}🎉 ALL TESTS PASSED!{RESET}\n")
        else:
            print(f"{RED}⚠️  {self.failed} TEST(S) FAILED{RESET}\n")

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()
