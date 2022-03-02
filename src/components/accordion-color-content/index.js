import './index.css'
import { toast } from 'react-toastify';
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AccordionColorContent = ({color}) => {
	
	const onCopy = async() => {
		await navigator.clipboard.writeText(color);
		toast("Copied!", {
			toastId: "copied",
			position: toast.POSITION.TOP_CENTER,
			autoClose: 900,
			style: {
				cursor: "default",
			}
		})
	}
	return (
		<div className="color-content">
			<p>{color}</p>
			<FontAwesomeIcon icon={faCopy} className="icon" onClick={onCopy}/>
		</div>
	)
}

export default AccordionColorContent