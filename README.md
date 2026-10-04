# 예산 계산기 (React Budget Calculator)

사용자가 설정한 예산 내에서 지출 내역을 카테고리별로 기록, 조회, 수정, 삭제하며 잔여 예산을 실시간으로 관리할 수 있는 React 기반 어플리케이션입니다. AI-native 개발 과정(바이브 코딩)을 통해 작성되었으며, '초급자' 및 '표준 학습자' 기준을 모두 초과 달성하도록 설계되었습니다.


## ✨ 주요 기능

- **목록 조회 (Read)**: 지출 목록 및 실시간 카테고리별 차트 시각화
- **항목 추가 (Create)**: 폼(이름, 금액, 카테고리)을 통한 지출 내역 생성 (음수 및 빈 값 방어 적용)
- **항목 수정 (Update)**: 리스트 내 인라인 수정을 통한 즉각적인 내역 변경
- **항목 삭제 (Delete)**: 개별 삭제 및 전체 내역 초기화
- **상태 보존 (Persist)**: `LocalStorage` 동기화를 통한 브라우저 종료 후 데이터 유지 방어
- **모던 테마 (Design)**: CSS Variables 기반 글래스모피즘 딥 다크 테마 및 한국어 완벽 패치s

## ✅ 과제 체크리스트 달성도 (ReactCRUD.ipynb 기준)

### 📌 필수 기능 (100% 달성)
- [x] **목록 조회 (Read)**: 지출 항목 목록 및 요약 차트 표시 완료
- [x] **항목 추가 (Create)**: 폼을 통해 새로운 지출 항목 생성 완료
- [x] **항목 수정 (Update)**: 등록된 지출 항목의 내용(금액, 카테고리 등) 수정 완료
- [x] **항목 삭제 (Delete)**: 개별 삭제 및 전체 삭제 기능 구현 완료
- [x] **데이터 구조 정의**: `id`, `name`, `amount`, `category` 등 구조화 완료 (`REVIEW.md` 참고)
- [x] **AI 활용 기록**: 프롬프트 작성 및 결과 검토 기록 완료 (`PROMPT_HISTORY.md` 참고)
- [x] **오류 해결 기록**: 터미널 및 네트워크 다운로드(Proxy) 오류 해결 과정 기록 완료 (`PROMPT_HISTORY.md` 참고)

### 💡 권장 기능 (100% 달성)
- [x] **컴포넌트 분리**: `App`, `ExpenseForm`, `ExpenseList`, `ExpenseItem`, `BudgetDisplay`, `FixedCostSetup` 등 6개 이상의 컴포넌트로 완벽한 역할 분리
- [x] **입력 검증**: 빈 값 입력 방지, 음수 입력 방지(`min="0"`) 등 폼 유효성 검사(Validation) 적용
- [x] **빈 상태 처리**: 지출 내역이 0개일 때 빈 상태(Empty State) 안내 메시지 표시
- [x] **오류 상태 처리**: 총 지출이 예산을 초과할 시 즉각적인 붉은색 경고(Alert) 표시
- [x] **LocalStorage 저장**: 새로고침이나 앱 재시작 후에도 모든 사용자 데이터 완벽 유지
- [x] **검색 또는 필터**: 카테고리별(식비, 교통, 주거 등) 지출 내역 필터링 기능 구현 완료

### 🚀 도전 기능 (보안 및 구조 달성)
- [x] **보안 주의사항 기록**: 하단 보안 섹션에 기재. 로컬 스토리지 사용으로 API Key 및 민감 개인정보 노출 위험 원천 차단.
- [ ] **Supabase 연결 / Auth / RLS**: 본 프로젝트는 **초급자 및 표준 학습자 수준의 완벽한 기능 구현(100%)**에 집중하였으며, 데이터베이스 기반 백엔드 확장은 향후 학습 과제로 계획함.

## 🛠 사용 기술

