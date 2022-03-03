import { useEffect, useState } from "react"
import File from '../../components/file/index'
import NewPaletteButton from '../../components/new-file-btn/index'
import { fileKey } from '../../util/functions'
import Backdrop from "../../components/toast-backdrop"
import './index.css'
import { toast } from "react-toastify"

const ListOfFiles = () => {
	const [files, setFiles] = useState([])
	const [deleteToastId, setDeleteToastId] = useState("")
	const [showBackdrop, setShowBackdrop] = useState(false)
	
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

	useEffect(() => {
		if(deleteToastId){
			setShowBackdrop(true) 
		}
	}, [deleteToastId])
	
	const hideBackdrop = () => {
		setShowBackdrop(false)
		toast.dismiss(deleteToastId)
		setDeleteToastId('')
	}

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
											onDelete={() => 
												{
													deleteFile(file.file_id)
													hideBackdrop()
												} }
											setDeleteToastId={setDeleteToastId}
											onCancel={hideBackdrop}
										/>
									)
								)}
							</div>
						}
					</main>
				</div>)	
			}
			<Backdrop show={showBackdrop} hide={hideBackdrop}/>
		</div>
	)

}

export default ListOfFiles