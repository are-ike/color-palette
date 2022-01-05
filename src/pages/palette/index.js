import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Input from '../../components/input/index'
import ColorBlock from '../../components/color-block/index'
import { faFolderOpen, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validate, v4 as uuidv4 } from 'uuid'
import getColorInformation from '../../api/colors'
import './index.css'

const generateRandomHexColor = () => {
	let hex = '#'
	for(let i = 0; i < 6; i++){
		hex += Math.floor( Math.random() * 15 ).toString(16)
	}
	return hex
}


const Palette = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [file, setFile] = useState({ 
		file_id: "", 
		file_name: "", 
		colors: []
	})

	const fileKey = "color-palette-files"

	const getFile = () => {
		const files = localStorage.getItem(fileKey)
		if(files){
			const filesObject = JSON.parse(files)
			const file = filesObject.find(file =>  file.file_id === id)
			return file ? setFile(file) : validate(id) ? generateNewFile() : navigate("*")
		}else{
			navigate("*")
		}
	}
	
	const handleColorCreationAndUpdate = async (currentColor) => {
		const color = !currentColor ? {
			id: uuidv4(),
			hex: generateRandomHexColor(),
			locked: false
		} : currentColor

		const colorObject = await getColorInformation(color)
		return colorObject
	}

	const generateRandomPalette = async (count) => {
		const colors = []

		for(let i = 0; i < count; i++){
			if(!file.colors.length || !file.colors[i]?.locked){
				const colorObject = await handleColorCreationAndUpdate()
				colors.push(colorObject)
			}else{
				colors.push(file.colors[i])
			}
		}
		
		return colors
	}

	async function generateNewFile(){
		const fileList = JSON.parse(localStorage.getItem(fileKey)) ?? []
		const colors = await generateRandomPalette(6)
		
		fileList.push({ 
			file_id: id, 
			file_name: id, 
			colors
		})
		
		localStorage.setItem(fileKey, JSON.stringify(fileList))
		getFile()
	}

	const updateFile = (func, hasCondition, condition) => {
		const update = async () => {
			const fileList = JSON.parse(localStorage.getItem(fileKey)).filter(file => id !== file.file_id)
			const updatedFile = { ...file }
			await func(updatedFile)
			fileList.push(updatedFile)
			localStorage.setItem(fileKey, JSON.stringify(fileList))
			getFile()
		}

		hasCondition ? (condition && update()) : update()
	}

	const onNewPalette = (e) => {
		updateFile( async (newFile) => {
			const colors = await generateRandomPalette(file.colors?.length)
			newFile.colors = [...colors]
		}, true, e.keyCode === 32 && !e.target?.classList?.contains("file-name-input") 
		&& !e.target?.classList?.contains("color-input") 
		&& !e.target?.classList?.contains("number-input"))
	}

	const onFileNameChange = fileName => {
		updateFile( newFile => {
			newFile.file_name = fileName
		})
	}

	const onColorBlockNumberChange = colorNumber => {
		updateFile( async (newFile) => {
			if(colorNumber < file.colors?.length){
				newFile.colors.pop()
			}else{
				const colorObject = await handleColorCreationAndUpdate()
				newFile.colors.push(colorObject)
			}
		})
	}

	const onColorInputChange = ({id, newColor}) => {
		updateFile( async (newFile) => {
			const colorIdx = newFile.colors.findIndex(color => color.id === id)
			if(colorIdx){
				newFile.colors[colorIdx].hex = newColor
				const colorObject = await handleColorCreationAndUpdate(newFile.colors[colorIdx])
				newFile.colors[colorIdx] = { ...colorObject }
			} 
		})
	}

	const onColorBlockDelete = id => {
		updateFile( newFile => {
			if(newFile.colors.length > 1){
				const idx = newFile.colors?.findIndex(color => color.id === id)
				newFile.colors?.splice(idx, 1)
			}else{
				alert("can't delete last block")
			}
		})
	}

	const onColorBlockLock = (id, lockState) => {
		updateFile( newFile => {
			const color = newFile.colors.find(color => color.id === id)
			if(color) color.locked = lockState
		})
	}

	 /* eslint-disable */ 
	useEffect(() => {
		getFile()
	}, [])

	 /* eslint-enable */ 
	useEffect(() => {
		document.addEventListener("keyup", onNewPalette)
		return () => {
			document.removeEventListener("keyup", onNewPalette)
		}
	})
	return(
		<div>
			<header>
				<div className="header-row header-row-one">
					<FontAwesomeIcon icon={faFolderOpen} className="file-open-icon"/>
					<Input value={file.file_name} setValue={onFileNameChange}/>
				</div>
				<div className="header-row header-row-two">
					<p>Press the spacebar to generate a random palette!</p>
					<div className="header-row-segment">
						<Input type="number" min={1} max={6} value={file.colors?.length} setValue={onColorBlockNumberChange}/>
						<Link to="/files">
							<FontAwesomeIcon icon={faListUl} className="list-icon" title="Back to list"/>
						</Link>
					</div>
				</div>		
			</header>
			<main className="color-blocks">
				{file.colors?.map((color, idx) => (
					<ColorBlock 
						key={color.id}
						color={color} 
						onColorInputChange={onColorInputChange}
						onColorBlockDelete={onColorBlockDelete}
						onColorBlockLock={onColorBlockLock}
					/>))}
			</main>
		</div>
	)
}

export default Palette

