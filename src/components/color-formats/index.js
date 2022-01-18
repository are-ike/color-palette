import Accordion from '../accordion/index'
import AccordionColorContent from '../accordion-color-content/index'
import './index.css'

const ColorFormats = ({color}) => {
	return (
		<div>
			<Accordion title="HEX">
				<AccordionColorContent color={color.hex}/>
			</Accordion>
			<Accordion title="RGB">
				<AccordionColorContent color={color.rgb}/>
			</Accordion>
			<Accordion title="HSL">
				<AccordionColorContent color={color.hsl}/>
			</Accordion>
			<Accordion title="HSV">
				<AccordionColorContent color={color.hsv}/>
			</Accordion>
		</div>


	)
}

export default ColorFormats