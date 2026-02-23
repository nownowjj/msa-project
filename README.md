<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Archive Hub — README</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #07080d;
    --surface: #0e1018;
    --surface2: #13161f;
    --border: rgba(255,255,255,0.06);
    --accent: #6c63ff;
    --accent2: #00e5a0;
    --accent3: #ff6b6b;
    --text: #e8eaf0;
    --muted: #6b7280;
    --mono: 'Space Mono', monospace;
    --sans: 'Syne', sans-serif;
    --kr: 'Noto Sans KR', sans-serif;
  }

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
background: var(--bg);
color: var(--text);
font-family: var(--kr);
line-height: 1.7;
min-height: 100vh;
overflow-x: hidden;
}

/* Grid bg */
body::before {
content: '';
position: fixed;
inset: 0;
background-image:
linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px);
background-size: 40px 40px;
pointer-events: none;
z-index: 0;
}

.container {
max-width: 860px;
margin: 0 auto;
padding: 60px 24px 100px;
position: relative;
z-index: 1;
}

/* ── HERO ── */
.hero {
text-align: center;
padding: 72px 0 56px;
position: relative;
}

.hero-glow {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -60%);
width: 500px;
height: 300px;
background: radial-gradient(ellipse, rgba(108,99,255,0.18) 0%, transparent 70%);
pointer-events: none;
}

.hero-eyebrow {
font-family: var(--mono);
font-size: 11px;
letter-spacing: 4px;
color: var(--accent2);
text-transform: uppercase;
margin-bottom: 20px;
display: inline-block;
border: 1px solid rgba(0,229,160,0.2);
padding: 5px 14px;
border-radius: 2px;
}

