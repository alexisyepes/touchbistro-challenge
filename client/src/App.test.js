import { render, screen } from "@testing-library/react"
import App from "./App"

jest.mock("d3")
jest.mock("axios")

test("renders line of best fit question", () => {
	render(<App />)

	// Check if the main text is rendered
	const headingElement = screen.getByText(/What's the line of best fit?/i)
	expect(headingElement).toBeInTheDocument()
})

test("renders student name input", () => {
	render(<App />)

	// Check if the input for Student Name is rendered
	const studentNameInput = screen.getByLabelText(/Student Name/i)
	expect(studentNameInput).toBeInTheDocument()
})

test("renders answer input", () => {
	render(<App />)

	// Check if the input for Answer is rendered
	const answerInput = screen.getByLabelText(/Answer/i)
	expect(answerInput).toBeInTheDocument()
})

test("renders the submit answer button", () => {
	render(<App />)

	// Check if the main text is rendered
	const buttonElement = screen.getByText(/Submit Answer/i)
	expect(buttonElement).toBeInTheDocument()
})
