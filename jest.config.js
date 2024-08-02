module.exports = {
	testEnvironment: "node",
	roots: ["<rootDir>/tests"],
	setupFilesAfterEnv: ["<rootDir>/tests/api.test.js"],
	moduleDirectories: ["node_modules", "<rootDir>/"],
	testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"!**/node_modules/**",
		"!**/vendor/**",
	],
}
