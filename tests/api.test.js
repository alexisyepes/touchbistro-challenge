const request = require("supertest")
const express = require("express")
const router = require("../routes/questions")
const db = require("../models")
const { createQuestion } = require("../utils/helpers")

jest.mock("../models")
jest.mock("../utils/helpers", () => ({
	createQuestion: jest.fn(),
}))

const app = express()
app.use(express.json())
app.use("/api", router)

describe("POST /api/generate", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("should return a new question when no studentId is provided", async () => {
		const mockCoordinates = [
			{ x: 1, y: 2 },
			{ x: 2, y: 3 },
			{ x: 3, y: 4 },
			{ x: 4, y: 5 },
			{ x: 5, y: 6 },
		]

		const mockGeneratedQuestion = {
			id: 1,
			coordinates: mockCoordinates,
			correctAnswer: "y=1.00x+1.00",
			lineOfBestFitPoints: {
				m: "1.00",
				b: "1.00",
			},
		}

		createQuestion.mockResolvedValue(mockGeneratedQuestion)

		const res = await request(app).post("/api/generate").send({})

		expect(res.statusCode).toBe(200)
		expect(res.body.question).toHaveProperty("id", 1)
		expect(res.body.question.coordinates).toEqual(mockCoordinates)
		expect(res.body.question).toHaveProperty("correctAnswer", "y=1.00x+1.00")
	})

	it("should return an existing question when unanswered questions are available", async () => {
		db.Submission.findAll.mockResolvedValue([{ questionId: 1 }])
		db.Question.findOne.mockResolvedValue({
			id: 2,
			coordinates: [
				{ x: 2, y: 4 },
				{ x: 3, y: 6 },
			],
			correctAnswer: "y=2.00x+0.00",
			lineOfBestFitPoints: {
				m: "2.00",
				b: "0.00",
			},
		})

		const res = await request(app)
			.post("/api/generate")
			.send({ studentId: 123 })

		expect(res.statusCode).toBe(200)
		expect(res.body.question).toHaveProperty("id", 2)
		expect(res.body.question.coordinates).toEqual([
			{ x: 2, y: 4 },
			{ x: 3, y: 6 },
		])
		expect(res.body.question).toHaveProperty("correctAnswer", "y=2.00x+0.00")
	})

	it("should return a new question if no unanswered questions are found", async () => {
		db.Submission.findAll.mockResolvedValue([{ questionId: 1 }])
		db.Question.findOne.mockResolvedValue(null)

		const mockCoordinates = [
			{ x: 1, y: 3 },
			{ x: 2, y: 5 },
			{ x: 3, y: 7 },
			{ x: 4, y: 9 },
			{ x: 5, y: 11 },
		]

		const mockGeneratedQuestion = {
			id: 3,
			coordinates: mockCoordinates,
			correctAnswer: "y=2.00x+1.00",
			lineOfBestFitPoints: {
				m: "2.00",
				b: "1.00",
			},
		}

		createQuestion.mockResolvedValue(mockGeneratedQuestion)

		const res = await request(app)
			.post("/api/generate")
			.send({ studentId: 123 })

		expect(res.statusCode).toBe(200)
		expect(res.body.question).toHaveProperty("id", 3)
		expect(res.body.question.coordinates).toEqual(mockCoordinates)
		expect(res.body.question).toHaveProperty("correctAnswer", "y=2.00x+1.00")
	})

	it("should return a 500 error if an exception is thrown", async () => {
		db.Submission.findAll.mockRejectedValue(new Error("Database error"))

		const res = await request(app)
			.post("/api/generate")
			.send({ studentId: 123 })

		expect(res.statusCode).toBe(500)
		expect(res.body).toHaveProperty(
			"error",
			"An error occurred while generating a question."
		)
	})
})
