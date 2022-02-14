import Input from '../input/index'
import { faTimes, faLock, faCopy, faUnlock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontColorContrast from 'font-color-contrast'
import ColorFormats from '../color-formats/index'
import { useEffect, useState } from 'react'
import { cls } from '../../util/functions'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion/dist/framer-motion'
import './index.css'


const ColorBlock = 
	({
		color, 
		onColorInputChange, 
		onColorBlockDelete,
		onColorBlockLock,
	}) => {
	const [currentColor, setCurrentColor] = useState(color.hex?.slice(1,))
	const [isLoading, setIsLoading] = useState(false)
	const { id } = color
	const fontColor = fontColorContrast(color.hex)
	const iconColor = fontColorContrast(color.hex)

	useEffect(() => {
		setIsLoading(false)
	}, [color])

	const handleColorChange = newColor => {
		setCurrentColor(newColor)
		const newColorHex = `#${newColor}`
		if(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColorHex)){
			setIsLoading(true)
			onColorInputChange({id, newColor: newColorHex})
		}
	}

	const handleCopy = () => {
		toast(<ColorFormats color={color}/>, 
			{
				toastId: "color-formats",
				position: toast.POSITION.BOTTOM_CENTER,
				autoClose: false,
				closeOnClick: false,
				style: {
					cursor: "default"
				}
			})
	}

	return(
		
			<motion.div 
				key={id}
				initial={{width: 0}}
				animate={{width: '100%'}}
				exit={{width: 0, transition: {duration: 0}}}
				transition={{stiffness: 5}}
				style={{backgroundColor: `${color.hex}`}} className={cls("color-block", isLoading ? "loading" : null)}>
				<div className="controls">
					<FontAwesomeIcon style={{color: iconColor}} icon={faTimes} className="icon cancel" onClick={() => onColorBlockDelete(id)}/>
					<FontAwesomeIcon style={{color: iconColor}} icon={faCopy} className="icon copy" onClick={handleCopy}/>
					<FontAwesomeIcon style={{color: iconColor}} icon={!color.locked ? faUnlock : faLock } className={!color.locked ? "icon lock" : "icon lock locked"} onClick={() => onColorBlockLock(id, !color.locked)}/>
				</div>
				<div className="input-container">
					<Input isColorInput value={currentColor} setValue={handleColorChange} style={{color: fontColor}}/>
				</div>
				<div className="color-name">
					<p style={{color: fontColor}}>{color.name}</p>
				</div>
			</motion.div>
		
	)
}

export default ColorBlock