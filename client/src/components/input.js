const Input = ({
	type = "text",
	label,
	name,
	value,
	onChange,
	placeholder = "",
	required = false,
	error = "",
	className = "",
	...props
}) => {
	return (
		<div className={`${className}`}>
			<div className="col-lg-6">
				{label && <label htmlFor={name}>{label}</label>}
				<input
					type={type}
					name={name}
					id={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					className={`form-input ${error ? "input-error" : ""}`}
					{...props}
				/>
				{error && (
					<span className="error-message d-block mt-2 text-danger">
						{error}
					</span>
				)}
			</div>
		</div>
	)
}

export default Input
