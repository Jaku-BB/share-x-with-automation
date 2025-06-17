# ShareX - File Sharing Application

## Automatyzacja Procesów

Ten projekt zawiera kompleksową automatyzację procesów deweloperskich, która obejmuje:

### 🔄 CI/CD Pipeline (GitHub Actions)

Pipeline automatycznie uruchamia się przy każdym push/pull request na branch `main` lub `develop`:

- **Frontend CI**: Sprawdza budowanie React/Next.js, uruchamia testy i sprawdza formatowanie kodu
- **Backend CI**: Buduje aplikację Spring Boot, uruchamia testy jednostkowe z bazą PostgreSQL
- **Security Scan**: Skanuje kod pod kątem luk bezpieczeństwa (tylko dla PR)

### 🎨 Frontend - Code Quality (Biome)

**Biome** to szybkie narzędzie zastępujące ESLint + Prettier:

```bash
# Sprawdzenie kodu (lint + format)
npm run check:ci

# Formatowanie kodu
npm run format

# Linting z automatycznymi poprawkami
npm run lint

# Sprawdzanie typów TypeScript
npm run type-check
```

**Konfiguracja**: `client/biome.json`

### 🧪 Testy

#### Frontend (Jest + Testing Library)
```bash
# Uruchamianie testów
npm test

# Testy w trybie watch
npm run test:watch

# Pokrycie testami
npm run test:coverage
```

#### Backend (JUnit + Mockito)
```bash
# Uruchamianie testów
mvn test

# Pakowanie z testami
mvn package

# Raport pokrycia testami (JaCoCo)
mvn jacoco:report
```

### 🔧 Backend - Code Quality

#### Checkstyle
Sprawdza styl kodowania Java zgodnie z standardami:
```bash
mvn checkstyle:check
```

#### SpotBugs
Analiza statyczna kodu Java:
```bash
mvn spotbugs:check
```

#### JaCoCo
Pokrycie testami:
```bash
mvn jacoco:report
```

### 🪝 Pre-commit Hooks (Husky)

Automatyczne sprawdzenie jakości kodu przed każdym commitem:

- Formatowanie i linting za pomocą Biome
- Sprawdzenie staged files

**Setup**:
```bash
cd client
npm install
npm run prepare
```

### 📊 Raporty

#### Frontend
- **Testy**: `client/coverage/` (po `npm run test:coverage`)
- **TypeScript**: sprawdzane podczas budowania

#### Backend
- **JaCoCo**: `server/target/site/jacoco/index.html`
- **Checkstyle**: `server/target/checkstyle-result.xml`
- **SpotBugs**: `server/target/spotbugsXml.xml`

### 🚀 Lokalny Development

1. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd server
   mvn spring-boot:run
   ```

3. **Przed commitem**:
   ```bash
   # Frontend
   cd client
   npm run check
   npm run test
   npm run type-check
   
   # Backend
   cd server
   mvn test
   mvn checkstyle:check
   mvn spotbugs:check
   ```

### 🐳 Docker

```bash
cd server
docker-compose up
```

### 📝 Workflow

1. **Utworzenie nowej feature**:
   ```bash
   git checkout -b feature/nova-funkcjonalnosc
   ```

2. **Development** z automatycznym sprawdzaniem jakości

3. **Push** - automatyczne uruchomienie CI/CD

4. **Pull Request** - dodatkowe security scan

5. **Merge** - deployment (jeśli skonfigurowany)

### ⚙️ Konfiguracja

- **GitHub Actions**: `.github/workflows/ci.yml`
- **Biome**: `client/biome.json`
- **Jest**: `client/jest.config.js`
- **Husky**: `client/.husky/`
- **Checkstyle**: `server/checkstyle.xml`
- **Maven**: `server/pom.xml`

### 🔍 Monitorowanie

Wszystkie wyniki CI/CD są dostępne w zakładce "Actions" na GitHubie. W przypadku błędów, pipeline zatrzymuje się i wskazuje dokładne problemy do rozwiązania. 