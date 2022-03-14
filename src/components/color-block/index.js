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
import { useEffect, useRef, useState } from "react";
import { cls } from "../../util/functions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
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
  isLastBlock,
}) => {
  const [currentColor, setCurrentColor] = useState(color.hex?.slice(1));
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { id } = color;
  const fontColor = fontColorContrast(color.hex);
  const iconColor = fontColorContrast(color.hex);
  const colorBlockRef = useRef();

  useEffect(() => {
    setCurrentColor(color.hex?.slice(1));
  }, [color?.hex]);

  useEffect(() => {
    setIsLoading(false);
  }, [color]);

  const showAddBlockBtn = (e) => {
    if (colorBlockRef.current) {
      const right = colorBlockRef.current.getBoundingClientRect()?.right;
      if (e.screenX >= right) setShow(false);
      if (right - e.screenX < 40) {
        setShow(true);
      } else {
        setShow(false);
      }
    }
  };

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    const newColorHex = `#${newColor}`;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColorHex) && !color.hex.includes(newColorHex) && !newColorHex.includes(color.hex)) {
      setIsLoading(true);
      onColorInputChange({
        id,
        newColor: newColorHex,
      });
    }
  };

  const handleCopy = () => {
    const toastId = toast(<ColorFormats color={color} />, {
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
          className="icon cancel outline-none"
          data-tip="Remove color"
          onClick={() => onColorBlockDelete(id)}
        />
        <FontAwesomeIcon
          style={{ color: iconColor }}
          icon={faCopy}
          className="icon copy outline-none"
          data-tip="Copy code"
          onClick={handleCopy}
        />
        <FontAwesomeIcon
          style={{ color: iconColor }}
          icon={!color.locked ? faUnlock : faLock}
          className={cls(
            "outline-none icon lock",
            color.locked ? "locked" : null
          )}
          data-tip="Toggle lock"
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
        <p style={{ color: fontColor }} title={color.name}>
          {color.name}
        </p>
      </div>
      {canAddNewBlock && (
        <AddBlockBtn
          className={cls(
            show ? "btn-visible" : null,
            isLastBlock ? "position-r-1" : null
          )}
          onClick={() => onColorBlockAdd(id)}
        />
      )}
      {isLoading && (
        <Loader isFullpage={false} classNames="loading" color={iconColor} />
      )}
      <ReactTooltip effect="solid" delayShow={100} />
    </div>
  );
};

export default ColorBlock;
