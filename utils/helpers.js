// The formula for the line of best fit (y = mx + b) comes from the following equations:
// m = (nΣxy - ΣxΣy) / (nΣx^2 - (Σx)^2)    * Slope
// b = (Σy - mΣx) / n                      * Y-Intercept
// Where:
// n = represents the number of points
// Σx = sum of x-coordinates
// Σy = sum of y-coordinates
// Σxy = sum of the product of x and y coordinates
// Σx^2 = sum of the squares of x-coordinates
// From the Square Least method

const db = require("../models")

const calculateBestFitLine = (points) => {
	let n = points.length
	let sumX = 0,
		sumY = 0,
		sumXY = 0,
		sumX2 = 0

	points.forEach((point) => {
		let x = point.x
		let y = point.y
		sumX += x
		sumY += y
		sumXY += x * y
		sumX2 += x * x
	})

	let m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
	let b = (sumY - m * sumX) / n

	return { m, b }
}

const createQuestion = async (numOfCoordinates) => {
	const coordinates = []
	for (let i = 0; i < numOfCoordinates; i++) {
		const maxNum = 10
		const minNum = 0
		const randomX = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
		const randomY = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum

		coordinates.push({
			x: randomX,
			y: randomY,
		})
	}

	const { m, b } = calculateBestFitLine(coordinates)

	// Construct the correct answer as a string in the format "y=mx+b"
	// m represents the slope of the line, and b represents the Y-intercept
	const correctAnswer = `y=${m.toFixed(2)}x+${b.toFixed(2)}`

	const question = {
		coordinates,
		correctAnswer,
	}

	const generatedQuestion = await db.Question.create(question)
	return generatedQuestion
}

module.exports = { createQuestion }
