.PHONY: help install test build clean quality frontend-install backend-test docker-up docker-down

# Default target
help:
	@echo "ShareX Project Automation"
	@echo "========================="
	@echo ""
	@echo "Available targets:"
	@echo "  help              Show this help message"
	@echo "  install           Install all dependencies"
	@echo "  test              Run all tests"
	@echo "  build             Build frontend and backend"
	@echo "  quality           Run all quality checks"
	@echo "  clean             Clean build artifacts"
	@echo "  docker-up         Start development environment"
	@echo "  docker-down       Stop development environment"
	@echo ""
	@echo "Frontend specific:"
	@echo "  frontend-install  Install frontend dependencies"
	@echo "  frontend-test     Run frontend tests"
	@echo "  frontend-build    Build frontend"
	@echo "  frontend-dev      Start frontend dev server"
	@echo ""
	@echo "Backend specific:"
	@echo "  backend-test      Run backend tests"
	@echo "  backend-build     Build backend"
	@echo "  backend-run       Start backend server"

# Install all dependencies
install: frontend-install
	@echo "✅ All dependencies installed"

# Frontend targets
frontend-install:
	@echo "📦 Installing frontend dependencies..."
	cd client && npm install

frontend-test:
	@echo "🧪 Running frontend tests..."
	cd client && npm run test -- --coverage --watchAll=false

frontend-build:
	@echo "🔨 Building frontend..."
	cd client && npm run build

frontend-dev:
	@echo "🚀 Starting frontend development server..."
	cd client && npm run dev

# Backend targets
backend-test:
	@echo "🧪 Running backend tests..."
	cd server && mvn test

backend-build:
	@echo "🔨 Building backend..."
	cd server && mvn package -DskipTests

backend-run:
	@echo "🚀 Starting backend server..."
	cd server && mvn spring-boot:run

# Combined targets
test: frontend-test backend-test
	@echo "✅ All tests completed"

build: frontend-build backend-build
	@echo "✅ All builds completed"

# Quality checks
quality:
	@echo "🔍 Running quality checks..."
	./scripts/quality-check.sh

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	cd client && rm -rf .next out build coverage node_modules/.cache
	cd server && mvn clean

# Docker targets
docker-up:
	@echo "🐳 Starting development environment..."
	cd server && docker-compose up -d

docker-down:
	@echo "🐳 Stopping development environment..."
	cd server && docker-compose down

# Development workflow
dev-setup: install docker-up
	@echo "🎯 Development environment ready!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"
	@echo "Database: localhost:5432"

# CI simulation
ci-check: quality test build
	@echo "✅ CI checks completed successfully" 