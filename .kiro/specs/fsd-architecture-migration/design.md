# 설계 문서

## 개요

이 문서는 모주(Mozu) 프로젝트를 Feature-Sliced Design (FSD) 아키텍처로 마이그레이션하기 위한 상세한 설계를 제공합니다. 기존 모노레포 구조를 유지하면서 각 애플리케이션 내에서 FSD의 7계층 아키텍처를 구현하여 코드 구성, 유지보수성, 확장성을 개선합니다.

## 아키텍처

### FSD 계층 구조

FSD 아키텍처는 다음 7개 계층으로 구성됩니다:

```
app/        # 애플리케이션 초기화 및 설정
pages/      # 페이지 컴포넌트 및 라우팅
widgets/    # 독립적인 UI 블록
features/   # 비즈니스 기능
entities/   # 비즈니스 엔티티
shared/     # 재사용 가능한 코드
processes/  # 복잡한 비즈니스 프로세스 (선택적)
```

### 계층 의존성 규칙

- 각 계층은 자신보다 아래 계층에서만 import 가능
- 동일 계층 내에서는 슬라이스 간 직접 import 금지
- 상위 계층에서 하위 계층으로의 import 금지

## 컴포넌트 및 인터페이스

### 1. Admin 애플리케이션 구조

```
packages/admin/src/
├── app/
│   ├── providers/          # 전역 프로바이더
│   ├── store/             # 전역 상태 관리
│   ├── styles/            # 전역 스타일
│   └── index.tsx          # 앱 진입점
├── pages/
│   ├── class-management/   # 수업 관리 페이지
│   ├── article-management/ # 기사 관리 페이지
│   ├── stock-management/   # 주식 관리 페이지
│   ├── monitoring/         # 모니터링 페이지
│   └── index.ts           # 페이지 re-exports
├── widgets/
│   ├── class-list/        # 수업 목록 위젯
│   ├── monitoring-dashboard/ # 모니터링 대시보드
│   ├── article-editor/    # 기사 편집기
│   └── stock-chart/       # 주식 차트 위젯
├── features/
│   ├── class-management/  # 수업 관리 기능
│   ├── article-management/ # 기사 관리 기능
│   ├── stock-management/  # 주식 관리 기능
│   ├── user-authentication/ # 사용자 인증
│   └── real-time-monitoring/ # 실시간 모니터링
├── entities/
│   ├── class/             # 수업 엔티티
│   ├── article/           # 기사 엔티티
│   ├── stock/             # 주식 엔티티
│   ├── user/              # 사용자 엔티티
│   └── team/              # 팀 엔티티
└── shared/
    ├── api/               # API 설정 및 클라이언트
    ├── ui/                # 공통 UI 컴포넌트
    ├── lib/               # 유틸리티 함수
    ├── config/            # 설정 파일
    └── constants/         # 상수 정의
```

### 2. Student 애플리케이션 구조

```
packages/student/src/
├── app/
│   ├── providers/         # 전역 프로바이더
│   ├── store/            # 전역 상태 관리
│   ├── styles/           # 전역 스타일
│   └── index.tsx         # 앱 진입점
├── pages/
│   ├── home/             # 홈 페이지
│   ├── news/             # 뉴스 페이지
│   ├── stock-trading/    # 주식 거래 페이지
│   ├── results/          # 결과 페이지
│   ├── waiting/          # 대기 페이지
│   └── ending/           # 종료 페이지
├── widgets/
│   ├── portfolio-summary/ # 포트폴리오 요약
│   ├── news-feed/        # 뉴스 피드
│   ├── trading-panel/    # 거래 패널
│   ├── ranking-board/    # 순위 보드
│   └── stock-chart/      # 주식 차트
├── features/
│   ├── portfolio-management/ # 포트폴리오 관리
│   ├── news-reading/     # 뉴스 읽기
│   ├── stock-trading/    # 주식 거래
│   ├── ranking-view/     # 순위 보기
│   └── session-management/ # 세션 관리
├── entities/
│   ├── portfolio/        # 포트폴리오 엔티티
│   ├── stock/            # 주식 엔티티
│   ├── news/             # 뉴스 엔티티
│   ├── user/             # 사용자 엔티티
│   └── transaction/      # 거래 엔티티
└── shared/
    ├── api/              # API 설정 및 클라이언트
    ├── ui/               # 공통 UI 컴포넌트
    ├── lib/              # 유틸리티 함수
    ├── config/           # 설정 파일
    └── constants/        # 상수 정의
```

### 3. 슬라이스 내부 구조

각 슬라이스는 다음과 같은 세그먼트로 구성됩니다:

```
feature-name/
├── api/           # API 호출 로직
├── ui/            # UI 컴포넌트
├── model/         # 상태 관리 및 비즈니스 로직
├── lib/           # 유틸리티 함수
├── config/        # 설정 (필요시)
└── index.ts       # Public API
```

## 데이터 모델

### 1. 엔티티 모델

#### User Entity
```typescript
// entities/user/model/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  classId?: string;
  teamId?: string;
}
```

