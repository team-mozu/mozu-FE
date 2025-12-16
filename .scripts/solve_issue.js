const { GoogleGenerativeAI } = require("@google/generative-ai");
const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const { glob } = require("glob");
const { execSync } = require("child_process");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
const git = simpleGit();

const IGNORE_PATTERNS = [
  "node_modules/**",
  ".git/**",
  "dist/**",
  "build/**",
  "package-lock.json",
  "yarn.lock",
  "**/*.png",
  "**/*.jpg",
  "**/*.ico",
  "**/*.svg",
];

async function getFileTree() {
  const files = await glob("**/*", {
    ignore: IGNORE_PATTERNS,
    nodir: true,
  });
  return files.join("\n");
}

// [수정 2] 긴 코드 생성 시 JSON 깨짐 방지를 위한 커스텀 파서
function parseFileResponse(text) {
  const files = {};
  // 정규식으로 --- START_FILE: 경로 --- 와 --- END_FILE --- 사이의 내용을 추출
  const regex = /--- START_FILE: (.+?) ---\n([\s\S]*?)\n--- END_FILE ---/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2];
    files[filePath] = content;
  }
  return files;
}

// 1단계(파일 목록)는 단순하므로 JSON 파싱 유지
function extractJson(text) {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("JSON parsing failed in analysis phase. Trying raw fallback if applicable.");
    return {
      files: [],
    };
  }
}

async function main() {
  const issueNumber = process.env.ISSUE_NUMBER;
  const issueTitle = process.env.ISSUE_TITLE;
  const issueBody = process.env.ISSUE_BODY;
  const branchName = `ai-fix/issue-${issueNumber}`;

  console.log(`🤖 Starting Gemini Agent for Issue #${issueNumber}...`);

  try {
    await git.checkoutLocalBranch(branchName);
    console.log(`✅ Created branch: ${branchName}`);
  } catch (e) {
    await git.checkout(branchName);
    console.log(`ℹ️ Switched to existing branch: ${branchName}`);
  }

  console.log("🔍 Analyzing file structure...");
  const fileTree = await getFileTree();

  const analyzePrompt = `
    You are a Senior Software Engineer.
    Here is a GitHub Issue that needs to be resolved:
    
    [Issue Title]: ${issueTitle}
    [Issue Description]: ${issueBody}

    Here is the project file structure:
    ${fileTree}

    Based on the issue, identify which files need to be modified or read to understand the context.
    Return ONLY a JSON object with a key "files" containing an array of file paths.
    
    Example:
    \`\`\`json
    { "files": ["src/components/Button.tsx", "src/utils/api.ts"] }
    \`\`\`
  `;

  const analyzeResult = await model.generateContent(analyzePrompt);
  const analyzeResponse = analyzeResult.response.text();

  let targetFiles = [];
  try {
    targetFiles = extractJson(analyzeResponse).files || [];
  } catch (e) {
    console.error("Failed to parse target files from AI response.");
  }

  if (targetFiles.length === 0) {
    console.log("⚠️ No specific files identified. Exiting.");
    return;
  }

  console.log(`🎯 AI identified target files: ${targetFiles.join(", ")}`);

  let fileContext = "";
  for (const filePath of targetFiles) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      fileContext += `\nFile: ${filePath}\n\`\`\`\n${content}\n\`\`\`\n`;
    } else {
      console.warn(`⚠️ File not found (AI hallucination?): ${filePath}`);
    }
  }

  console.log("✏️ Requesting code fixes from Gemini...");

  // [수정 3] 프롬프트에서 JSON 대신 구분자 포맷 요청
  const codingPrompt = `
    You are an expert developer. Fix the issue based on the provided file contents.

    [Issue Info]
    Title: ${issueTitle}
    Description: ${issueBody}

    [File Context]
    ${fileContext}

    [Instructions]
    1. Modify the code to resolve the issue.
    2. Ensure the code is production-ready and follows the existing style.
    3. IMPORTANT: Use the following format for your response. Do NOT use JSON.
    
    Format:
    --- START_FILE: path/to/file ---
    (Put the FULL updated file content here)
    --- END_FILE ---

    Example:
    --- START_FILE: src/App.tsx ---
    import React from 'react';
    export const App = () => <div>Hello</div>;
    --- END_FILE ---
  `;

  const codingResult = await model.generateContent(codingPrompt);
  const codingResponse = codingResult.response.text();

  // 변경된 파서 사용
  const modifiedFiles = parseFileResponse(codingResponse);

  console.log("💾 Writing changes to disk...");

  const changedFilePaths = [];
  for (const [filePath, newContent] of Object.entries(modifiedFiles)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, {
        recursive: true,
      });

    // trim()으로 앞뒤 공백 제거하여 깔끔하게 저장
    fs.writeFileSync(filePath, newContent.trim());
    changedFilePaths.push(filePath);
    console.log(`  - Updated: ${filePath}`);
  }

  if (changedFilePaths.length === 0) {
    console.log("🚫 No files were modified by AI. (Parsing failed or no output).");
    console.log("Debug AI Response:\n", codingResponse);
    return;
  }

  console.log("🚀 Pushing changes and creating PR...");

  await git.add(changedFilePaths);
  await git.commit(`fix: resolve issue #${issueNumber} (by Gemini)`);
  await git.push("origin", branchName);

  try {
    const prBody = `
# 🤖 AI Auto-Fix

> **Automatically generated by Gemini 1.5 Flash**

## 📋 Summary
This PR was created to automatically resolve the following issue:
**Closes #${issueNumber}**

### 📌 Issue Details
- **Title:** ${issueTitle}

<details>
<summary><b>📄 Issue Description</b> (Click to expand)</summary>

${issueBody}

</details>

---

## 📝 Changes Made
<details>
<summary><b>${changedFilePaths.length} file(s) modified</b> (click to expand)</summary>

${changedFilePaths.map(f => `- \`${f}\``).join("\n")}
</details>

---

## ✅ Review Checklist
- [ ] The code changes correctly address the issue
- [ ] No unintended side effects are introduced
- [ ] Tests pass (if applicable)

---
<sub>🤖 Generated with ❤️ by Gemini AI</sub>
      `;

    // PR 본문을 파일로 저장 (이스케이프 문제 방지)
    const prBodyPath = "pr_body.md";
    fs.writeFileSync(prBodyPath, prBody);

    execSync(
      `gh pr create --title "fix: ${issueTitle}" --body-file "${prBodyPath}" --head ${branchName} --base main --label "🤖 ai-fix"`,
      {
        stdio: "inherit",
      },
    );
    console.log("✅ PR Created successfully!");

    // 임시 파일 삭제
    fs.unlinkSync(prBodyPath);
  } catch (e) {
    console.error("⚠️ Failed to create PR (It might already exist or gh CLI error):", e.message);
  }
}

main().catch(err => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
