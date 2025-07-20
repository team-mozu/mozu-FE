#!/bin/bash

# 브랜치 타입 목록
BRANCH_TYPES=("feature" "refactor" "fix" "hotfix" "release" "docs" "test")

# 타입 선택 프롬프트
echo "새 브랜치의 타입을 선택하세요:"
select branch_type in "${BRANCH_TYPES[@]}"; do
  if [[ -n "$branch_type" ]]; then
    break
  else
    echo "잘못된 선택입니다. 다시 시도하세요."
  fi
done

# 설명 입력 프롬프트
read -p "브랜치 설명을 입력하세요 (예: student-authentication): " branch_description

# 브랜치 이름 생성
branch_name="${branch_type}/${branch_description}"

# 브랜치 생성 및 체크아웃
git checkout -b "$branch_name"

echo ""
echo "✅ 브랜치 '$branch_name'이(가) 생성되었습니다."
