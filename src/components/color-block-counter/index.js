import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { cls } from "../../util/functions";

const toastOptions = { autoClose: 1300, position: toast.POSITION.TOP_CENTER };

const Counter = ({ value, setValue, disabled, maxValue, isLargerScreen }) => {

  const canAdd = value > 0 && value < maxValue;
  const canMinus = value > 1 && value <= maxValue;

  const showToast = () => {
    if (!canMinus) {
      toast.warning("Color block number cannot go below 1", {
        toastId: "min-limit",
        ...toastOptions,
      });
    }
    if (!canAdd) {
      toast.warning("Max color block limit reached", {
        toastId: "max-limit",
        ...toastOptions,
      });
    }
  };

  const add = () => {
    if (canAdd) {
      return setValue(value + 1);
    }
    showToast();
  };

  const minus = () => {
    if (canMinus) {
      return setValue(value - 1);
    }
    showToast();
  };

  return (
    <div className="counter">
      <FontAwesomeIcon
        icon={faMinus}
        onClick={minus}
        data-tip={isLargerScreen ? 'Reduce' : null}
        className={cls("counter-minus outline-none", 
          !canMinus ||
          disabled ? "counter-minus-disabled" : null
        )}
      />
      <input value={value} className="number-input" readOnly />
      <FontAwesomeIcon
        icon={faPlus}
        onClick={add}
        data-tip={isLargerScreen ? 'Add' : null}
        className={cls("counter-add outline-none",
          !canAdd ||
          disabled ? "counter-add-disabled" : null
        )}
      />
      <ReactTooltip effect="solid" delayShow={100} />
    </div>
  );
};

export default Counter;
