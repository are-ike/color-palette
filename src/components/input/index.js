import './index.css'

const Input = ({isColorInput = false, value, setValue, type, ...props }) => {

	const onValueChange = value => {
		if(type === "number"){
			if(value < 7 && value > 0){
				return setValue(value)
			}
		}else{
			if(isColorInput){
				setValue(`#${value}`)
			}else{
				setValue(value)
			}
		}
		return
	}

	return (
		<input
			value={value}
			onChange={e => onValueChange(e.target.value)}
			maxLength={isColorInput ? 7 : null}
			className={type !== "number" ? (isColorInput ? "color-input" : "file-name-input") : "number-input"}
			type={type}
			{...props}
		/>

	)
}

export default Input
