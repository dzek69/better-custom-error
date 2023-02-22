module.exports = {
    // testMatch: [],
    testPathIgnorePatterns: [
        "/node_modules/",
        "<rootDir>/test",
    ],
    collectCoverageFrom: [
        'src/**/*.{mjs,js,jsx,ts,tsx}',
        '!**/*.d.ts'
    ],
    setupFiles: [
        '<rootDir>/test/bootstrap.cjs'
    ],
    testEnvironmentOptions: {
        url: "http://localhost:8080",
    },
    moduleNameMapper: {
        '^(.*)\.js$': '$1',
    },
};