- **Framework**: React (Vite 기반)
- **Styling**: Vanilla CSS (자체 디자인 시스템 구현)
- **Icons & Charts**: `react-icons`, `chart.js`, `react-chartjs-2`
- **Utility**: `uuid` (데이터 고유 식별자), `localStorage` (브라우저 내장 스토리지)

## 🚀 실행 방법

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **로컬 개발 서버 실행**
   ```bash
   npm run dev
   ```
   > 💡 실행 후 터미널에 나타나는 `http://localhost:5173/` 링크를 브라우저에서 열어 확인하세요.

## GitHub Pages 배포

1. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
2. 변경 사항을 `master` 브랜치에 push하면 `.github/workflows/deploy.yml`이 `npm ci`, `npm run build`를 실행하고 `dist` 폴더를 배포합니다. Actions 탭에서 **Deploy to GitHub Pages → Run workflow**로 수동 실행할 수도 있습니다.
3. 배포가 완료되면 https://choihyeokjun-coder.github.io/budget_calculator/ 에서 확인합니다.

Vite의 `base`는 `/budget_calculator/`로 설정되어 있습니다. `index.html`의 `/src/main.jsx`는 개발용 진입점이며, 빌드할 때 컴파일된 JavaScript 경로로 바뀝니다. 저장소의 소스 파일을 직접 Pages에 배포하지 않고 `dist`를 배포해야 합니다.

로컬에서 배포 결과를 확인하려면 `npm run build` 후 `npm run preview`를 실행하고 http://localhost:4173/budget_calculator/ 를 엽니다.

## 📂 프로젝트 폴더 구조
- `src/components/`: 재사용 가능한 6개의 UI 컴포넌트 (`BudgetDisplay`, `ExpenseForm`, `ExpenseList`, `ExpenseItem`, `ExpenseChart`) 분리
- `src/utils/`: 데이터 지속성을 보장하는 `localStorage.js` 유틸 함수 분리
- `src/index.css`: 글로벌 디자인 토큰 및 CSS 애니메이션 파일
- `src/App.jsx`: 애플리케이션 최상위 상태 관리 컴포넌트

## 📊 데이터 구조 및 AI 활용 기록

- **데이터 구조**: `id`, `name`, `amount`, `category`의 필수 4필드 구조
- **AI 활용 및 오류 해결 기록**: 상세한 프롬프트(6요소 준수) 기록 및 터미널/네트워크 오류 해결 과정은 
  👉 [PROMPT_HISTORY.md](./PROMPT_HISTORY.md) 파일에 자세히 기록되어 있습니다.
- **기획 및 검토 문서**: 데이터 명세와 요구사항 달성도는 👉 [REVIEW.md](./REVIEW.md) 파일에 기록되어 있습니다.

## 🛡 보안 및 저작권 점검 결과

- **개인정보/민감 정보**: 사용자 로그인이 필요 없는 브라우저 단독 스토리지(LocalStorage) 방식이므로 개인정보 및 민감 정보를 전혀 수집하거나 업로드하지 않음 ✅
- **API Key 노출 여부**: `.env` 파일이나 외부 DB (Supabase 등) 통신키, service role key 등을 일절 사용하지 않아 키 유출 위험 원천 차단 ✅
- **저작권**: 순수 CSS와 오픈소스 차트 라이브러리만을 활용하여 저작권에 위배되는 외부 이미지, 유료 상용 코드, 무단 복제 리소스를 사용하지 않음 ✅

## 💡 배운 점과 보완할 점

- **배운 점**: 바이브 코딩 과정에서 프롬프트 6요소를 명확히 작성할수록 AI가 의도한 구조(불변성 유지, 컴포넌트 쪼개기 등)를 100% 반영하여 안전한 React 앱을 짜준다는 것을 배웠음.
- **보완할 점**: 현재는 LocalStorage로 동작하여 기기 간 연동이 불가능함. 향후 Supabase와 같은 BaaS(Backend as a Service)를 연동하여 기기 간 실시간 동기화를 구축해볼 예정임.
