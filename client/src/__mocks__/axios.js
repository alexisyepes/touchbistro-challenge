const mockAxios = {
	post: jest.fn(() => Promise.resolve({ data: {} })),
	get: jest.fn(() => Promise.resolve({ data: {} })),
	// Add other axios methods if needed
}

module.exports = mockAxios
