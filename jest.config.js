/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  maxWorkers: 1,
  verbose: false,
  preset: 'ts-jest',
  testTimeout: 8000,
  openHandlesTimeout: 1000,
  workerIdleMemoryLimit: '512MB',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/jest/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './jest/tsconfig.json' }],
  },
  roots: ['<rootDir>/src', '<rootDir>/jest'],
};
