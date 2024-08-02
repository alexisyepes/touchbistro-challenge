const express = require("express")
const router = express.Router()
const db = require("../models")
const { createQuestion } = require("../utils/helpers")
const { Op } = require("sequelize")

// POST /api/submit
// Route to handle questions use or creation
router.post("/generate", async (req, res) => {
	try {
		const { studentId, questionId } = req.body

		let generatedQuestion = null

		if (!studentId) {
			// If no studentId is provided, generate a new question (when app loads)
			generatedQuestion = await createQuestion(5)
			return res.status(200).json({ question: generatedQuestion })
		}

		const answeredQuestionIds = await db.Submission.findAll({
			where: { studentId },
			attributes: ["questionId"],
			raw: true,
		}).then((submissions) => submissions.map((sub) => sub.questionId))

		const availableQuestion = await db.Question.findOne({
			where: {
				id: {
					[Op.notIn]: answeredQuestionIds.length ? answeredQuestionIds : [-1],
				},
			},
		})

		if (!availableQuestion) {
			generatedQuestion = await createQuestion(5)
		} else {
			generatedQuestion = availableQuestion
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
