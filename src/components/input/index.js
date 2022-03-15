import "./index.css";

const Input = ({ isColorInput = false, value, setValue, type, ...props }) => {

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
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
