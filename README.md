디렉토리 구조
msa-project
 ├─ backend               -> fly.io 고려
 │   └─ msa-project
 │       ├─ common
 │       ├─ auth-service
 │       └─ api-service
 │
 └─ frontend               -> Netlify 고려
     └─ web-app

사이드 프로젝트 특성 상 git 관리는 같은 repo에서 관리

MSA 런타임 분리