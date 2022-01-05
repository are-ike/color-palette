import Accordion from '../accordion/index'
import './index.css'

const ColorFormats = ({color}) => {

	return (
		<div>
			<Accordion title="HEX" className="title">
				<div>
					<p>{color.hex}</p>
					<button>hi</button>
				</div>
			</Accordion>
			<Accordion title="RGB">
				<div>
					<p>{color.rgb}</p>
				</div>
			</Accordion>
			<Accordion title="HSL">
				<div>
					<p>{color.hsl}</p>
				</div>
			</Accordion>
			<Accordion title="HSV">
				<div>
					<p>{color.hsv}</p>
					
					<button>hi</button>
				</div>
			</Accordion>
		</div>


	)
}

export default ColorFormats