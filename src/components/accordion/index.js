import { useState } from 'react'
import './index.css'

const accordionClasses = {
	content: "content",
	show: "show",
	hide: "hide"
}

const Accordion = ({title, children}) => {
	const [show, SetShowState] = useState(accordionClasses.content)

	// const handleClasses = () => {
	// 	if(show){

	// 	}
	// }

	return (
		<div className="accordion">
			<div className="title" onClick={() => SetShowState(state => !state)}>
				<p>{title}</p>
			</div>
			<div className={show ? accordionClasses.show : accordionClasses.hide}>
				{children}
			</div>
		</div>
	)
}

export default Accordion