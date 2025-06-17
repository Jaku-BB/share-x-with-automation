#!/bin/bash

# Quality Check Script for ShareX project
# This script runs all quality checks for both frontend and backend

set -e  # Exit on any error

echo "🔍 ShareX Quality Check Script"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "This script must be run from the project root directory!"
    exit 1
fi

# Frontend checks
echo
print_status "🎨 Running frontend checks..."
cd client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

print_status "Running Biome checks..."
if npm run check:ci; then
    print_success "Biome checks passed!"
else
    print_error "Biome checks failed!"
    exit 1
fi

print_status "Running TypeScript type check..."
if npm run type-check; then
    print_success "TypeScript check passed!"
else
    print_error "TypeScript check failed!"
    exit 1
fi

print_status "Running frontend tests..."
if npm run test -- --coverage --watchAll=false; then
    print_success "Frontend tests passed!"
else
    print_error "Frontend tests failed!"
    exit 1
fi

print_status "Running build test..."
if npm run build; then
    print_success "Frontend build successful!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# Backend checks
echo
print_status "☕ Running backend checks..."
cd server

print_status "Running Java tests..."
if mvn test; then
    print_success "Backend tests passed!"
else
    print_error "Backend tests failed!"
    exit 1
fi

print_status "Running Checkstyle..."
if mvn checkstyle:check; then
    print_success "Checkstyle checks passed!"
else
    print_warning "Checkstyle issues found. Check target/checkstyle-result.xml"
fi

print_status "Running SpotBugs..."
if mvn spotbugs:check; then
    print_success "SpotBugs analysis passed!"
else
    print_warning "SpotBugs issues found. Check target/spotbugsXml.xml"
fi

print_status "Generating coverage report..."
if mvn jacoco:report; then
    print_success "Coverage report generated at target/site/jacoco/index.html"
else
    print_warning "Coverage report generation failed"
fi

print_status "Running backend build..."
if mvn package -DskipTests; then
    print_success "Backend build successful!"
else
    print_error "Backend build failed!"
    exit 1
fi

cd ..

# Final summary
echo
echo "🎉 Quality Check Summary"
echo "======================="
print_success "All checks completed!"
echo
echo "📊 Reports generated:"
echo "  - Frontend coverage: client/coverage/index.html"
echo "  - Backend coverage: server/target/site/jacoco/index.html"
echo "  - Checkstyle: server/target/checkstyle-result.xml"
echo "  - SpotBugs: server/target/spotbugsXml.xml"
echo
print_success "Project is ready for commit! 🚀" 