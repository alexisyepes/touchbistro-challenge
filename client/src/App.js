import "./App.css"
import { useEffect, useState, useRef } from "react"
import * as d3 from "d3"
import axios from "axios"
import Input from "./components/input"

function App() {
	const [data, setData] = useState([])
	const [studentId, setStudentId] = useState(null)
	const [questionId, setQuestionId] = useState(null)
	const [formData, setFormData] = useState({
		name: "",
		answer: "",
	})

	const svgRef = useRef()

	useEffect(() => {
		getQuestion()
	}, [])

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Handle form submission
		console.log("Form Data: ", formData)
	}

	const getQuestion = async () => {
		const obj = {
			studentId: 12,
			questionId: 12,
		}
		const response = await axios.post("/api/questions/generate", obj)

		const w = 400
		const h = 300
		const svg = d3
			.select(svgRef.current)
			.attr("width", w)
			.attr("height", h)
			.style("overflow", "visible")
			.style("margin-top", "100px")

		const xScale = d3.scaleLinear().domain([0, 12]).range([0, w])
		const yScale = d3.scaleLinear().domain([0, 12]).range([h, 0])

		const xAxis = d3.axisBottom(xScale).ticks(12)
		const yAxis = d3.axisLeft(yScale)
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
		const points = response.data.question.coordinates.map((point) => [
			point.x,
			point.y,
		])
		svg
			.selectAll()
			.data(points)
			.enter()
			.append("circle")
			.attr("cx", (d) => xScale(d[0]))
			.attr("cy", (d) => yScale(d[1]))
			.attr("r", 2)

		console.log("Res", response.data)
		console.log("Points", points)
	}
	return (
		<div className="App">
			<div className="my-5">
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
						label="Answer"
						name="answer"
						value={formData.answer}
						onChange={handleChange}
						placeholder="Type your answer in this format: y=mx+b"
						required
					/>
				</div>
				<button className="btn btn-primary mt-4 btn-block" type="submit">
					Submit
				</button>
			</form>
		</div>
	)
}

export default App
