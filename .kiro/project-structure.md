# 모주(Mozu) 프로젝트 구조 문서

## 개요

모주는 모의 주식 투자를 통해 투자 전략을 학습하고 금융 시장을 이해할 수 있도록 돕는 모의 주식 투자 서비스입니다.

## 아키텍처

### 전체 구조
- **Monorepo 구조**: Yarn Workspaces를 사용한 멀티 패키지 프로젝트
- **TypeScript + React**: 모든 패키지가 TypeScript와 React 기반
- **Vite**: 빌드 도구로 Vite 사용
- **패키지 매니저**: Yarn 4.8.1

## 패키지 구성

### 1. @mozu/admin - 관리자 애플리케이션
**위치**: `packages/admin/`
**역할**: 교사/관리자용 대시보드

#### 주요 기능
- **수업 관리**: 
  - `ClassManagement.tsx` - 수업 목록 및 관리
  - `ClassEnvironment.tsx` - 수업 환경 설정
  - `ClassCreate.tsx` - 새 수업 생성
  - `ClassEdit.tsx` - 수업 정보 수정
- **기사 관리**:
  - `ArticleManagementPage.tsx` - 기사 목록 관리
  - `ArticleManagementAddPage.tsx` - 새 기사 추가
  - `ArticleManagementEditPage.tsx` - 기사 수정
- **주식 관리**:
  - `StockManagementPage.tsx` - 주식 목록 관리
  - `StockManagementAddPage.tsx` - 새 주식 추가
  - `StockManagementEditPage.tsx` - 주식 정보 수정
- **투자 관리**:
  - `InvestmentPreparation.tsx` - 투자 준비 및 설정
  - `ImprovedClassMonitoringPage.tsx` - 실시간 수업 모니터링

#### 기술 스택
- React Router v7
- TanStack Query (React Query)
- Zustand (상태 관리)
- Framer Motion (애니메이션)
- Emotion (스타일링)
- React Table

#### 디렉토리 구조
```
packages/admin/src/
├── apis/           # API 호출 함수들
│   ├── article/    # 기사 관련 API
│   ├── class/      # 수업 관련 API
│   ├── login/      # 로그인 관련 API
│   ├── monitoring/ # 모니터링 관련 API
│   └── stock/      # 주식 관련 API
├── components/     # 재사용 가능한 컴포넌트
├── hooks/          # 커스텀 훅
├── layout/         # 레이아웃 컴포넌트
├── pages/          # 페이지 컴포넌트
├── store/          # Zustand 스토어
├── style/          # 스타일 관련
└── utils/          # 유틸리티 함수
```

### 2. @mozu/student - 학생 애플리케이션
**위치**: `packages/student/`
**역할**: 학생용 모의 주식 투자 인터페이스

#### 주요 기능
- **홈페이지**: `HomePage.tsx` - 대시보드 및 포트폴리오 현황
- **뉴스**: 
  - `NewsPage.tsx` - 뉴스 목록
  - `NewsDetailPage.tsx` - 뉴스 상세보기
- **주식 거래**: `StockPage.tsx` - 주식 매매 인터페이스
- **결과**: `ResultPage.tsx` - 투자 결과 및 순위
- **대기**: `StudentWaitPage.tsx` - 수업 시작 대기
- **종료**: `EndingPage.tsx` - 수업 종료 화면

#### 기술 스택
- React Router DOM v7
- TanStack Query
- Dexie (IndexedDB 래퍼)
- Recharts (차트 라이브러리)
- Framer Motion
- Emotion

#### 디렉토리 구조
```
packages/student/src/
├── apis/           # API 호출 함수들
├── components/     # 재사용 가능한 컴포넌트
├── hook/           # 커스텀 훅
├── layout/         # 레이아웃 컴포넌트
├── pages/          # 페이지 컴포넌트
├── routes/         # 라우팅 설정
└── utils/          # 유틸리티 함수
```

### 3. @mozu/ui - 공통 UI 컴포넌트 라이브러리
**위치**: `packages/ui/`
**역할**: 재사용 가능한 UI 컴포넌트 제공

#### 주요 컴포넌트
- **기본 컴포넌트**: Button, Input, TextArea, Select, CheckBox
- **레이아웃**: Header, SideBar, Modal
- **데이터 표시**: InvestInfoTable, InvestmentMetrics, RankingDiv
- **피드백**: Toast, ToastContainer, Spinner, WarningMsg
- **특수**: Accounts, TeamContainer, SearchInput

#### 개발 도구
- **React Cosmos**: 컴포넌트 개발 및 테스트 환경
- **Fixtures**: 각 컴포넌트별 테스트 케이스

### 4. @mozu/design-token - 디자인 시스템
**위치**: `packages/design-token/`
**역할**: 색상, 타이포그래피, 스페이싱 등 디자인 토큰 관리

#### 기술
- Emotion 기반 스타일링
- TypeScript 타입 정의

### 5. @mozu/util-config - 공통 유틸리티
**위치**: `packages/util-config/`
**역할**: API 설정, 쿠키 관리, 공통 유틸리티 함수

#### 주요 기능
- Axios 설정 및 인터셉터
- 환경 변수 관리
- 쿠키 관리 (universal-cookie)
- Toast 알림 설정

## 개발 환경 및 도구

### 코드 품질
- **Biome**: 린터 및 포매터
- **TypeScript**: 타입 안전성
- **Husky**: Git hooks

### 커밋 관리
- **Commitizen**: 커밋 메시지 표준화
- **Commitlint**: 커밋 메시지 검증
- **JIRA 연동**: 브랜치명에서 JIRA 티켓 자동 추출

### 성능 및 배포
- **Lighthouse CI**: 성능 측정 자동화
- **Vercel**: 각 패키지별 개별 배포

## 실행 방법

### 개발 서버 실행
```bash
# 전체 개발 서버 실행 (admin + student 동시)
yarn dev

# 개별 패키지 실행
yarn admin dev    # 관리자 앱
yarn student dev  # 학생 앱
yarn ui cosmos    # UI 컴포넌트 개발
```

### 빌드
```bash
# 전체 빌드
yarn build

# 개별 패키지 빌드
yarn admin build
yarn student build
yarn ui build
```

### 기타 명령어
```bash
yarn commit       # Commitizen을 사용한 커밋
yarn new-branch   # 새 브랜치 생성 스크립트
```

## 의존성 관리

### 공통 의존성
- React 18.3.1
- TypeScript 5.7.3
- Emotion (스타일링)
- Framer Motion (애니메이션)

### 패키지별 주요 의존성
- **Admin**: Zustand, React Table, Puppeteer
- **Student**: Dexie, Recharts
- **UI**: React Cosmos
- **Util**: Axios, Universal Cookie

## 프로젝트 구조 요약

```
mozu-fe/
├── packages/
│   ├── admin/          # 관리자 애플리케이션
│   ├── student/        # 학생 애플리케이션
│   ├── ui/             # 공통 UI 컴포넌트
│   ├── design-token/   # 디자인 시스템
│   └── util-config/    # 공통 유틸리티
├── scripts/            # 개발 스크립트
├── .kiro/              # Kiro 설정 및 문서
└── 설정 파일들          # package.json, tsconfig 등
```

이 구조는 확장성과 재사용성을 고려한 모던한 프론트엔드 아키텍처로, 교육용 모의 주식 투자 플랫폼에 최적화되어 있습니다.