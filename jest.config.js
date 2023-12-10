module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [`/node_modules/(?!lodash|nanoid)`],
  setupFilesAfterEnv: ["./setupTests.js"],
};
