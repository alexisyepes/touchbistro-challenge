module.exports = (sequelize, DataTypes) => {
	const Submission = sequelize.define("Submission", {
		answer: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isCorrect: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	})

	Submission.associate = function (models) {
		Submission.belongsTo(models.Student, {
			foreignKey: "studentId",
			as: "student",
		})
		Submission.belongsTo(models.Question, {
			foreignKey: "questionId",
			as: "question",
		})
	}

	return Submission
}
