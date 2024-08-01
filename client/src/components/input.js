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
		<div className={`row ${className}`}>
			<div className="col-lg-6 offset-lg-3">
				{label && (
					<label className="block" htmlFor={name}>
						{label}
					</label>
				)}
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
				{error && <span className="error-message">{error}</span>}
			</div>
		</div>
	)
}

export default Input
