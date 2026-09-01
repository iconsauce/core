/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/config/interface/**'],
  coverageThreshold: {
    './src/config/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  testRegex: [
    '([a-z/.]{1,}).test.ts$',
  ],
  transformIgnorePatterns: ['node_modules/(?!svgicons2svgfont|svg-pathdata|yerror)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
}
