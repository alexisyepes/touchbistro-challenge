module.exports = (sequelize, DataTypes) => {
	const Student = sequelize.define("Student", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	})

	Student.associate = function (models) {
		Student.hasMany(models.Submission, {
			foreignKey: "studentId",
			as: "submissions",
		})
	}

	return Student
}
