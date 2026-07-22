/** @type { import('jest').Config } */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/interface/**',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'babel-jest',
    '^.+\\.mjs?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@iconsauce/)',
  ],
  testRegex: [
    '([a-z/.]{1,}).test.ts$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
}
