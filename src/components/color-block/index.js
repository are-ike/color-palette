import Input from '../input/index'
import { faTimes, faLock, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontColorContrast from 'font-color-contrast'
import { useState } from 'react'
import './index.css'


const ColorBlock = 
	({	idx, 
		color, 
		onColorInputChange, 
		lockedColorBlocks, 
		setLockedColorBlocks,
		onColorBlockDelete
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

	const handleLock = () => {
		const curBlocks = lockedColorBlocks.slice()
		curBlocks.push(idx)
		setLockedColorBlocks(curBlocks)
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(currentColor);
		//alert('Copied')
	}

	return(
		<div style={{backgroundColor: `${color.hex}`}} className="color-block">
			<div className="controls">
				<FontAwesomeIcon icon={faTimes} className="icon cancel" onClick={() => onColorBlockDelete(idx)}/>
				<FontAwesomeIcon icon={faCopy} className="icon copy" onClick={handleCopy}/>
				<FontAwesomeIcon icon={faLock} className={!lockedColorBlocks.includes(idx) ? "icon lock" : "icon lock locked"} onClick={handleLock}/>
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