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
];

// --- 헬퍼 함수 ---

// 1. 프로젝트 파일 구조를 문자열로 가져오기 (Context Window 절약을 위해 파일명만)
async function getFileTree() {
  const files = await glob("**/*", {
    ignore: IGNORE_PATTERNS,
    nodir: true,
  });
  return files.join("\n");
}

// 2. Gemini 응답에서 JSON만 추출하기 (Markdown 코드 블록 제거)
function extractJson(text) {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", text);
    throw new Error("AI output was not valid JSON");
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
    { "files": ["src/components/Button.tsx", "src/utils/api.ts"] }
  `;

  const analyzeResult = await model.generateContent(analyzePrompt);
  const analyzeResponse = analyzeResult.response.text();
  const targetFiles = extractJson(analyzeResponse).files;

  console.log(`🎯 AI identified target files: ${targetFiles.join(", ")}`);

  let fileContext = "";
  for (const filePath of targetFiles) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      fileContext += `\n--- START OF FILE: ${filePath} ---\n${content}\n--- END OF FILE: ${filePath} ---\n`;
    } else {
      console.warn(`⚠️ File not found (AI hallucination?): ${filePath}`);
    }
  }

  console.log("✏️ Requesting code fixes from Gemini...");

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
    3. Return ONLY a JSON object where keys are file paths and values are the NEW full content of the file.
    
    Example Response:
    \`\`\`json
    {
      "src/components/Button.tsx": "import React from 'react'; ... (full updated code)",
      "src/utils/api.ts": "export const fetchData = ... (full updated code)"
    }
    \`\`\`
  `;

  const codingResult = await model.generateContent(codingPrompt);
  const codingResponse = codingResult.response.text();
  const modifiedFiles = extractJson(codingResponse);

  console.log("💾 Writing changes to disk...");

  const changedFilePaths = [];
  for (const [filePath, newContent] of Object.entries(modifiedFiles)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, {
        recursive: true,
      });

    fs.writeFileSync(filePath, newContent);
    changedFilePaths.push(filePath);
    console.log(`  - Updated: ${filePath}`);
  }

  if (changedFilePaths.length === 0) {
    console.log("🚫 No files were modified by AI. Exiting.");
    return;
  }

  console.log("🚀 Pushing changes and creating PR...");

  await git.add(changedFilePaths);
  await git.commit(`fix: resolve issue #${issueNumber} (by Gemini)`);
  await git.push("origin", branchName);

  try {
    const prBody = `
## 🤖 Gemini AI Auto-Fix
This PR was automatically generated to resolve #${issueNumber}.

### Modified Files
${changedFilePaths.map(f => `- \`${f}\``).join("\n")}

### Notes
Please review the changes carefully before merging.
    `;

    execSync(
      `gh pr create --title "fix: ${issueTitle}" --body "${prBody}" --head ${branchName} --base main --label "🤖 ai-fix"`,
      {
        stdio: "inherit",
      },
    );
    console.log("✅ PR Created successfully!");
  } catch (e) {
    console.error("⚠️ Failed to create PR (It might already exist or gh CLI error):", e.message);
  }
}

main().catch(err => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
