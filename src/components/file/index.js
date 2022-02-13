import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import './index.css'

const File = ({id, fileName, onDelete }) => {
	const showDelete = () => {
		toast(
			<div className='delete-toast-body'>
				<p className='delete-text'>Are you sure you want to delete palette <span>{fileName}</span>?</p>
				<div className='delete-btns-div'>
					<button className='delete' onClick={onDelete}>Delete</button>
					<button className='cancel' onClick={() => toast.dismiss()} >Cancel</button>
				</div>
			</div>,
			{
				position: toast.POSITION.TOP_CENTER,
				autoClose: false,
				closeButton: false,
				style: {
					cursor: "default"
				}
			}
		)
	}

	return(
		<div className="file">
			<FontAwesomeIcon icon={faFolder} className="file-icon"/>
			<Link className='file-link' to={`/palette/${id}`} >{fileName}</Link>
			<FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={showDelete} title="delete palette"/>
		</div>
	)
}

export default File