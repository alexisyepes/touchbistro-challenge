const express = require("express")
const router = express.Router()
const db = require("../models")
const { createQuestion } = require("../utils/helpers")

// POST /api/submit
// Route to handle questions use or creation
router.post("/generate", async (req, res) => {
	try {
		const { studentId, questionId } = req.body
		const availableQuestions = await db.Question.findAll()
		console.log("avail question", availableQuestions)

		let generatedQuestion = null

		if (!availableQuestions.length) {
			generatedQuestion = await createQuestion(5)
			return res.status(200).json({ question: generatedQuestion })
		}

		let submission = await db.Submission.findOne({
			where: { studentId, questionId },
		})

		if (submission) {
			// If student already used this question... generate a new question
			generatedQuestion = await createQuestion(5)
		} else {
			// Use an existing question that has not been used by this student
			const allQuestions = await db.Question.findAll()
			generatedQuestion = allQuestions[0]
		}

		return res.status(200).json({ question: generatedQuestion })
	} catch (error) {
		console.error("Error on the question's generation process:", error)
		return res
			.status(500)
			.json({ error: "An error occurred while generating a question." })
	}
})

module.exports = router
