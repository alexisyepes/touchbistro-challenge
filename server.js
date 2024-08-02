const express = require("express")
const path = require("path")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3001
const app = express()

require("dotenv").config()

// Requiring our models for syncing (Sequelize setup)
const db = require("./models")

// API routes
const studentsRouter = require("./routes/students")
const questionsRouter = require("./routes/questions")

// Middleware setup
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan("dev"))

// Define the single API route
app.use("/api/students", studentsRouter)
app.use("/api/questions", questionsRouter)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "./client/build/index.html"))
	})
}

// Sync database and start the server
db.sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => {
		console.log(`🌎 ==> API server now on port ${PORT}!`)
	})
})

module.exports = app
