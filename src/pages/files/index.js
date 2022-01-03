import { useEffect, useState } from "react"
import File from '../../components/file/index'
import NewPaletteButton from '../../components/new-btn/index'
import './index.css'

const ListOfFiles = () => {
	const [files, setFiles] = useState([])
	const fileKey = "color-palette-files"
	
	const getFiles = () => {
		const files = localStorage.getItem(fileKey)
		files ? setFiles(JSON.parse(files)) : localStorage.setItem(fileKey, JSON.stringify([]))
	}

	const deleteFile = id => {
		const newFiles = files.filter(file => id !== file.file_id)
		localStorage.setItem(fileKey, JSON.stringify(newFiles))
		getFiles()
	}

	useEffect(() => {
		getFiles()
	}, [])
	

	return (
		<div className="files-page">
			{!files ?
				<div>No files</div>
				: 
				(<div>
					<header className="header">
						<h4>Your Color Palettes</h4>
						<NewPaletteButton/>
					</header >
					<main className="file-list">
						{!files.length ?
							<div>No files</div>
							: 
							<div>
								{files.map(file => 
									(
										<File 
											key={file.file_id} 
											id={file.file_id} 
											fileName={file.file_name}
											onDelete={() => deleteFile(file.file_id)}
										/>
									)
								)}
							</div>
						}
					</main>
				</div>)	
			}

		</div>
	)

}

export default ListOfFiles