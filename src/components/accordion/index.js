import { useState } from 'react'
import './index.css'
import { cls } from '../../util/functions'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Accordion = ({title, children}) => {
	const [show, SetShow] = useState(false)
	const arrowIcon = show ? faChevronUp : faChevronDown
	

	return (
		<div className="accordion">
			<div className="title" onClick={() => SetShow((state) => !state)}>
				<p>{title}</p>
				<FontAwesomeIcon icon={arrowIcon} className="icon"/>
			</div>
			<div className={cls(show ? "content show" : "content")}>
				{children}
			</div>
		</div>
	)
}

export default Accordion