import "./App.css"
import { useEffect, useState, useRef } from "react"
import * as d3 from "d3"
import axios from "axios"
import Input from "./components/input"

function App() {
	const [numOfAttempts, setNumOfAttempts] = useState(0)
	const [questionId, setQuestionId] = useState(null)
	const [studentId, setStudentId] = useState(null)
	const [correctAnswer, setCorrectAnswer] = useState("")
	const [answerMsg, setAnswerMsg] = useState("")
	const [formData, setFormData] = useState({ name: "", answer: "" })
	const [data, setData] = useState(null)
	const [error, setError] = useState("")
	const [countdown, setCountdown] = useState(null)
	const [wasAnswerCorrect, setWasAnswerCorrect] = useState(false)

	const svgRef = useRef()

	useEffect(() => {
		getQuestion()
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (numOfAttempts > 0 && numOfAttempts < 3) {
			setWasAnswerCorrect(false)
			setAnswerMsg(`Incorrect. Try again!`)
		} else if (numOfAttempts === 3) {
			setWasAnswerCorrect(false)
			drawChart(data, true)
			setNumOfAttempts(0)
			setAnswerMsg(`Incorrect! The right answer was ${correctAnswer}`)
			startCountdown()
		}
		// eslint-disable-next-line
	}, [numOfAttempts, correctAnswer, data])

	const startCountdown = () => {
		let seconds = 12
		setCountdown(seconds)
		const interval = setInterval(() => {
			seconds -= 1
			setCountdown(seconds)
			if (seconds <= 0) {
				clearInterval(interval)
				getQuestion()
				setAnswerMsg("")
				setFormData((prevFormData) => ({
					...prevFormData,
					answer: "",
				}))
			}
		}, 1000)
	}

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const validateAnswerFormat = (answer) => {
		const regex = /^y=-?\d+(\.\d+)?x[+-]\d+(\.\d+)?$/
		return regex.test(answer.trim())
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!formData.answer) {
			return
		}

		if (!validateAnswerFormat(formData.answer)) {
			setError(
				"Invalid answer format. Please enter in the format y=mx+b (e.g., y=0.62x+2.75) without any spaces."
			)
			return
		} else {
			setError("")
			const obj = {
				studentName: formData.name,
				questionId,
				answer: formData.answer,
			}
			const response = await axios.post("/api/students/submit", obj)
			setStudentId(response.data.submission.studentId)
			setQuestionId(response.data.submission.questionId)

			if (response.data.message === "Correct!") {
				setWasAnswerCorrect(true)
				setAnswerMsg(`Correct! The answer is ${correctAnswer}`)
				drawChart(data, true)
				setNumOfAttempts(0)
				startCountdown()
			} else {
				setNumOfAttempts((prevAttempts) => prevAttempts + 1)
			}
		}
	}

	const getQuestion = async () => {
		try {
			const obj = {
				questionId: questionId || null,
				studentId: studentId || null,
			}
			const response = await axios.post("/api/questions/generate", obj)

			if (response.data && response.data.question) {
				const newQuestion = response.data.question
				setData(newQuestion)
				setQuestionId(newQuestion.id)
				setCorrectAnswer(newQuestion.correctAnswer)
				drawChart(newQuestion)
			} else {
				console.error("Failed to get a question.")
			}
		} catch (error) {
			console.error("Error fetching question:", error)
		}
	}

	const drawChart = (data, showLine = false) => {
		const w = 400
		const h = 300
		const svg = d3
			.select(svgRef.current)
			.attr("width", w)
			.attr("height", h)
			.style("overflow", "visible")
			.style("margin-top", "30px")

		const xScale = d3.scaleLinear().domain([0, 12]).range([0, w])
		const yScale = d3.scaleLinear().domain([0, 12]).range([h, 0])

		const xAxis = d3.axisBottom(xScale).ticks(12)
		const yAxis = d3.axisLeft(yScale)
		svg.selectAll("*").remove()
		svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`)
		svg.append("g").call(yAxis)

		svg
			.append("text")
			.attr("x", w / 2)
			.attr("y", h + 40)
			.text("x")
		svg
			.append("text")
			.attr("y", h / 2)
			.attr("x", -40)
			.text("y")

		const points = data.coordinates.map((point) => [point.x, point.y])
		svg
			.selectAll("circle")
			.data(points)
			.enter()
			.append("circle")
			.attr("cx", (d) => xScale(d[0]))
			.attr("cy", (d) => yScale(d[1]))
			.attr("r", 2)

		if (showLine) {
			const { m, b } = data.lineOfBestFitPoints
			const x1 = 0
			const y1 = m * x1 + parseFloat(b)
			const x2 = 12
			const y2 = m * x2 + parseFloat(b)

			svg
				.append("line")
				.attr("x1", xScale(x1))
				.attr("y1", yScale(y1))
				.attr("x2", xScale(x2))
				.attr("y2", yScale(y2))
				.attr("stroke", "blue")
				.attr("stroke-width", 2)
		}
	}

	return (
		<div>
			<div className="my-5 text-center pb-4">
				<h3>
					What's the line of best fit?{" "}
					<span className="h5">
						{numOfAttempts < 3 && `Number of tries: ${numOfAttempts}`}
					</span>
				</h3>
				{answerMsg && (
					<h4 className={wasAnswerCorrect ? "text-success" : "text-danger"}>
						{answerMsg}
					</h4>
				)}
				{countdown > 0 && (
					<h4>Generating a new question in {countdown} seconds...</h4>
				)}
				{data && data.coordinates && (
					<div className="d-flex justify-content-center">
						{data.coordinates.map((point, index) => (
							<div className="border p-1 mx-2" key={index}>
								<strong>X:</strong> {point.x}, <strong>Y:</strong> {point.y}
							</div>
						))}
					</div>
				)}
				<svg ref={svgRef}></svg>
			</div>
			<form className="border p-5" onSubmit={handleSubmit}>
				<div className="d-flex justify-content-evenly">
					<Input
						label="Student Name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter your name"
						required
					/>
					<Input
						type="text"
						label="Answer (rounded to 2 decimal places)"
						name="answer"
						value={formData.answer}
						onChange={handleChange}
						placeholder="Type your answer in this format: y=mx+b "
						required
						error={error}
					/>
				</div>
				<div className="text-center">
					<button
						disabled={countdown}
						className="btn btn-primary mt-4"
						type="submit"
					>
						Submit Answer
					</button>
				</div>
			</form>
			<h6 className="text-center mt-4">By Alexis Yepes Sanabria 2024</h6>
		</div>
	)
}

export default App
