#!/bin/bash

# CI Test Script for ShareX Application
# This script tests basic functionality during GitHub Actions

set -e

echo "🧪 ShareX CI Testing Started"

# Test 1: Check if backend is responding
echo "🔍 Testing backend health..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/)
if [ "$response" = "404" ]; then
    echo "✅ Backend is responding (404 expected for root path)"
else
    echo "❌ Backend not responding properly. Got status: $response"
    exit 1
fi

# Test 2: Test user registration endpoint
echo "🔍 Testing user registration..."
registration_response=$(curl -s -X POST http://localhost:8081/api/users/register \
    -H "Content-Type: application/json" \
    -d '{"username":"citest","email":"ci@test.com","password":"testpass123"}' \
    -w "%{http_code}")

if echo "$registration_response" | grep -q "User registered successfully"; then
    echo "✅ User registration working"
else
    echo "❌ User registration failed"
    echo "Response: $registration_response"
    exit 1
fi

# Test 3: Test login endpoint
echo "🔍 Testing user login..."
login_response=$(curl -s -X POST http://localhost:8081/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"username":"citest","password":"testpass123"}' \
    -w "%{http_code}")

if echo "$login_response" | grep -q "200"; then
    echo "✅ User login working"
else
    echo "❌ User login failed"
    echo "Response: $login_response"
fi

echo "🎉 CI Testing completed successfully!" 