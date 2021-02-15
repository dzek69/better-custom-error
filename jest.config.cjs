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
    testURL: 'http://localhost:8080',
    moduleNameMapper: {
        '^(.*)\.js$': '$1',
    },
};