#### Class Entity
```typescript
// entities/class/model/types.ts
export interface Class {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  students: string[];
  status: 'preparing' | 'active' | 'ended';
  settings: ClassSettings;
}
```

#### Stock Entity
```typescript
// entities/stock/model/types.ts
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  changeRate: number;
  volume: number;
}
```

### 2. 상태 관리 구조

#### Feature 레벨 상태
```typescript
// features/stock-trading/model/store.ts
export interface StockTradingState {
  selectedStock: Stock | null;
  orderType: 'buy' | 'sell';
  quantity: number;
  isLoading: boolean;
}
```

#### Entity 레벨 상태
```typescript
// entities/portfolio/model/store.ts
export interface PortfolioState {
  holdings: Holding[];
  totalValue: number;
  availableCash: number;
  totalReturn: number;
}
```

## 오류 처리

### 1. API 오류 처리

```typescript
// shared/api/error-handler.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export const handleApiError = (error: unknown): ApiError => {
  // 오류 처리 로직
};
```

### 2. Feature 레벨 오류 처리

```typescript
// features/stock-trading/model/error-handler.ts
export const handleTradingError = (error: ApiError) => {
  switch (error.code) {
    case 'INSUFFICIENT_FUNDS':
      // 잔액 부족 처리
      break;
    case 'MARKET_CLOSED':
      // 장 마감 처리
      break;
    default:
      // 일반 오류 처리
  }
};
```

## 테스트 전략

### 1. 단위 테스트

- **Entities**: 비즈니스 로직 및 데이터 변환 테스트
- **Features**: 기능별 상태 관리 및 API 호출 테스트
- **Shared**: 유틸리티 함수 및 공통 컴포넌트 테스트

### 2. 통합 테스트

- **Pages**: 페이지 레벨 컴포넌트 렌더링 테스트
- **Widgets**: 복합 UI 컴포넌트 상호작용 테스트
- **API**: 실제 API 엔드포인트와의 통합 테스트

### 3. E2E 테스트

- 주요 사용자 플로우 테스트
- 크로스 브라우저 호환성 테스트
- 성능 테스트

## 마이그레이션 전략

### 1. 점진적 마이그레이션 접근법

#### Phase 1: 기반 구조 설정
- FSD 디렉토리 구조 생성
- Shared 계층 마이그레이션
- 공통 타입 및 인터페이스 정의

#### Phase 2: Entities 마이그레이션
- 비즈니스 엔티티 추출 및 재구성
- 엔티티별 API 및 모델 분리
- 기존 코드에서 엔티티 참조 업데이트

#### Phase 3: Features 마이그레이션
- 기능별 코드 그룹화
- Feature 슬라이스 생성
- 기능 간 의존성 정리

#### Phase 4: Pages 및 Widgets 마이그레이션
- 페이지 컴포넌트 재구성
- 복합 UI 컴포넌트를 위젯으로 분리
- 라우팅 구조 업데이트

#### Phase 5: App 계층 설정
- 애플리케이션 초기화 로직 정리
- 전역 프로바이더 설정
- 최종 통합 테스트

### 2. 호환성 유지 전략

#### Import Path 매핑
```typescript
// 기존 import 경로 유지를 위한 re-export
// shared/legacy/index.ts
export * from '../ui';
export * from '../lib';
export * from '../api';
```

#### 점진적 타입 마이그레이션
```typescript
// 기존 타입과 새 타입 간 호환성 유지
export type LegacyUser = User; // 하위 호환성
```

### 3. 코드 품질 보장

#### ESLint 규칙
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // FSD 계층 의존성 규칙 강제
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/shared',
            from: './src',
            except: ['./shared']
          },
          // 추가 규칙들...
        ]
      }
    ]
  }
};
```

#### 아키텍처 테스트
```typescript
// tests/architecture.test.ts
describe('FSD Architecture', () => {
  it('should not import from upper layers', () => {
    // 계층 의존성 규칙 테스트
  });
  
  it('should not have circular dependencies', () => {
    // 순환 의존성 테스트
  });
});
```

## 성능 고려사항

### 1. 코드 분할

```typescript
// pages/stock-trading/index.tsx
const StockTradingPage = lazy(() => import('./ui/StockTradingPage'));
```

### 2. 번들 최적화

- Feature별 독립적인 번들링
- 공통 의존성 최적화
- Tree-shaking 최적화

### 3. 메모리 관리

- 상태 관리 최적화
- 컴포넌트 메모이제이션
- 이벤트 리스너 정리

## 문서화 전략

### 1. 아키텍처 가이드

- FSD 원칙 및 규칙 설명
- 계층별 역할 및 책임 정의
- 코드 구성 가이드라인

### 2. 개발 가이드

- 새 기능 추가 가이드
- 기존 코드 리팩토링 가이드
- 테스트 작성 가이드

### 3. 마이그레이션 가이드

- 단계별 마이그레이션 절차
- 문제 해결 가이드
- 체크리스트 및 검증 방법