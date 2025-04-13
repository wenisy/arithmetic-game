module.exports = {
  // 使用 babel-jest 转换 JavaScript/TypeScript 文件
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // 指定需要转换的 node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library/dom|@testing-library/react)/).+\\.js$'
  ],
  // 测试环境
  testEnvironment: 'jsdom',
  // 覆盖率收集
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts'
  ],
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
  // 覆盖率报告目录
  coverageDirectory: 'coverage'
};
