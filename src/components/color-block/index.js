import Input from '../input/index'
import { faTimes, faLock, faCopy, faUnlock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontColorContrast from 'font-color-contrast'
import { useState } from 'react'
import './index.css'


const ColorBlock = 
	({	idx, 
		color, 
		onColorInputChange, 
		onColorBlockDelete,
		onColorBlockLock,
	}) => {
	const [currentColor, setCurrentColor] = useState(color.hex)
	const { id } = color
	const fontColor = fontColorContrast(color.hex)

	const handleColorChange = newColor => {
		setCurrentColor(newColor)
		if(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)){
			onColorInputChange({id, newColor})
		}
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(currentColor);
		//alert('Copied')
	}

	return(
		<div style={{backgroundColor: `${color.hex}`}} className="color-block">
			<div className="controls">
				<FontAwesomeIcon icon={faTimes} className="icon cancel" onClick={() => onColorBlockDelete(id)}/>
				<FontAwesomeIcon icon={faCopy} className="icon copy" onClick={handleCopy}/>
				<FontAwesomeIcon icon={!color.locked ? faUnlock : faLock } className={!color.locked ? "icon lock" : "icon lock locked"} onClick={() => onColorBlockLock(id, !color.locked)}/>
			</div>
			<div className="input-container">
				<Input isColorInput value={currentColor} setValue={handleColorChange} style={{color: fontColor}}/>
			</div>
			<div className="color-name">
				<p style={{color: fontColor}}>{color.name}</p>
			</div>
		</div>
	)
}

export default ColorBlock