# <p align="center">🚀 LINK MINT: AI-Powered Knowledge Archive</p>

<p align="center">
  <img src="https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=Kotlin&logoColor=white" />
  <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white" />
</p>

<p align="center">
  <strong>URL 하나로 끝내는 지식 관리</strong><br>
  단순한 북마크 저장을 넘어 Jsoup 기반 웹 크롤링과 Gemini AI 요약을 결합한 지능형 아카이브입니다.<br>
  Redis 2-Tier 캐싱으로 비용을 최적화하고 Modular Monolith 구조로 유지보수성을 확보했습니다.
</p>

<p align="center">
  <a href="https://msa-project-steel.vercel.app/"><strong>🌐 Live Demo 보러가기</strong></a>
</p>

---

## 💎 System Architecture: Modular Monolith Strategy

초기 설계 단계에서 도메인 주도 설계(DDD)를 바탕으로 `api`와 `auth` 모듈을 분리한 MSA 지향 구조로 시작했으나, **운영 효율과 인프라 제약 조건(OCI Free Tier)**을 고려하여 **Modular Monolith** 배포 전략을 선택했습니다.



- 🏛️ **Monolith-Launcher**: 분리된 모듈을 단일 JVM에서 실행하여 자원 점유율 최적화 및 네트워크 지연 제거
- 🔒 **Security & SSL (NPM)**: Nginx Proxy Manager를 통한 역방향 프록시 및 Let's Encrypt 기반 HTTPS 구축
- 📦 **Containerization**: Docker를 활용하여 개발-검증-배포 환경의 일관성 유지 및 CI/CD 자동화

---

## 🛠 Tech Stack & Infrastructure

### ⚙️ Backend & Infrastructure
| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Server** | Kotlin / Spring Boot | 멀티 모듈 구조를 통한 비즈니스 로직 격리 및 안정적 서버 구축 |
| **Cloud** | OCI / Vercel | Oracle Cloud 백엔드 및 Vercel 프론트엔드 분리 배포 |
| **Database** | Supabase / Redis | PostgreSQL의 영속성과 Redis의 고속 인메모리 캐싱 활용 |
| **AI & Scraping** | Gemini API / Jsoup | 웹 콘텐츠 자동 요약 및 키워드 추출 자동화 파이프라인 |
| **Proxy/SSL** | Nginx Proxy Manager | 역방향 프록시 및 SSL 인증서 관리 (Port 81) |
| **CI/CD** | GitHub Actions / Docker | 코드 Push 시 자동 빌드 및 이미지 기반 배포 프로세스 |

### 🎨 Frontend
| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Library** | React 18 | 컴포넌트 기반 UI 개발 |
| **State** | Zustand & React Query | 전역 상태 및 서버 데이터 캐싱 최적화 |
| **UI** | Intersection Observer | 무한 스크롤 UX 구현 |

---

## 🔥 Engineering Highlights

### 1️⃣ Redis 2-Tier 캐싱 & Gemini AI 연동
> **"비용 절감과 성능 향상의 균형"**
- **Shared Cache Strategy**: URL Hash 기반 공유 캐시로 중복 크롤링 방지 (**응답 속도 90% 개선**)
- **AI Staging**: 사용자 세션별 임시 캐시를 통한 Gemini 요약 데이터의 정합성 유지
- **Self-healing**: API 호출 실패 시 기존 캐시 복구 로직을 통한 서비스 연속성 보장

### 2️⃣ QueryDSL 기반 정규화 검색 및 N+1 최적화
- **Query Normalization**: 공백 및 대소문자 무시 검색을 위한 DB 정규화 컬럼 운영
- **Performance Tuning**: `fetchJoin`을 활용한 N+1 해결 및 `PageableExecutionUtils` 기반 카운트 쿼리 최적화

### 3️⃣ Infra Orchestration & Security
- **Nginx Proxy Manager**: 포트 81번 대시보드를 활용한 도메인 관리 및 SSL 인증서 자동 갱신
- **Reverse Proxy**: 외부 요청을 내부 도커 컨테이너로 안전하게 라우팅하여 보안 강화
- **GitHub Actions**: 빌드부터 OCI 서버 배포까지 전 과정 자동화 (무중단 배포 기반)

---

## 📂 Project Structure

```bash
msa-project
├── 📂 .github/workflows       # CI/CD (GitHub Actions)
├── 📂 backend                 # Kotlin 기반 멀티 모듈 백엔드
│   ├── 📦 api-service         # 비즈니스 로직 (Scraping, AI 요약)
│   ├── 📦 auth-service        # 인증/인가 및 JWT 관리
│   ├── 📦 common              # 공용 엔티티 및 유틸리티
│   └── 📦 monolith-launcher   # 배포용 통합 모듈 (Modular Monolith)
├── 📂 frontend                # React & TypeScript (Zustand, React Query)
├── 📄 Dockerfile              # 운영 환경 컨테이너 빌드 설정
└── 📄 Infrastructure          # Managed Cloud (Supabase, Redis, Gemini)
