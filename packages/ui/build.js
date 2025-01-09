const { execSync } = require('child_process');

// TypeScript 빌드
execSync('yarn tsc', { stdio: 'inherit' });

// CSS 빌드 (추가적으로 빌드가 필요할 경우)
execSync('yarn build:css', { stdio: 'inherit' });
