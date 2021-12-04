import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import './index.css'

const File = ({id, fileName, onDelete }) => {

	return(
		<div className="file" >
			<Link to={`/palette/${id}`} className="file-link">
				<FontAwesomeIcon icon={faFolder} className="file-icon"/>
				<h6>{fileName}</h6>
			</Link>
			<FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={onDelete} title="delete palette"/>
		</div>
	)
}

export default File