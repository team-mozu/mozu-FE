# FSD Architecture - Admin Package

## Feature-Sliced Design 구조

```
src-fsd/
├── app/            # 애플리케이션 레이어 - 초기화 로직
│   ├── providers/  # 글로벌 프로바이더 (인증, 쿼리 클라이언트, 테마)
│   ├── router/     # 라우팅 설정
│   └── store/      # 글로벌 스토어 설정
├── pages/          # 페이지 레이어 - 라우트 컴포넌트
│   ├── signIn/     # 로그인 페이지
│   ├── stockManagement/     # 주식 관리 페이지들
│   ├── articleManagement/   # 기사 관리 페이지들
│   ├── classManagement/     # 수업 관리 페이지들
│   └── monitoring/          # 모니터링 페이지
├── widgets/        # 위젯 레이어 - 비즈니스 로직 컨테이너
│   ├── stockTable/         # 주식 테이블 위젯
│   ├── articleTable/       # 기사 테이블 위젯
│   ├── classTable/         # 수업 테이블 위젯
│   └── monitoringDashboard/ # 모니터링 대시보드
├── features/       # 피처 레이어 - 사용자 상호작용
│   ├── authentication/     # 로그인/로그아웃 기능
│   ├── stockCRUD/         # 주식 CRUD 작업
│   ├── articleCRUD/       # 기사 CRUD 작업
│   ├── classCRUD/         # 수업 CRUD 작업
│   └── monitoring/        # 모니터링 기능
├── entities/       # 엔티티 레이어 - 비즈니스 엔티티
│   ├── user/       # 사용자 엔티티 (타입, API, 스토어)
│   ├── stock/      # 주식 엔티티
│   ├── article/    # 기사 엔티티
│   ├── class/      # 수업 엔티티
│   └── monitoring/ # 모니터링 엔티티
└── shared/         # 공유 레이어 - 재사용 가능한 코드
    ├── api/        # API 설정 및 기본 클라이언트
    ├── ui/         # 공유 UI 컴포넌트
    ├── lib/        # 외부 라이브러리 설정
    ├── config/     # 설정 파일들
    └── types/      # 공유 TypeScript 타입
```

## FSD 원칙

1. **단방향 의존성**: 상위 레이어는 하위 레이어에만 의존
2. **비즈니스 로직 격리**: 각 레이어는 명확한 책임을 가짐
3. **재사용성**: shared 레이어를 통한 코드 재사용
4. **확장성**: 새로운 기능 추가가 용이한 구조

## 마이그레이션 매핑

### Current → FSD
- `apis/` → `entities/{domain}/api/` + `shared/api/`
- `components/common/` → `shared/ui/`
- `components/{domain}/` → `widgets/{domain}/` + `features/{domain}/`
- `hooks/` → `shared/lib/hooks/` + `entities/{domain}/lib/`
- `pages/` → `pages/{domain}/`
- `store/` → `app/store/` + `entities/{domain}/model/`
- `utils/` → `shared/lib/`
- `router.tsx` → `app/router/`