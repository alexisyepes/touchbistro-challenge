const express = require("express")
const router = express.Router()
const db = require("../models")
const {
	INCORRECT_ANSWER_MSG,
	CORRECT_ANSWER_MSG,
} = require("../utils/constants")

// POST /api/submit
// Route to handle student submission
router.post("/submit", async (req, res) => {
	try {
		const { studentName, questionId, answer } = req.body

		// Find or create the student by name
		let student = await db.Student.findOne({ where: { name: studentName } })
		if (!student) {
			student = await db.Student.create({ name: studentName })
		}

		// Find the question by ID
		const question = await db.Question.findByPk(questionId)
		if (!question) {
			return res.status(404).json({ error: "Question not found" })
		}

		// Check if the student's answer matches the correct answer
		const isCorrect = answer === question.correctAnswer

		// Create a submission record
		const submission = await db.Submission.create({
			studentId: student.id,
			questionId: question.id,
			answer: answer,
			isCorrect: isCorrect,
		})

		if (isCorrect) {
			return res.status(200).json({ message: CORRECT_ANSWER_MSG, submission })
		} else {
			return res.status(200).json({ message: INCORRECT_ANSWER_MSG, submission })
		}
	} catch (error) {
		console.error("Error handling submission:", error)
		return res
			.status(500)
			.json({ error: "An error occurred while submitting your answer." })
	}
})

module.exports = router
