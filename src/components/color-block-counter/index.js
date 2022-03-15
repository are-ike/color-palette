import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { cls } from "../../util/functions";

const DEFAULT_BLOCK_NUMBER = 7;
const toastOptions = { autoClose: 1300, position: toast.POSITION.TOP_CENTER };

const Counter = ({ value, setValue, disabled }) => {

  const canAdd = value > 0 && value < DEFAULT_BLOCK_NUMBER;
  const canMinus = value > 1 && value <= DEFAULT_BLOCK_NUMBER;

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
      return setValue((value) => value + 1);
    }
    showToast();
  };

  const minus = () => {
    if (canMinus) {
      return setValue((value) => value - 1);
    }
    showToast();
  };

  return (
    <div className="counter">
      <FontAwesomeIcon
        icon={faMinus}
        onClick={minus}
        data-tip='Reduce'
        className={cls("counter-minus", 
          !canMinus ||
          disabled ? "counter-minus-disabled" : null
        )}
      />
      <input value={value} className="number-input" readOnly />
      <FontAwesomeIcon
        icon={faPlus}
        onClick={add}
        data-tip='Add'
        className={cls("counter-add",
          !canAdd ||
          disabled ? "counter-add-disabled" : null
        )}
      />
      <ReactTooltip effect="solid" delayShow={100} />
    </div>
  );
};

export default Counter;