.hero-title {
font-family: var(--sans);
font-size: clamp(40px, 7vw, 72px);
font-weight: bold;
line-height: 1.05;
letter-spacing: -2px;
margin-bottom: 8px;
background: linear-gradient(135deg, #fff 30%, rgba(108,99,255,0.7) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
}

.hero-subtitle-line {
font-family: var(--sans);
font-size: clamp(14px, 2.5vw, 18px);
color: var(--muted);
margin-bottom: 32px;
font-weight: 400;
}

.hero-desc {
max-width: 560px;
margin: 0 auto 40px;
font-size: 15px;
color: rgba(232,234,240,0.7);
line-height: 1.8;
}

.hero-desc strong {
color: var(--accent2);
font-weight: 500;
}

/* Badges */
.badges {
display: flex;
flex-wrap: wrap;
gap: 8px;
justify-content: center;
margin-bottom: 40px;
}

.badge {
display: inline-flex;
align-items: center;
gap: 6px;
padding: 6px 12px;
border-radius: 4px;
font-family: var(--mono);
font-size: 11px;
font-weight: 700;
letter-spacing: 0.5px;
border: 1px solid transparent;
transition: transform 0.2s, box-shadow 0.2s;
}

.badge:hover {
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.badge-kotlin   { background: rgba(127,82,255,0.15); border-color: rgba(127,82,255,0.35); color: #a78bfa; }
.badge-spring   { background: rgba(109,179,63,0.12); border-color: rgba(109,179,63,0.3);  color: #86efac; }
.badge-react    { background: rgba(97,218,251,0.1);  border-color: rgba(97,218,251,0.25); color: #67e8f9; }
.badge-ts       { background: rgba(49,120,198,0.12); border-color: rgba(49,120,198,0.3);  color: #93c5fd; }
.badge-docker   { background: rgba(36,150,237,0.1);  border-color: rgba(36,150,237,0.25); color: #7dd3fc; }

/* Quick Links */
.links-bar {
display: flex;
gap: 12px;
justify-content: center;
flex-wrap: wrap;
}

.link-chip {
display: inline-flex;
align-items: center;
gap: 7px;
padding: 9px 18px;
background: var(--surface2);
border: 1px solid var(--border);
border-radius: 6px;
font-family: var(--mono);
font-size: 12px;
color: var(--text);
text-decoration: none;
transition: all 0.2s;
}

.link-chip:hover {
border-color: var(--accent);
color: var(--accent);
background: rgba(108,99,255,0.08);
}

.link-chip .dot {
width: 6px; height: 6px;
border-radius: 50%;
background: var(--accent2);
}

/* ── SECTION ── */
.section {
margin-top: 64px;
}

.section-label {
font-family: var(--mono);
font-size: 10px;
letter-spacing: 4px;
color: var(--accent);
text-transform: uppercase;
margin-bottom: 12px;
display: flex;
align-items: center;
gap: 10px;
}

.section-label::after {
content: '';
flex: 1;
height: 1px;
background: linear-gradient(90deg, var(--border), transparent);
}

.section-title {
font-family: var(--sans);
font-size: 28px;
font-weight: 700;
margin-bottom: 24px;
color: #fff;
}

/* Architecture Card */
.arch-card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 12px;
padding: 32px;
position: relative;
overflow: hidden;
}

.arch-card::before {
content: '';
position: absolute;
top: 0; left: 0; right: 0;
height: 1px;
background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.arch-title {
font-family: var(--sans);
font-size: 20px;
font-weight: 700;
margin-bottom: 20px;
display: flex;
align-items: center;
gap: 10px;
}

.arch-title .gem { color: var(--accent2); }

.arch-pills {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 14px;
}

.arch-pill {
background: var(--surface2);
border: 1px solid var(--border);
border-radius: 8px;
padding: 16px 18px;
display: flex;
gap: 12px;
}

.arch-pill-icon {
font-size: 20px;
line-height: 1;
flex-shrink: 0;
}

.arch-pill-text strong {
font-family: var(--mono);
font-size: 12px;
color: var(--accent2);
display: block;
margin-bottom: 4px;
}

.arch-pill-text p {
font-size: 13px;
color: var(--muted);
line-height: 1.5;
}

/* Tech Table */
.tech-grid {
display: grid;
gap: 16px;
}

.tech-group {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 10px;
overflow: hidden;
}

.tech-group-header {
background: var(--surface2);
padding: 10px 20px;
font-family: var(--mono);
font-size: 11px;
letter-spacing: 3px;
text-transform: uppercase;
color: var(--accent);
border-bottom: 1px solid var(--border);
}

table {
width: 100%;
border-collapse: collapse;
}

th {
padding: 10px 20px;
text-align: left;
font-family: var(--mono);
font-size: 10px;
letter-spacing: 2px;
text-transform: uppercase;
color: var(--muted);
border-bottom: 1px solid var(--border);
}

td {
padding: 12px 20px;
font-size: 13px;
border-bottom: 1px solid rgba(255,255,255,0.03);
vertical-align: top;
}

tr:last-child td { border-bottom: none; }

td:first-child {
color: var(--muted);
font-family: var(--mono);
font-size: 11px;
width: 100px;
}

td:nth-child(2) {
font-weight: 600;
color: #fff;
font-family: var(--sans);
}

td:nth-child(3) {
color: rgba(232,234,240,0.55);
font-size: 12.5px;
}

/* Highlights */
.highlight-list {
display: grid;
gap: 20px;
}

.highlight-card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 12px;
padding: 28px 30px;
position: relative;
overflow: hidden;
transition: border-color 0.2s;
}

.highlight-card:hover { border-color: rgba(108,99,255,0.3); }

.highlight-card::after {
content: '';
position: absolute;
left: 0; top: 0; bottom: 0;
width: 3px;
border-radius: 0 2px 2px 0;
}

.highlight-card.c1::after { background: var(--accent); }
.highlight-card.c2::after { background: var(--accent2); }
.highlight-card.c3::after { background: var(--accent3); }

.highlight-num {
font-family: var(--mono);
font-size: 11px;
color: var(--muted);
margin-bottom: 6px;
}

.highlight-title {
font-family: var(--sans);
font-size: 17px;
font-weight: 700;
margin-bottom: 8px;
color: #fff;
}

.highlight-quote {
font-family: var(--mono);
font-size: 12px;
color: var(--accent2);
margin-bottom: 16px;
display: block;
}

.highlight-items {
list-style: none;
display: grid;
gap: 8px;
}

.highlight-items li {
font-size: 13.5px;
color: rgba(232,234,240,0.7);
padding-left: 18px;
position: relative;
line-height: 1.6;
}

.highlight-items li::before {
content: '→';
position: absolute;
left: 0;
color: var(--accent);
font-family: var(--mono);
font-size: 12px;
}

.highlight-items li strong { color: var(--text); font-weight: 500; }

/* File Tree */
.tree-card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 12px;
overflow: hidden;
}

.tree-header {
background: var(--surface2);
padding: 12px 20px;
display: flex;
align-items: center;
gap: 8px;
border-bottom: 1px solid var(--border);
}

.tree-dot {
width: 10px; height: 10px;
border-radius: 50%;
}

.tree-body {
padding: 24px 28px;
font-family: var(--mono);
font-size: 13px;
line-height: 2;
color: var(--muted);
}

.tree-body .dir  { color: #93c5fd; }
.tree-body .file { color: rgba(232,234,240,0.5); }
.tree-body .pkg  { color: var(--accent2); }
.tree-body .root { color: #fff; font-weight: 700; }
.tree-body .comment { color: rgba(108,99,255,0.6); font-size: 11px; }

/* CI/CD */
.cicd-grid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 14px;
}

.cicd-card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 10px;
padding: 22px;
}

.cicd-card strong {
font-family: var(--mono);
font-size: 12px;
color: var(--accent);
display: block;
margin-bottom: 6px;
}

.cicd-card p {
font-size: 13px;
color: var(--muted);
line-height: 1.6;
}

/* Footer */
.footer {
margin-top: 80px;
text-align: center;
padding: 32px 0;
border-top: 1px solid var(--border);
font-family: var(--mono);
font-size: 11px;
color: rgba(107,114,128,0.6);
letter-spacing: 2px;
}

@media (max-width: 600px) {
.cicd-grid { grid-template-columns: 1fr; }
.arch-pills { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<div class="container">

  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-glow"></div>
    <div class="hero-eyebrow">AI-Powered Knowledge Archive</div>
    <h1 class="hero-title">LINK MINT</h1>
    <p class="hero-subtitle-line">URL 하나로 끝내는 지식 관리</p>
    <p class="hero-desc">
      단순한 북마크 저장을 넘어 **Jsoup 기반 웹 크롤링**과 **Gemini AI** 요약을 결합한 지능형 아카이브입니다.
      <strong>Redis 2-Tier 캐싱</strong>으로 인프라 비용을 최적화하고, <strong>Modular Monolith</strong> 구조로 유지보수성을 확보했습니다.
    </p>

    <div class="badges">
      <span class="badge badge-kotlin">🟣 Kotlin</span>
      <span class="badge badge-spring">🌱 Spring Boot</span>
      <span class="badge badge-react">⚛ React</span>
      <span class="badge badge-ts">🔷 TypeScript</span>
      <span class="badge badge-docker">🐳 Docker</span>
    </div>

    <div class="links-bar">
      <a href="https://msa-project-steel.vercel.app/" class="link-chip"><span class="dot"></span>🌐 Live Demo</a>
    </div>
  </section>

  <!-- ── ARCHITECTURE ── -->
  <section class="section">
    <div class="section-label">System Architecture</div>
    <h2 class="section-title">💎 Modular Monolith Strategy</h2>

  <div class="arch-card">
     <p style="font-size:14px;color:rgba(232,234,240,0.65);margin-bottom:24px;line-height:1.8;">
       초기 설계 단계에서 도메인 주도 설계(DDD)를 바탕으로 <code>api</code>와 <code>auth</code> 모듈을 분리한 MSA 지향 구조로 시작했으나, 
       <strong>운영 효율과 인프라 제약 조건(OCI Free Tier)</strong>을 고려하여 <span style="color:var(--accent2);font-weight:500;">Modular Monolith</span> 배포 전략을 선택했습니다.
     </p>
     <div class="arch-pills">
       <div class="arch-pill">
         <div class="arch-pill-icon">🏛️</div>
         <div class="arch-pill-text">
           <strong>Monolith-Launcher</strong>
           <p>분리된 모듈을 단일 JVM에서 실행하여 자원 점유율 최적화 및 네트워크 지연 제거</p>
         </div>
       </div>
       <div class="arch-pill">
         <div class="arch-pill-icon">🔒</div>
         <div class="arch-pill-text">
           <strong>Security & SSL (NPM)</strong>
           <p>Nginx Proxy Manager를 통한 역방향 프록시 및 Let's Encrypt 기반 HTTPS 보안 통신 구축</p>
         </div>
       </div>
       <div class="arch-pill">
         <div class="arch-pill-icon">📦</div>
         <div class="arch-pill-text">
           <strong>Containerization</strong>
           <p>Docker를 활용하여 개발-검증-배포 환경의 일관성 유지 및 CI/CD 자동화</p>
         </div>
       </div>
     </div>
   </div>
  </section>

  <!-- ── TECH STACK ── -->
  <section class="section">
    <div class="section-label">Tech Stack & Infrastructure</div>
    <h2 class="section-title">🛠 사용 기술</h2>

    <div class="tech-grid">
      <div class="tech-group">
        <div class="tech-group-header">Backend & Infrastructure</div>
        <table>
          <thead><tr><th>Category</th><th>Technology</th><th>Usage</th></tr></thead>
           <tbody>
            <tr><td>Server</td><td>Kotlin / Spring Boot</td><td>멀티 모듈 구조를 통한 비즈니스 로직 격리 및 안정적 서버 구축</td></tr>
            <tr><td>Cloud</td><td>OCI / Vercel</td><td>Oracle Cloud 기반 백엔드 및 Vercel 기반 프론트엔드 분리 배포</td></tr>
            <tr><td>Database</td><td>Supabase / Redis</td><td>PostgreSQL의 영속성과 Redis의 고속 인메모리 캐싱 활용</td></tr>
            <tr><td>AI & Scraping</td><td>Gemini API / Jsoup</td><td>웹 콘텐츠 자동 요약 및 키워드 추출 자동화 파이프라인</td></tr>
            <tr><td>Proxy/SSL</td><td>Nginx Proxy Manager</td><td>역방향 프록시 설정 및 SSL(HTTPS) 인증서 관리 (Port 81)</td></tr>
            <tr><td>Cloud VM</td><td>Oracle Cloud (OCI)</td><td>ARM 아키텍처 인스턴스 기반 가용성 높은 서버 운영</td></tr>
            <tr><td>CI/CD</td><td>GitHub Actions / Docker</td><td>코드 Push 시 자동 빌드 및 이미지 기반의 일관된 배포 프로세스</td></tr>
          </tbody>
        </table>
      </div>

      <div class="tech-group">
        <div class="tech-group-header">Frontend</div>
        <table>
          <thead><tr><th>Category</th><th>Technology</th><th>Usage</th></tr></thead>
          <tbody>
            <tr><td>Library</td><td>React 18</td><td>컴포넌트 기반 UI 개발</td></tr>
            <tr><td>State</td><td>Zustand &amp; React Query</td><td>전역 상태 및 서버 데이터 캐싱 최적화</td></tr>
            <tr><td>UI</td><td>Intersection Observer</td><td>무한 스크롤 UX 구현</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ── HIGHLIGHTS ── -->
  <section class="section">
    <div class="section-label">Engineering Highlights</div>
    <h2 class="section-title">🔥 핵심 기술적 도전</h2>

    <div class="highlight-list">
     <div class="highlight-card c1">
       <div class="highlight-num">01 / 03</div>
       <div class="highlight-title">Redis 2-Tier 캐싱 & Gemini AI 연동</div>
       <span class="highlight-quote">"비용 절감과 성능 향상의 균형"</span>
       <ul class="highlight-items">
         <li><strong>Shared Cache Strategy</strong> — URL Hash 기반 공유 캐시로 중복 크롤링 방지 (응답 속도 90% 개선)</li>
         <li><strong>AI Staging</strong> — 사용자 세션별 임시 캐시를 통한 Gemini 요약 데이터의 정합성 유지</li>
         <li><strong>Self-healing</strong> — API 호출 실패 시 기존 캐시 복구 로직을 통한 서비스 연속성 보장</li>
       </ul>
     </div>
   
     <div class="highlight-card c2">
       <div class="highlight-num">02 / 03</div>
       <div class="highlight-title">QueryDSL 기반 정규화 검색 및 N+1 최적화</div>
       <ul class="highlight-items" style="margin-top:8px">
         <li><strong>Query Normalization</strong> — 공백 및 대소문자 무시 검색을 위한 DB 정규화 컬럼 운영</li>
         <li><strong>Performance Tuning</strong> — <code>fetchJoin</code>을 활용한 N+1 해결 및 <code>PageableExecutionUtils</code> 기반 카운트 쿼리 최적화</li>
       </ul>
     </div>

     <div class="highlight-card c3">
       <div class="highlight-num">03 / 03</div>
       <div class="highlight-title">Infra Orchestration & Security</div>
       <ul class="highlight-items" style="margin-top:16px">
         <li><strong>Nginx Proxy Manager</strong> — 포트 81번 대시보드를 활용한 효율적인 도메인 관리 및 SSL 인증서 자동 갱신 체계 구축</li>
         <li><strong>Reverse Proxy</strong> — 외부 요청을 내부 도커 컨테이너(API/Auth)로 안전하게 라우팅하여 서버 보안 강화</li>
         <li><strong>GitHub Actions CI/CD</strong> — 빌드부터 OCI 서버 배포, 컨테이너 교체까지 전 과정을 자동화하여 무중단 배포 기반 마련</li>
       </ul>
     </div>
   </div>
  </section>

  <!-- ── FILE TREE ── -->
  <section class="section">
    <div class="section-label">Project Structure</div>
    <h2 class="section-title">📂 디렉토리 구조</h2>

    <div class="tree-card">
      <div class="tree-header">
        <div class="tree-dot" style="background:#ff5f56"></div>
        <div class="tree-dot" style="background:#ffbd2e"></div>
        <div class="tree-dot" style="background:#27c93f"></div>
        <span style="font-family:var(--mono);font-size:12px;color:var(--muted);margin-left:8px">msa-project</span>
      </div>
      <div class="tree-body">
        <div><span class="root">msa-project/</span></div>
        <div>├── <span class="dir">📂 .github/workflows</span>      <span class="comment"># CI/CD (GHA)</span></div>
        <div>├── <span class="dir">📂 backend/</span></div>
        <div>│   ├── <span class="pkg">📦 api-service</span>        <span class="comment"># Domain Logic (Scraping, AI)</span></div>
        <div>│   ├── <span class="pkg">📦 auth-service</span>       <span class="comment"># Security & JWT</span></div>
        <div>│   ├── <span class="pkg">📦 common</span>             <span class="comment"># Shared Core</span></div>
        <div>│   └── <span class="pkg">📦 monolith-launcher</span>  <span class="comment"># Deployment Unit</span></div>
        <div>├── <span class="dir">📂 frontend</span>               <span class="comment"># React & TS (Zustand, React Query)</span></div>
        <div>├── <span class="file">📄 Dockerfile</span>             <span class="comment"># Container Config</span></div>
        <div>└── <span class="file">📄 Infrastructure</span>         <span class="comment"># Managed Cloud (Supabase, Redis, Gemini)</span></div>
      </div>
    </div>
  </section>

  <div class="footer">
    ARCHIVE HUB &nbsp;·&nbsp; BUILT WITH KOTLIN × REACT &nbsp;·&nbsp; POWERED BY GEMINI AI
  </div>

</div>
</body>
</html>