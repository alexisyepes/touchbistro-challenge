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
	})

	Question.associate = function (models) {
		Question.hasMany(models.Submission, {
			foreignKey: "questionId",
			as: "submissions",
		})
	}

	return Question
}
