export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true
        }],
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/test/**',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testTimeout: 30000,
};
