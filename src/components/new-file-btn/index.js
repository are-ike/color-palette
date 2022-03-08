import { Link } from 'react-router-dom'
import './index.css'
import { v4 as uuidv4 } from 'uuid';

const NewPaletteButton = () => {
	
	return (
		<Link className="new-btn" to={`/palette/${uuidv4()}`}>
			<p>Create Palette</p>
		</Link>
	)
}

export default NewPaletteButton