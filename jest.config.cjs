module.exports = {
  "testPathIgnorePatterns": [
    "/node_modules/",
    "<rootDir>/test"
  ],
  "collectCoverageFrom": [
    "src/**/*.{mjs,js,jsx,ts,tsx}",
    "!**/*.d.ts"
  ],
  "setupFiles": [
    "<rootDir>/test/bootstrap.cjs"
  ],
  "testEnvironmentOptions": {
    "url": "http://localhost:8080"
  },
  "moduleNameMapper": {
    "^(.*).js$": "$1"
  },
  "transform": {
    "\\.[jt]sx?$": [
      "babel-jest",
      {
        "configFile": "./test/babel.config.cjs"
      }
    ]
  }
};
