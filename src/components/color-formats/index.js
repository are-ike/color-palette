import Accordion from "../accordion/index";
import AccordionColorContent from "../accordion-color-content/index";
import "./index.css";

const ColorFormats = ({ color, isLargeScreen }) => {
  return (
    <div>
      <Accordion title="HEX">
        <AccordionColorContent
          color={color.hex}
          isLargeScreen={isLargeScreen}
        />
      </Accordion>
      <Accordion title="RGB">
        <AccordionColorContent
          color={color.rgb}
          isLargeScreen={isLargeScreen}
        />
      </Accordion>
      <Accordion title="HSL">
        <AccordionColorContent
          color={color.hsl}
          isLargeScreen={isLargeScreen}
        />
      </Accordion>
      <Accordion title="HSV">
        <AccordionColorContent
          color={color.hsv}
          isLargeScreen={isLargeScreen}
        />
      </Accordion>
    </div>
  );
};

export default ColorFormats;
