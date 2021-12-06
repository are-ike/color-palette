import './index.css'
import Input from '../input/index'
import { useState } from 'react'

const ColorBlock = ({idx, color, onColorInputChange}) => {
	const [currentColor, setCurrentColor] = useState(color)

	const handleColorChange = newColor => {
		if(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)){
			onColorInputChange({idx, newColor})
		}else{
			setCurrentColor(newColor)
		}
	}
	return(
		<div style={{backgroundColor: `${color}`}} className="color-block">
			<div className="input-container">

			<Input isColorInput value={currentColor} setValue={handleColorChange}/>
			</div>
		</div>
	)
}

export default ColorBlock