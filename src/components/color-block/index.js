import Input from "../input/index";
import {
  faTimes,
  faLock,
  faCopy,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontColorContrast from "font-color-contrast";
import ColorFormats from "../color-formats/index";
import { useCallback, useEffect, useRef, useState } from "react";
import { cls } from "../../util/functions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddBlockBtn from "../add-block-btn";
import Loader from "../loader";
import "./index.css";

const ColorBlock = ({
  color,
  onColorInputChange,
  onColorBlockDelete,
  onColorBlockLock,
  onColorBlockAdd,
  setColorFormatsToastId,
  canAddNewBlock,
}) => {
  const [currentColor, setCurrentColor] = useState(color.hex?.slice(1));
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { id } = color;
  const fontColor = fontColorContrast(color.hex);
  const iconColor = fontColorContrast(color.hex);
  const colorBlockRef = useRef();

  useEffect(() => {
    setIsLoading(false);
  }, [color]);

  const showAddBlockBtn = useCallback(
    (e) => {
      if (colorBlockRef.current) {
        const right = colorBlockRef.current.getBoundingClientRect()?.right;
        if (e.screenX >= right) setShow(false);
        if (right - e.screenX < 40) {
          setShow(true);
        } else {
          setShow(false);
        }
      }
    },
    [colorBlockRef.current]
  );

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    const newColorHex = `#${newColor}`;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColorHex)) {
      setIsLoading(true);
      onColorInputChange({
        id,
        newColor: newColor.length === 3 ? newColorHex + newColor : newColorHex,
      });
    }
  };

  const handleCopy = () => {
    const toastId = toast(<ColorFormats color={color} />, {
      toastId: `color-formats-${id}`,
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: false,
      closeOnClick: false,
      style: {
        cursor: "default",
      },
    });
    setColorFormatsToastId(toastId);
  };

  return (
    <div
      ref={colorBlockRef}
      style={{ backgroundColor: `${color.hex}` }}
      className={cls("color-block")}
      onMouseMove={showAddBlockBtn}
    >
      <div className="controls">
        <FontAwesomeIcon
          style={{ color: iconColor }}
          icon={faTimes}
          className="icon cancel"
          data-tip='Remove color'
          onClick={() => onColorBlockDelete(id)}
        />
        <FontAwesomeIcon
          style={{ color: iconColor }}
          icon={faCopy}
          className="icon copy"
          data-tip='Copy code'
          onClick={handleCopy}
        />
        <FontAwesomeIcon
          style={{ color: iconColor }}
          icon={!color.locked ? faUnlock : faLock}
          className={!color.locked ? "icon lock" : "icon lock locked"}
          data-tip='Toggle lock'
          onClick={() => onColorBlockLock(id, !color.locked)}
        />
      </div>
      <div className="input-container">
        <Input
          isColorInput
          value={currentColor}
          setValue={handleColorChange}
          style={{ color: fontColor }}
        />
      </div>
      <div className="color-name">
        <p style={{ color: fontColor }}>{color.name}</p>
      </div>
      {canAddNewBlock && (
        <AddBlockBtn
          className={show ? "btn-visible" : null}
          onClick={() => onColorBlockAdd(id)}
        />
      )}
      {isLoading && (
        <Loader isFullpage={false} classNames="loading" color={iconColor} />
      )}
    </div>
  );
};

export default ColorBlock;
