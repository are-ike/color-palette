import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import './index.css'
import { v4 as uuidv4 } from 'uuid';

const NewPaletteButton = () => {
	
	return (
		<Link className="new-btn" to={`/palette/${uuidv4()}`}>
			<FontAwesomeIcon icon={faPlus} />
			<p>New Palette</p>
		</Link>
	)
}

export default NewPaletteButton