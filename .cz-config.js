module.exports = {
  types: [
    {
      value: "feat",
      name: "✨ feat:     새로운 기능 추가",
    },
    {
      value: "fix",
      name: "🐛 fix:      버그 수정",
    },
    {
      value: "refactor",
      name: "♻️  refactor: 코드 리팩토링 (기능 변화 없음)",
    },
    {
      value: "style",
      name: "💄 style:    코드 스타일 변경 (포맷팅, 세미콜론 등)",
    },
    {
      value: "test",
      name: "✅ test:     테스트 코드 추가 및 수정",
    },
    {
      value: "docs",
      name: "📝 docs:     문서 수정 (README 등)",
    },
    {
      value: "chore",
      name: "🔧 chore:    빌드 및 배포, 도구 설정 등 잡무",
    },
    {
      value: "hotfix",
      name: "🚑 hotfix:   프로덕션 긴급 수정",
    },
  ],
  scopes: [
    "auth",
    "api",
    "components",
    "utils",
    "hooks",
    "store",
    "styles",
    "ci",
    "deps",
    "docs",
    "tests",
    "config",
  ],
  allowCustomScopes: true,
  allowBreakingChanges: [
    "feat",
    "fix",
    "refactor",
  ],
  subjectLimit: 50,
  messages: {
    type: "변경 타입을 선택하세요:",
    scope: "변경 범위(scope)를 선택하세요 (옵션):",
    customScope: "사용자 정의 scope를 입력하세요:",
    subject: "커밋 제목을 작성하세요 (50자 이하):\n",
    body: "변경한 내용을 상세히 작성하세요 (옵션, Enter로 생략):\n",
    breaking: "BREAKING CHANGE가 있다면 설명을 작성하세요 (옵션):\n",
    footer: "관련 이슈를 입력하세요 (예: Closes #123, Fixes #456):\n",
    confirmCommit: "이 커밋 메시지로 커밋할까요?",
  },
};
