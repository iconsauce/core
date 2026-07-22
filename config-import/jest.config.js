/** @type { import('jest').Config } */
module.exports = {
  collectCoverage: true,
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
