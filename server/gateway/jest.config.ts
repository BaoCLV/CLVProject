// jest.config.js
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.', // Specifies the root of your project
    testMatch: ['<rootDir>/test/**/*.spec.ts'], // Includes tests from the 'test' directory
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest', // Handles TypeScript transformation
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'], // Only collect coverage from the 'src' directory
    coverageDirectory: './coverage', // Output directory for test coverage reports
    testEnvironment: 'node', // Uses Node.js as the test environment
  };
  