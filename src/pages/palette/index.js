import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Input from '../../components/input/index'
import ColorBlock from '../../components/color-block/index'
import { faFolderOpen, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validate } from 'uuid'
import './index.css'

const generateRandomHexColor = () => 
`#${Math.floor( Math.random() * 16777215 ).toString(16)}`

const Palette = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [file, setFile] = useState({ 
		file_id: "", 
		file_name: "", 
		colors: []
	})
	const [lockedColorBlocks, setLockedColorBlocks] = useState([])

	const fileKey = "color-palette-files"

	const getFile = () => {
		const files = localStorage.getItem(fileKey)
		if(files){
			const filesObject = JSON.parse(files)
			const file = filesObject.find(file =>  file.file_id === id)
			return file ? setFile(file) : generateRandomFile()
		}else{
			generateRandomFile()
		}
	}
	
	const generateRandomPalette = (count) => {
		const colors = []

		for(let i = 0; i < count; i++){
			if(!lockedColorBlocks?.includes(i)){
				colors.push(generateRandomHexColor())
			}else{
				colors.push(file.colors[i])
			}
		}

		return colors
	}

	function generateRandomFile(){
		const fileList = JSON.parse(localStorage.getItem(fileKey)) ?? []
		const colors = generateRandomPalette(6)
		
		fileList.push({ 
			file_id: id, 
			file_name: id, 
			colors
		})
		
		localStorage.setItem(fileKey, JSON.stringify(fileList))
		getFile()
	}

	const updateFile = (func, hasCondition, condition) => {
		const update = () => {
			const fileList = JSON.parse(localStorage.getItem(fileKey)).filter(file => id !== file.file_id)
			const updatedFile = { ...file }
			func(updatedFile)
			fileList.push(updatedFile)
			localStorage.setItem(fileKey, JSON.stringify(fileList))
			getFile()
		}

		return hasCondition ? (condition && update()) : update()
	}

	const onNewPalette = (e) => {
		updateFile( newFile => {
			newFile.colors = generateRandomPalette(file.colors?.length)
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
		updateFile( newFile => {
			if(colorNumber < file.colors?.length){
				newFile.colors.pop()
			}else{
				newFile.colors.push(generateRandomHexColor())
			}
		})
	}

	const onColorInputChange = ({idx, newColor}) => {
		updateFile( newFile => {
			newFile.colors[idx] = newColor
		})
	}

	const onColorBlockDelete = idx => {
		updateFile( newFile => {
			newFile.colors?.splice(idx, 1)
		})
	}

	 /* eslint-disable */ 
	useEffect(() => {
		if(!validate(id)){
			return navigate('/files')
		}
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
						key={`${idx}_${color}`}
						idx={idx}
						color={color} 
						onColorInputChange={onColorInputChange}
						lockedColorBlocks={lockedColorBlocks}
						setLockedColorBlocks={setLockedColorBlocks}
						onColorBlockDelete={onColorBlockDelete}
					/>))}
			</main>
		</div>
	)
}

export default Palette