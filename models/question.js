module.exports = (sequelize, DataTypes) => {
	const Question = sequelize.define("Question", {
		coordinates: {
			type: DataTypes.JSONB,
			allowNull: false,
			validate: {
				isArray(value) {
					if (!Array.isArray(value)) {
						throw new Error("Coordinates must be an array")
					}
				},
			},
		},
		correctAnswer: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lineOfBestFitPoints: {
			type: DataTypes.JSONB, // This will store the slope (m) and intercept (b) as JSON
			allowNull: false,
			validate: {
				isObject(value) {
					if (typeof value !== "object" || Array.isArray(value)) {
						throw new Error("lineOfBestFitPoints must be an object")
					}
				},
			},
		},
	})

	Question.associate = function (models) {
		Question.hasMany(models.Submission, {
			foreignKey: "questionId",
			as: "submissions",
		})
	}

	return Question
}
