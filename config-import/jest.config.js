/** @type { import('ts-jest/dist/types').InitialOptionsTsJest } */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.mjs?$': 'babel-jest',
  },
  testRegex: [
    '([a-z/.]{1,}).test.ts$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
}
