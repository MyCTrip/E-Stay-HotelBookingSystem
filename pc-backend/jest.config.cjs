module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};