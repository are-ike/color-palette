import './index.css'
import { toast } from 'react-toastify';
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip';

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
			<FontAwesomeIcon icon={faCopy} className="icon outline-none" onClick={onCopy} data-tip='Copy'/>
			<ReactTooltip effect="solid" place='left' delayShow={100} arrowColor='transparent'/>
		</div>
	)
}

export default AccordionColorContent