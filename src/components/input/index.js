import './index.css'

const Input = ({isColorInput = false, value, setValue, type, ...props }) => {

	const onValueChange = value => {
		if(type === "number"){
			if(value > 0 && value < 7){
				setValue(value)
			}else if(value < 1){
				alert('no')
			}else if(value > 6){
				alert('max limit')
			}
		}else{
			setValue(value)
		}
		return
	}

	return (
		<input
			value={value}
			onChange={e => onValueChange(e.target.value)}
			maxLength={isColorInput ? 6 : null}
			className={type !== "number" ? (isColorInput ? "color-input" : "file-name-input") : "number-input"}
			type={type}
			{...props}
		/>

	)
}

export default Input
