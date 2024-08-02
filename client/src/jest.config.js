module.exports = {
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/(?!(d3|@babel/runtime)/)"],
	moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
	testEnvironment: "jsdom",
}
