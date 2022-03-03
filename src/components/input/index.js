import { toast } from "react-toastify";
import "./index.css";

const toastOptions = { autoClose: 1300, position: toast.POSITION.TOP_CENTER };
const Input = ({ isColorInput = false, value, setValue, type, ...props }) => {
  const onValueChange = (value) => {
    if (type === "number") {
      if (value > 0 && value < 7) {
        setValue(value);
      } else if (value < 1) {
        toast.warning("Color block number cannot go below 1", {
          toastId: "min-limit",
          ...toastOptions,
        });
      } else if (value > 6) {
        toast.warning("Max color block limit reached", {
          toastId: "max-limit",
          ...toastOptions,
        });
      }
    } else {
      setValue(value);
    }
    return;
  };

  return (
    <input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      maxLength={isColorInput ? 6 : null}
      className={
        type !== "number"
          ? isColorInput
            ? "color-input"
            : "file-name-input"
          : "number-input"
      }
      type={type}
      {...props}
    />
  );
};

export default Input;
