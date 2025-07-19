# Git Workflow Guide

### 목차
- [브랜치 전략](#브랜치-전략)
- [브랜치 명명 규칙](#브랜치-명명-규칙)
- [커밋 컨벤션](#커밋-컨벤션)
- [PR 가이드라인](#푸시-전략)
- [코드 리뷰 프로세스](#코드-리뷰-프로세스)
- [릴리스 프로세스](#릴리스-프로세스)
- [자동화 도구](#자동화-도구)

---

### 브랜치 전략

#### 메인 브랜치

- `main`: 프로덕션 환경 배포용 브랜치
- `develop`: 개발 통합 브랜치

#### 작업 브랜치

```
develop
├── feature/기능명          # 새로운 기능 개발
├── refactor/리팩토링명      # 코드 리팩토링
├── fix/버그명              # 버그 수정
├── hotfix/긴급수정명        # 프로덕션 긴급 수정
└── release/버전명          # 릴리스 준비
└── docs/문서명             # 문서 작업
└── test/테스트명           # 테스트 코드 작성
```

#### 브랜치 생명주기

1. **feature/refactor/fix/docs/test**: `develop` -> 작업 -> `develop`
2. **release**: `develop` -> 릴리즈 준비 -> `main` & `develop`
3. **hotfix**: `main` -> 긴급 수정 -> `main` & `develop`

---

### 브랜치 명명 규칙

#### 기본 패턴

```
{type}/{scope}-{description}
```

#### 타입별 접두사

| 타입      | 용도 설명             | 예시                          |
|-----------|----------------------|-------------------------------|
| feature   | 새로운 기능 개발       | `feature/student-authentication` |
| refactor  | 리팩토링 작업         | `refactor/component-structure`|
| fix       | 버그 수정            | `fix/api-error-handling`      |
| hotfix    | 긴급 버그 수정        | `hotfix/payment-critical-bug` |
| release   | 릴리스 준비          | `release/v1.2.0`              |
| docs      | 문서 작업            | `docs/api-documentation`      |
| test      | 테스트 코드 작성      | `test/component-unit-tests`   |

---

### 커밋 컨벤션

#### 커밋 메시지 형식

```
<type 타입>(<scope 영역>): <subject 주제>

<본문 - body>

<푸터 - footer>
```

#### 타입별 분류

| 타입      | 설명                 | 예시                                                        |
|-----------|----------------------|-------------------------------------------------------------|
| `feat`    | 새로운 기능 추가      | `feat(auth): 사용자 로그인 기능 추가`                 |
| `fix`     | 버그 수정             | `fix(api): 네트워크 타임아웃 오류 처리`                  |
| `refactor`| 코드 리팩토링         | `refactor(components): 아토믹 디자인 구조로 리팩토링`     |
| `style`   | 코드 스타일 변경      | `style: 프리티어 포맷 적용`                         |
| `test`    | 테스트 코드 추가/수정 | `test(utils): 날짜 포맷터에 대한 단위 테스트 추가`           |
| `docs`    | 문서 수정             | `docs(readme): 설치 가이드 업데이트`                  |
| `chore`   | 빌드/환경설정 수정    | `chore: vite 설정 업데이트`                             |
| `hotfix`  | 긴급 버그 수정        | `hotfix: 프로덕션 치명적 버그 수정`                      |

#### 커밋 메시지 작성 규칙

1. **타입 선택**
   - `feat`: 새로운 기능 추가
   - `fix`: 버그 수정
   - `refactor`: 코드 리팩토링
   - `style`: 코드 스타일 변경
   - `test`: 테스트 코드 추가/수정
   - `docs`: 문서 수정
   - `chore`: 빌드/환경설정 수정
   - `hotfix`: 프로덕션 치명적 버그 수정

2. **scope**
   - 관련된 모듈이나 컴포넌트를 명시
   - 예: `auth`, `components`, `utils`

3. **subject**
   - 커밋의 주제를 간략하게 설명
   - 예: `feat(auth): 사용자 로그인 기능 추가`
   - 50자 이하로 작성

4. **body**
   - 무엇을 왜 변경했는지, 어떻게 구현했는지 설명
   - 커밋의 상세 내용 제공
   - 구현한 기능의 흐름 설명
   - 기술적 고려사항, 제한 사항
   - 이전 방식과 달라진 점
   - 테스트나 관련 이슈

5. **footer**
   - 관련 이슈, 브레이킹 체인지, 릴리즈 노트 등에 포함할 메타 정보
   - BREAKING CHANGE: 기존과 호환되지 않는 변경
   - Closes #123: 이 커밋이 해결하는 이슈 번호
   - Reviewed-by:, Co-authored-by: 등 협업 관련 정보

#### 커밋 메시지 예시

```
feat(auth): 사용자 로그인 기능 추가

- 로그인 폼 구현 및 JWT 토큰 처리
- Axios 인터셉터로 인증 헤더 자동 추가
- 기존 로컬 스토리지 방식 제거 후 쿠키 기반으로 전환

BREAKING CHANGE: 기존 인증 방식이 완전히 제거되어, 이전 버전과 호환되지 않습니다.
Closes #101
```

---

### PR 가이드라인

#### PR 제목 형식
```
[Type] 간략한 설명
```

#### PR 템플릿
```
## #️⃣연관된 이슈

> ex) #이슈번호, #이슈번호

## 📝작업 내용

> 이번 PR에서 작업한 내용을 간략히 설명해주세요(이미지 첨부 가능)

### 스크린샷 (선택)

## 💬리뷰 요구사항(선택)

> 리뷰어가 특별히 봐주었으면 하는 부분이 있다면 작성해주세요
>
> ex) 메서드 XXX의 이름을 더 잘 짓고 싶은데 혹시 좋은 명칭이 있을까요?
```

---

### 코드 리뷰 프로세스

#### 리뷰어 배정

- 1명 이상: feature, fix, refactor, docs, test
- 2명 이상: main 브랜치 머지
- 팀 리드: 아키텍처 변경 시

#### 리뷰 체크리스트

- [ ] 코딩 컨벤션 준수
- [ ] 테스트 코드 포함
- [ ] 성능 영향도 검토
- [ ] 보안 이슈 확인
- [ ] 문서 업데이트 여부
- [ ] 코드 가독성 및 유지보수성

---

### 릴리스 프로세스

#### 1. 릴리스 브랜치 생성

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

#### 2. 릴리스 준비

- 버전 번호 업데이트
- CHANGELOG.md 업데이트
- 최종 테스트 및 버그 수정

#### 3. 릴리스 완료

```bash
# main 브랜치로 머지
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"

# develop 브랜치로 머지
git checkout develop
git merge --no-ff release/v1.2.0

# 릴리스 브랜치 삭제
git branch -d release/v1.2.0
```

#### 4. 배포

- CI/CD 파이프라인 실행
- 배포 상태 모니터링
- 롤백 계획 준비

---

### 자동화 도구

#### Git Hooks

```bash
# pre-commit: 커밋 전 검증
yarn run lint
yarn run test

# commit-msg: 커밋 메시지 검증
commitizen을 사용하여 컨벤션 준수
```

### 참고 자료

#### 도구 및 라이브러리

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Git Flow](https://github.com/nvie/gitflow)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Husky](https://github.com/typicode/husky)

#### 팀 문서

- [개발 환경 설정]()
- [아키텍처 가이드]()
- [기여 가이드]()

---

📝 문서 업데이트: 이 문서는 팀의 성장과 함께 지속적으로 업데이트됩니다.
📞 문의사항: Git 워크플로우 관련 질문은 [팀 리드](https://github.com/jidohyun)에게 문의해주세요.